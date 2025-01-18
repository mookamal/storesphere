import json
import pytest
from product.models import ProductVariant
from stores.models import StorePermission
from stores.enums import StorePermissions
from core.graphql.tests.utils import get_graphql_content
from core.utils.constants import StorePermissionErrors

UPDATE_PRODUCT_VARIANT_MUTATION = '''
    mutation UpdateProductVariant($variantInputs: ProductVariantInput!) {
        updateProductVariant(variantInputs: $variantInputs) {
            productVariant {
                id
                priceAmount
                compareAtPrice
                stock
            }
        }
    }
'''


@pytest.mark.django_db
def test_update_product_variant_success(staff_api_client, store, staff_member, product_variant):
    """Test successful product variant update by store owner."""
    variables = {
        "variantInputs": {
            "variantId": str(product_variant.id),
            "price": 150.0,
            "compareAtPrice": 170.0,
            "stock": 15
        }
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION, variables)
    content = get_graphql_content(response)
    variant_data = content["data"]["updateProductVariant"]["productVariant"]

    assert float(variant_data["priceAmount"]) == 150.0
    assert float(variant_data["compareAtPrice"]) == 170.0
    assert variant_data["stock"] == 15


@pytest.mark.django_db
def test_update_product_variant_with_permission(staff_api_client, store, staff_member_with_no_permissions, product_variant):
    """Test product variant update with explicit PRODUCTS_UPDATE permission."""
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_UPDATE.codename
    )
    staff_member_with_no_permissions.permissions.add(store_permission)
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    variables = {
        "variantInputs": {
            "variantId": str(product_variant.id),
            "price": 150.0,
            "compareAtPrice": 170.0,
            "stock": 15
        }
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION, variables)
    content = get_graphql_content(response)
    variant_data = content["data"]["updateProductVariant"]["productVariant"]

    assert float(variant_data["priceAmount"]) == 150.0
    assert float(variant_data["compareAtPrice"]) == 170.0
    assert variant_data["stock"] == 15


@pytest.mark.django_db
def test_update_product_variant_unauthorized(staff_api_client, store, staff_member_with_no_permissions, product_variant):
    """Test product variant update without PRODUCTS_UPDATE permission."""
    variables = {
        "variantInputs": {
            "variantId": str(product_variant.id),
            "price": 150.0,
            "compareAtPrice": 170.0,
            "stock": 15
        }
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert StorePermissionErrors.PERMISSION_DENIED["message"] in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == StorePermissionErrors.PERMISSION_DENIED["code"]


@pytest.mark.django_db
def test_update_product_variant_invalid_price(staff_api_client, store, staff_member, product_variant):
    """Test updating product variant with invalid (negative) price."""
    variables = {
        "variantInputs": {
            "variantId": str(product_variant.id),
            "price": -100.0,
            "compareAtPrice": 50.0,
            "stock": 15
        }
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert "Price cannot be negative" in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "INVALID_PRICE"


@pytest.mark.django_db
def test_update_product_variant_not_found(staff_api_client, store, staff_member):
    """Test updating a non-existent product variant."""
    variables = {
        "variantInputs": {
            "variantId": "999999",
            "price": 150.0,
            "compareAtPrice": 170.0,
            "stock": 15
        }
    }

    response = staff_api_client.post_graphql(
        UPDATE_PRODUCT_VARIANT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert content['errors'][0]['message'] == "Product variant not found."
    assert content['errors'][0]['extensions']['code'] == "NOT_FOUND"
