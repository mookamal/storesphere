from django.core.exceptions import ValidationError
from django.db import transaction
from .models import Product, ProductOption, OptionValue, ProductVariant, Collection

MAX_OPTION_NAME_LENGTH = 50
MAX_OPTION_VALUES_COUNT = 10

@transaction.atomic
def update_product_options_and_values(product, updated_options):
    if not updated_options:
        return
    
    # Validate total number of options
    if len(updated_options) > MAX_OPTION_VALUES_COUNT:
        raise ValidationError(f"Maximum {MAX_OPTION_VALUES_COUNT} options are allowed")
    
    # Collect option names to check for duplicates
    option_names = []
    
    existing_options = ProductOption.objects.filter(product=product)
    existing_option_ids = {option.id for option in existing_options}

    options_to_keep = set()

    for option_data in updated_options:
        # Validate option name
        option_name = option_data['name'].strip()
        if not option_name:
            raise ValidationError("Option name cannot be empty")
        
        if len(option_name) > MAX_OPTION_NAME_LENGTH:
            raise ValidationError(f"Option name must be less than {MAX_OPTION_NAME_LENGTH} characters")
        
        # Check for duplicate option names
        if option_name in option_names:
            raise ValidationError(f"Duplicate option name: {option_name}")
        option_names.append(option_name)

        try:
            if 'id' in option_data:
                # Update existing option
                option = ProductOption.objects.get(
                    id=option_data['id'], product=product)
                option.name = option_name
                option.save()
                options_to_keep.add(option.id)
            else:
                # Create new option
                option = ProductOption.objects.create(
                    product=product, name=option_name)
                options_to_keep.add(option.id)

            # Validate and process option values
            existing_values = OptionValue.objects.filter(option=option)
            existing_value_ids = {value.id for value in existing_values}
            values_to_keep = set()
            
            # Validate total number of values
            if len(option_data['values']) > MAX_OPTION_VALUES_COUNT:
                raise ValidationError(f"Maximum {MAX_OPTION_VALUES_COUNT} values are allowed per option")
            
            # Collect value names to check for duplicates
            value_names = []

            for value_data in option_data['values']:
                # Validate value name
                value_name = value_data['name'].strip()
                if not value_name:
                    raise ValidationError("Option value name cannot be empty")
                
                if len(value_name) > MAX_OPTION_NAME_LENGTH:
                    raise ValidationError(f"Option value name must be less than {MAX_OPTION_NAME_LENGTH} characters")
                
                # Check for duplicate value names within the same option
                if value_name in value_names:
                    raise ValidationError(f"Duplicate value name: {value_name}")
                value_names.append(value_name)

                try:
                    if 'id' in value_data:
                        # Update existing value
                        value = OptionValue.objects.get(
                            id=value_data['id'], option=option)
                        value.name = value_name
                        value.save()
                        values_to_keep.add(value.id)
                    else:
                        # Create new value
                        value = OptionValue.objects.create(
                            option=option, name=value_name)
                        values_to_keep.add(value.id)
                except OptionValue.DoesNotExist:
                    raise ValidationError(f"Invalid option value ID: {value_data.get('id')}")

            # Remove values not in the update
            for value in existing_values:
                if value.id not in values_to_keep:
                    value.delete()

        except ProductOption.DoesNotExist:
            raise ValidationError(f"Invalid option ID: {option_data.get('id')}")

    # Remove options not in the update
    for option in existing_options:
        if option.id not in options_to_keep:
            option.delete()


def add_values_to_variant(variant, option_value_ids):
    if not variant:
        return
    if not option_value_ids:
        return
    option_values = OptionValue.objects.filter(id__in=option_value_ids)
    # check in product to values is same product to variant
    for value in option_values:
        if value.option.product != variant.product:
            raise ValueError("Option values must belong to the same product.")
    get_variant_has_same_values = ProductVariant.objects.filter(
        product=variant.product, selected_options__in=option_values).distinct()
    for existing_variant in get_variant_has_same_values:
        existing_option_values = set(existing_variant.selected_options.all())
        if existing_option_values == set(option_values):
            raise ValueError("This variant already exists.")

    variant.selected_options.add(*option_values)
    variant.save()


def update_product_collections(product, collection_ids):
    # Handle None or empty list explicitly
    if not collection_ids:
        # If no collection_ids are provided, clear all existing collections
        product.collections.clear()
        return {"message": "All collections removed.", "added": [], "removed": list(product.collections.values_list('id', flat=True))}
        
    current_collection_ids = set(
        product.collections.values_list('id', flat=True))

    try:
        new_collection_ids = set([int(i) for i in collection_ids])
    except (ValueError, TypeError):
        raise ValueError("All collection IDs must be valid integers.")

    if current_collection_ids == new_collection_ids:
        return {"message": "No changes needed.", "added": [], "removed": []}

    added_collections = new_collection_ids - current_collection_ids
    removed_collections = current_collection_ids - new_collection_ids

    if added_collections:
        product.collections.add(*added_collections)
    if removed_collections:
        product.collections.remove(*removed_collections)

    return {"added": list(added_collections), "removed": list(removed_collections)}
