from django.db import transaction
from .models import Product, ProductOption, OptionValue, ProductVariant, Collection


@transaction.atomic
def update_product_options_and_values(product, updated_options):
    if not updated_options:
        return
        
    existing_options = ProductOption.objects.filter(product=product)
    existing_option_ids = {option.id for option in existing_options}

    options_to_keep = set()

    for option_data in updated_options:
        if 'id' in option_data:
            option = ProductOption.objects.get(
                id=option_data['id'], product=product)
            option.name = option_data['name']
            option.save()
            options_to_keep.add(option.id)
        else:
            option = ProductOption.objects.create(
                product=product, name=option_data['name'])

        existing_values = OptionValue.objects.filter(option=option)
        existing_value_ids = {value.id for value in existing_values}
        values_to_keep = set()

        for value_data in option_data['values']:
            if 'id' in value_data:
                value = OptionValue.objects.get(
                    id=value_data['id'], option=option)
                value.name = value_data['name']
                value.save()
                values_to_keep.add(value.id)
            else:
                value = OptionValue.objects.create(
                    option=option, name=value_data['name'])
                values_to_keep.add(value.id)

        for value in existing_values:
            if value.id not in values_to_keep:
                value.delete()

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
    if not collection_ids:
        return
        
    current_collection_ids = set(
        product.collections.values_list('id', flat=True))

    try:
        new_collection_ids = set([int(i) for i in collection_ids])
    except ValueError:
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
