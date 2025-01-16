import pytest
from product.models import ProductVariant
from stores.models import StorePermission
from stores.enums import StorePermissions
from core.graphql.tests.utils import get_graphql_content

PERFORM_ACTION_ON_VARIANTS_MUTATION = '''
    mutation PerformActionOnVariants($action: VariantActions!, $variantIds: [ID!]!) {
        performActionOnVariants(action: $action, variantIds: $variantIds) {
            success
            message
            errors
        }
    }
'''


@pytest.mark.django_db
def test_perform_action_on_variants_delete_success(staff_api_client, store, staff_member, product_variant):
    """Test successful deletion of product variants by store owner."""
    variables = {
        "action": "DELETE",
        "variantIds": [str(product_variant.id)]
    }

    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION, variables)
    content = get_graphql_content(response)
    data = content["data"]["performActionOnVariants"]

    assert data["success"] is True
    assert data["message"] == "Product variants deleted successfully."
    assert ProductVariant.objects.filter(id=product_variant.id).count() == 0


@pytest.mark.django_db
def test_perform_action_on_variants_with_permission(staff_api_client, store, staff_member_with_no_permissions, product_variant):
    """Test deletion of product variants with explicit PRODUCTS_UPDATE permission."""
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_UPDATE.codename
    )
    staff_member_with_no_permissions.permissions.add(store_permission)
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    variables = {
        "action": "DELETE",
        "variantIds": [str(product_variant.id)]
    }

    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION, variables)
    content = get_graphql_content(response)
    data = content["data"]["performActionOnVariants"]

    assert data["success"] is True
    assert data["message"] == "Product variants deleted successfully."
    assert ProductVariant.objects.filter(id=product_variant.id).count() == 0


@pytest.mark.django_db
def test_perform_action_on_variants_unauthorized(staff_api_client, store, staff_member_with_no_permissions, product_variant):
    """Test deletion of product variants without PRODUCTS_UPDATE permission."""
    variables = {
        "action": "DELETE",
        "variantIds": [str(product_variant.id)]
    }

    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert "You do not have permission to perform actions on product variants." in content[
        'errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "PERMISSION_DENIED"


@pytest.mark.django_db
def test_perform_action_on_variants_not_found(staff_api_client, store, staff_member):
    """Test deletion of non-existent product variants."""
    variables = {
        "action": "DELETE",
        "variantIds": ["999999"]
    }

    response = staff_api_client.post_graphql(
        PERFORM_ACTION_ON_VARIANTS_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert content['errors'][0]['message'] == "Product variant not found."
    assert content['errors'][0]['extensions']['code'] == "NOT_FOUND"
