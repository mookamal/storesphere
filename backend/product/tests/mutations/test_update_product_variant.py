import pytest
from core.graphql.tests.utils import get_graphql_content
from decimal import Decimal
from django.contrib.auth import get_user_model
from ...models import ProductVariant

UPDATE_PRODUCT_VARIANT_MUTATION = """
mutation UpdateProductVariant(
    $variantInputs: ProductVariantInput!
) {
    updateProductVariant(
        variantInputs: $variantInputs
    ) {
        productVariant {
            id
            variantId
            pricing {
                amount
                currency
            }
            selectedOptions {
                id
                name
            }
        }
    }
}
"""

@pytest.mark.django_db
def test_update_product_variant_success(
    staff_api_client, 
    staff_member,
    product_variant
):
    """Test successful update of a product variant."""
    # Prepare variant update input data
    variant_input = {
        "variantId": product_variant.pk,
        "price": 29.99,
        "stock": 150
    }

    # Prepare variables for the mutation
    variables = {
        "variantInputs": variant_input
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify the response
    variant_data = content.get("data", {}).get("updateProductVariant", {}).get("productVariant", {})
    assert variant_data, "No product variant data in response"
    assert variant_data.get("id") is not None, "Variant ID is missing"
    assert round(float(variant_data.get("pricing", {}).get("amount", 0)), 2) == round(variant_input["price"], 2)

    # Verify the variant was updated in the database
    updated_variant = ProductVariant.objects.get(pk=product_variant.pk)
    assert abs(updated_variant.price_amount - Decimal(str(variant_input["price"]))) < Decimal('0.01')
    assert updated_variant.stock == variant_input["stock"]


@pytest.mark.django_db
def test_update_product_variant_without_permissions(
    staff_api_client,
    product_variant
):
    """Test updating a product variant without proper permissions."""
    variant_input = {
        "variantId": product_variant.pk,
        "price": 29.99,
        "stock": 150
    }

    variables = {
        "variantInputs": variant_input
    }

    # Remove staff permissions by creating a new user
    User = get_user_model()
    no_permission_user = User.objects.create_user(
        email='no_permission@example.com',
        password='testpass'
    )
    staff_api_client.user = no_permission_user

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    assert "errors" in content, "Expected errors for unauthorized user"
    assert len(content["errors"]) > 0
    assert any("permission" in str(error).lower() for error in content["errors"])


@pytest.mark.django_db
def test_update_product_variant_with_invalid_inputs(
    staff_api_client,
    staff_member,
    product_variant
):
    """Test updating a product variant with invalid inputs."""
    invalid_inputs = [
        # Negative price
        {
            "variantId": product_variant.pk,
            "price": -10.00,
            "stock": 100,
            "expected_error": "Price cannot be negative"
        },
        # Negative stock
        {
            "variantId": product_variant.pk,
            "price": 19.99,
            "stock": -50,
            "expected_error": "Stock cannot be negative"
        }
    ]

    for invalid_input in invalid_inputs:
        variables = {
            "variantInputs": {k: v for k, v in invalid_input.items() if k != "expected_error"}
        }

        response = staff_api_client.post_graphql(
            UPDATE_PRODUCT_VARIANT_MUTATION,
            variables
        )
        content = get_graphql_content(response, ignore_errors=True)

        assert "errors" in content, f"No errors for input: {invalid_input}"
        assert len(content["errors"]) > 0
        
        # Print errors for debugging
        print(f"Errors for input {invalid_input}: {content['errors']}")
        
        assert any(invalid_input["expected_error"] in str(error) for error in content["errors"]), \
            f"Expected error '{invalid_input['expected_error']}' not found"


@pytest.mark.django_db
def test_update_product_variant_not_found(
    staff_api_client,
    staff_member
):
    """Test updating a non-existent product variant."""
    variant_input = {
        "variantId": 999999,  # Non-existent variant ID
        "price": 29.99,
        "stock": 150
    }

    variables = {
        "variantInputs": variant_input
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    assert "errors" in content, "Expected errors for non-existent variant"
    assert len(content["errors"]) > 0
    
    # Print errors for debugging
    print(f"Errors for non-existent variant: {content['errors']}")
    
    assert any("not found" in str(error).lower() for error in content["errors"]), \
        "Expected 'not found' error not present"

# test update product variant with option values
def test_update_product_variant_with_option_values(
    staff_api_client):
    pass