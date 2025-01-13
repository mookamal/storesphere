import pytest
from core.graphql.tests.utils import get_graphql_content
from stores.models import StorePermission
from stores.enums import StorePermissions

PRODUCT_QUERY = '''
query GetProduct($id: ID!) {
    product(id: $id) {
        productId
        title
        status
        seo {
            title
            description
        }
    }
}
'''

@pytest.mark.django_db
def test_product_success(
    staff_api_client, 
    staff_member, 
    store, 
    product
):
    """Test successful retrieval of a specific product with PRODUCTS_VIEW permission."""
    # Add PRODUCTS_VIEW permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the query
    variables = {
        "id": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    retrieved_product = content['data']['product']
    assert retrieved_product['productId'] == product.id
    assert retrieved_product['title'] == product.title
    assert retrieved_product['status'] == product.status


@pytest.mark.django_db
def test_product_unauthorized(
    staff_api_client, 
    staff_member_with_no_permissions,
    product
):
    """Test retrieving a product without PRODUCTS_VIEW permission."""
    # Use staff member with no permissions
    staff_member_with_no_permissions.store = product.store
    staff_member_with_no_permissions.save()

    # Prepare variables for the query
    variables = {
        "id": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_QUERY,
        variables
    )
    content = response.json()

    # Check error message and code
    error_messages = [error.get('message', '') for error in content['errors']]
    error_codes = [error.get('extensions', {}).get('code', '') for error in content['errors']]
        
    assert "You do not have permission to view products." in error_messages
    assert "PERMISSION_DENIED" in error_codes


@pytest.mark.django_db
def test_product_nonexistent(
    staff_api_client, 
    staff_member, 
    store
):
    """Test retrieving a non-existent product."""
    # Add PRODUCTS_VIEW permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent product ID
    variables = {
        "id": "999999"  # Non-existent ID
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_QUERY, 
        variables
    )
    content = response.json()

    # Verify product not found error
    assert 'errors' in content
    assert any('Product not found' in str(error) for error in content['errors'])
