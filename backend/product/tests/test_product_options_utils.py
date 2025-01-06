import pytest
from django.core.exceptions import ValidationError
from django.db import transaction
from product.models import Product, ProductOption, OptionValue
from product.utils import update_product_options_and_values, MAX_OPTION_NAME_LENGTH, MAX_OPTION_VALUES_COUNT

@pytest.mark.django_db
def test_update_product_options_max_options(product):
    """Test that more than MAX_OPTION_VALUES_COUNT options raise a ValidationError."""
    options = [
        {"name": f"Option {i}", "values": []} for i in range(MAX_OPTION_VALUES_COUNT + 1)
    ]
    
    with pytest.raises(ValidationError, match=f"Maximum {MAX_OPTION_VALUES_COUNT} options are allowed"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_duplicate_names(product):
    """Test that duplicate option names raise a ValidationError."""
    options = [
        {"name": "Color", "values": []},
        {"name": "Color", "values": []}
    ]
    
    with pytest.raises(ValidationError, match="Duplicate option name: Color"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_empty_name(product):
    """Test that empty option names raise a ValidationError."""
    options = [
        {"name": "", "values": []}
    ]
    
    with pytest.raises(ValidationError, match="Option name cannot be empty"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_long_name(product):
    """Test that option names longer than MAX_OPTION_NAME_LENGTH raise a ValidationError."""
    long_name = "A" * (MAX_OPTION_NAME_LENGTH + 1)
    options = [
        {"name": long_name, "values": []}
    ]
    
    with pytest.raises(ValidationError, match=f"Option name must be less than {MAX_OPTION_NAME_LENGTH} characters"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_update_existing(product):
    """Test updating an existing option."""
    # First, create an initial option
    initial_options = [{"name": "Color", "values": []}]
    update_product_options_and_values(product, initial_options)
    
    # Get the created option
    initial_option = ProductOption.objects.get(product=product, name="Color")
    
    # Update the option name
    updated_options = [{"id": initial_option.id, "name": "Colour", "values": []}]
    update_product_options_and_values(product, updated_options)
    
    # Verify the option name was updated
    initial_option.refresh_from_db()
    assert initial_option.name == "Colour"

@pytest.mark.django_db
def test_update_product_options_with_values(product):
    """Test creating and updating options with values."""
    options = [
        {
            "name": "Color", 
            "values": [
                {"name": "Red"},
                {"name": "Blue"}
            ]
        }
    ]
    
    update_product_options_and_values(product, options)
    
    # Verify option and values were created
    option = ProductOption.objects.get(product=product, name="Color")
    assert option is not None
    
    values = list(OptionValue.objects.filter(option=option))
    assert len(values) == 2
    assert {v.name for v in values} == {"Red", "Blue"}

@pytest.mark.django_db
def test_update_product_options_max_values_per_option(product):
    """Test that more than MAX_OPTION_VALUES_COUNT values per option raise a ValidationError."""
    options = [
        {
            "name": "Color", 
            "values": [
                {"name": f"Value {i}"} for i in range(MAX_OPTION_VALUES_COUNT + 1)
            ]
        }
    ]
    
    with pytest.raises(ValidationError, match=f"Maximum {MAX_OPTION_VALUES_COUNT} values are allowed per option"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_duplicate_values(product):
    """Test that duplicate value names within an option raise a ValidationError."""
    options = [
        {
            "name": "Color", 
            "values": [
                {"name": "Red"},
                {"name": "Red"}
            ]
        }
    ]
    
    with pytest.raises(ValidationError, match="Duplicate value name: Red"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_empty_value(product):
    """Test that empty value names raise a ValidationError."""
    options = [
        {
            "name": "Color", 
            "values": [
                {"name": ""}
            ]
        }
    ]
    
    with pytest.raises(ValidationError, match="Option value name cannot be empty"):
        update_product_options_and_values(product, options)

@pytest.mark.django_db
def test_update_product_options_long_value_name(product):
    """Test that value names longer than MAX_OPTION_NAME_LENGTH raise a ValidationError."""
    long_name = "A" * (MAX_OPTION_NAME_LENGTH + 1)
    options = [
        {
            "name": "Color", 
            "values": [
                {"name": long_name}
            ]
        }
    ]
    
    with pytest.raises(ValidationError, match=f"Option value name must be less than {MAX_OPTION_NAME_LENGTH} characters"):
        update_product_options_and_values(product, options)
