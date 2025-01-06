import pytest
import graphene
from core.graphql.tests.utils import get_graphql_content
from ...models import ProductVariant
from decimal import Decimal


CREATE_PRODUCT_VARIANT_MUTATION = """
mutation CreateProductVariant(
    $productId: ID!
    $variantInputs: ProductVariantInput!
) {
    createProductVariant(
        productId: $productId
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
        "variantInputs": variant_input
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    
    # Verify the response
    variant_data = content["data"]["createProductVariant"]["productVariant"]
    assert variant_data["id"] is not None
    assert round(float(variant_data["pricing"]["amount"]), 2) == round(variant_input["price"], 2)

    # Verify the variant was created in the database
    created_variant = ProductVariant.objects.get(pk=variant_data["variantId"])
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
        "variantInputs": variant_input
    }

    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    assert "errors" in content
    assert len(content["errors"]) > 0
    assert content["errors"][0]["extensions"]["code"] == "PERMISSION_DENIED"


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
            "variantInputs": {k: v for k, v in invalid_input.items() if k != "expected_error"}
        }

        response = staff_api_client.post_graphql(
            CREATE_PRODUCT_VARIANT_MUTATION,
            variables
        )
        content = get_graphql_content(response, ignore_errors=True)

        assert "errors" in content, f"No errors for input: {invalid_input}"
        assert len(content["errors"]) > 0
        assert any(invalid_input["expected_error"] in str(error) for error in content["errors"])


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
        "variantInputs": variant_input_with_optional
    }

    response = staff_api_client.post_graphql(
        CREATE_PRODUCT_VARIANT_MUTATION,
        variables
    )
    content = get_graphql_content(response)

    variant_data = content["data"]["createProductVariant"]["productVariant"]
    assert variant_data["id"] is not None
    assert abs(float(variant_data["pricing"]["amount"]) - variant_input_with_optional["price"]) < 0.01

    # Verify the variant was created in the database
    created_variant = ProductVariant.objects.get(pk=variant_data["variantId"])
    assert abs(created_variant.price_amount - Decimal(str(variant_input_with_optional["price"]))) < Decimal('0.01')
    assert created_variant.stock == variant_input_with_optional["stock"]
