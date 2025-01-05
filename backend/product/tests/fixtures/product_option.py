import pytest
from ...models import ProductOption, OptionValue


@pytest.fixture
def color_option(product):
    return ProductOption.objects.create(product=product, name="Color")


@pytest.fixture
def red_option_value(color_option):
    return OptionValue.objects.create(option=color_option, name="Red")
