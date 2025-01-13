import pytest
from core.graphql.tests.utils import get_graphql_content
from stores.models import StorePermission
from stores.enums import StorePermissions

ALL_PRODUCTS_QUERY = '''
query AllProducts($defaultDomain: String!) {
    allProducts(defaultDomain: $defaultDomain) {
        edges {
            node {
                productId
                title
                status
            }
        }
    }
}
'''

@pytest.mark.django_db
def test_all_products_success(
    staff_api_client, 
    staff_member, 
    store, 
    product, 
    active_product
):
    """Test successful retrieval of all products for a store with PRODUCTS_VIEW permission."""
    # Add PRODUCTS_VIEW permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_PRODUCTS_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    products = content['data']['allProducts']['edges']
    assert len(products) > 0
    
    # Check that returned products belong to the store
    product_ids = {str(product['node']['productId']) for product in products}
    assert str(product.id) in product_ids
    assert str(active_product.id) in product_ids


@pytest.mark.django_db
def test_all_products_unauthorized(
    staff_api_client, 
    staff_member_with_no_permissions,
    store
):
    """Test retrieving products without PRODUCTS_VIEW permission."""
    # Use staff member with no permissions
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_PRODUCTS_QUERY,
        variables
    )
    content = response.json()

    # Verify unauthorized access
    assert 'errors' in content
    assert any('You do not have permission' in str(error) for error in content['errors'])


@pytest.mark.django_db
def test_all_products_nonexistent_store(
    staff_api_client, 
    staff_member
):
    """Test retrieving products for a non-existent store."""
    # Prepare variables with a non-existent store domain
    variables = {
        "defaultDomain": "nonexistent.store"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_PRODUCTS_QUERY, 
        variables
    )
    content = response.json()

    # Verify store not found error
    assert 'errors' in content
    assert any('Store not found' in str(error) for error in content['errors'])


@pytest.mark.django_db
def test_all_products_filter_by_status(
    staff_api_client, 
    staff_member, 
    store, 
    product, 
    draft_product, 
    active_product
):
    """Test filtering products by status with PRODUCTS_VIEW permission."""
    # Add PRODUCTS_VIEW permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

    # Query for only active products
    active_products_query = '''
    query AllProducts($defaultDomain: String!, $status: ProductProductStatusChoices) {
        allProducts(defaultDomain: $defaultDomain, status: $status) {
            edges {
                node {
                    productId
                    title
                    status
                }
            }
        }
    }
    '''

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain,
        "status": "ACTIVE"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        active_products_query, 
        variables
    )
    content = get_graphql_content(response)

    # Verify only active products are returned
    products = content['data']['allProducts']['edges']
    assert len(products) > 0
    
    for product in products:
        assert product['node']['status'] == 'ACTIVE'
    
    # Ensure draft product is not in the results
    product_ids = {str(product['node']['productId']) for product in products}
    assert str(draft_product.id) not in product_ids
