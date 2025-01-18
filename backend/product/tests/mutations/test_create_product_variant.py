import pytest
import graphene
from core.graphql.tests.utils import get_graphql_content
from ...models import ProductVariant
from decimal import Decimal


CREATE_PRODUCT_VARIANT_MUTATION = """
mutation CreateProductVariant(
    $productId: ID!
    $variantInputs: ProductVariantInput!
    $defaultDomain: String!
) {
    createProductVariant(
        productId: $productId
        variantInputs: $variantInputs
        defaultDomain: $defaultDomain
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
def test_create_product_variant_success(
    staff_api_client, 
    staff_member, 
    product
):
    """Test successful creation of a product variant."""
    # Prepare variant input data
    variant_input = {
        "variantId": None,
        "price": 19.99,
        "stock": 100,
        "compareAtPrice": None,
        "optionValues": []
    }

    # Prepare variables for the mutation
    variables = {
        "productId": product.pk,
        "variantInputs": variant_input,
        "defaultDomain": product.store.default_domain
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Print content if there are errors
    if 'errors' in content:
        print("Mutation Errors:", content['errors'])
    
    # Verify the response
    variant_data = content.get("data", {}).get("createProductVariant", {}).get("productVariant")
    assert variant_data is not None, "Product variant creation failed"
    assert variant_data.get("id") is not None
    assert round(float(variant_data.get("pricing", {}).get("amount", 0)), 2) == round(variant_input["price"], 2)

    # Verify the variant was created in the database
    created_variant = ProductVariant.objects.get(pk=variant_data.get("variantId"))
    assert abs(created_variant.price_amount - Decimal(str(variant_input["price"]))) < Decimal('0.01')
    assert created_variant.stock == variant_input["stock"]


@pytest.mark.django_db
def test_create_product_variant_without_permissions(
    staff_api_client,
    product
):
    """Test creating a product variant without proper permissions."""
    variant_input = {
        "variantId": None,
        "price": 19.99,
        "stock": 100,
        "compareAtPrice": None,
        "optionValues": []
    }

    variables = {
        "productId": product.pk,
        "variantInputs": variant_input,
        "defaultDomain": product.store.default_domain
    }

    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    assert "errors" in content, "Expected errors for unauthorized mutation"
    assert len(content["errors"]) > 0
    error_extensions = content["errors"][0].get("extensions", {})
    assert error_extensions.get("code") in ["NOT_STAFF_MEMBER", "PERMISSION_DENIED"], \
        f"Unexpected error: {content['errors']}"


@pytest.mark.django_db
def test_create_product_variant_with_invalid_inputs(
    staff_api_client,
    staff_member,
    product
):
    """Test creating a product variant with invalid inputs."""
    invalid_inputs = [
        # Negative price
        {
            "variantId": None,
            "price": -10.00,
            "stock": 100,
            "compareAtPrice": None,
            "optionValues": [],
            "expected_error": "Price cannot be negative"
        },
        # Negative stock
        {
            "variantId": None,
            "price": 19.99,
            "stock": -50,
            "compareAtPrice": None,
            "optionValues": [],
            "expected_error": "Stock cannot be negative"
        }
    ]

    for invalid_input in invalid_inputs:
        variables = {
            "productId": product.pk,
            "variantInputs": {k: v for k, v in invalid_input.items() if k != "expected_error"},
            "defaultDomain": product.store.default_domain
        }

        response = staff_api_client.post_graphql(
            CREATE_PRODUCT_VARIANT_MUTATION,
            variables
        )
        content = get_graphql_content(response, ignore_errors=True)

        assert "errors" in content, f"No errors for input: {invalid_input}"
        assert len(content["errors"]) > 0
        
        # Print errors for debugging
        print(f"Errors for input {invalid_input}: {content['errors']}")
        
        # Check if the expected error is in the error messages
        assert any(invalid_input["expected_error"] in str(error) for error in content["errors"]), \
            f"Expected error not found for input: {invalid_input}"


@pytest.mark.django_db
def test_create_product_variant_with_optional_fields(
    staff_api_client,
    staff_member,
    product
):
    """Test creating a product variant with optional fields."""
    variant_input_with_optional = {
        "variantId": None,
        "price": 29.99,
        "stock": 50,
        "compareAtPrice": None,
        "optionValues": []
    }

    variables = {
        "productId": product.pk,
        "variantInputs": variant_input_with_optional,
        "defaultDomain": product.store.default_domain
    }

    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Print content if there are errors
    if 'errors' in content:
        print("Mutation Errors:", content['errors'])

    variant_data = content.get("data", {}).get("createProductVariant", {}).get("productVariant")
    assert variant_data is not None, "Product variant creation failed"
    assert variant_data.get("id") is not None
    assert abs(float(variant_data.get("pricing", {}).get("amount", 0)) - variant_input_with_optional["price"]) < 0.01

    # Verify the variant was created in the database
    created_variant = ProductVariant.objects.get(pk=variant_data.get("variantId"))
    assert abs(created_variant.price_amount - Decimal(str(variant_input_with_optional["price"]))) < Decimal('0.01')
    assert created_variant.stock == variant_input_with_optional["stock"]


@pytest.mark.django_db
def test_create_product_variant_with_option_values(
    staff_api_client,
    staff_member,
    product,
    color_option,
    red_option_value
):
    """Test creating a product variant with option values."""
    variant_input_with_option_values = {
        "variantId": None,
        "price": 29.99,
        "stock": 50,
        "compareAtPrice": None,
        "optionValues": [red_option_value.pk]
    }

    variables = {
        "productId": product.pk,
        "variantInputs": variant_input_with_option_values,
        "defaultDomain": product.store.default_domain
    }

    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Print content if there are errors
    if 'errors' in content:
        print("Mutation Errors:", content['errors'])

    variant_data = content.get("data", {}).get("createProductVariant", {}).get("productVariant")
    assert variant_data is not None, "Product variant creation failed"
    assert variant_data.get("id") is not None
    assert len(variant_data.get("selectedOptions", [])) == 1
    assert variant_data["selectedOptions"][0]["id"] == str(red_option_value.pk)