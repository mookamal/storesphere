from django.db import transaction
from .models import ProductOption, OptionValue


@transaction.atomic
def update_product_options_and_values(product, updated_options):
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
