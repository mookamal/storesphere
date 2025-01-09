import pytest
from graphql import GraphQLError
from core.graphql.tests.utils import get_graphql_content

PRODUCTS_BY_COLLECTION_QUERY = '''
query ProductsByCollection($collectionId: ID!) {
    productsByCollection(collectionId: $collectionId) {
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
def test_products_by_collection_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    product, 
    active_product
):
    """Test successful retrieval of products in a collection."""
    # Add products to the collection
    collection.products.add(product)
    collection.products.add(active_product)
    collection.save()

    # Link staff member to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables
    variables = {
        "collectionId": collection.id
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCTS_BY_COLLECTION_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify results
    products = content['data']['productsByCollection']['edges']
    assert len(products) == 2
    product_ids = {str(p['node']['productId']) for p in products}
    assert str(product.id) in product_ids
    assert str(active_product.id) in product_ids

@pytest.mark.django_db
def test_products_by_collection_empty(
    staff_api_client, 
    staff_member, 
    store, 
    collection
):
    """Test retrieving an empty collection."""
    # Link staff member to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables
    variables = {
        "collectionId": collection.id
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCTS_BY_COLLECTION_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify results
    products = content['data']['productsByCollection']['edges']
    assert len(products) == 0

@pytest.mark.django_db
def test_products_by_collection_unauthorized(
    staff_api_client, 
    store, 
    collection, 
    product
):
    """Test unauthorized access to products in a collection."""
    # Add a product to the collection
    collection.products.add(product)
    collection.save()

    # Prepare variables
    variables = {
        "collectionId": collection.id
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCTS_BY_COLLECTION_QUERY, 
        variables
    )

    # Verify error message
    assert response.status_code == 200
    content = response.json()
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'AUTHENTICATION_ERROR'

@pytest.mark.django_db
def test_products_by_collection_nonexistent(
    staff_api_client, 
    staff_member, 
    store
):
    """Test retrieving products for a non-existent collection."""
    # Prepare variables
    variables = {
        "collectionId": 99999  # Non-existent ID
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCTS_BY_COLLECTION_QUERY, 
        variables
    )

    # Verify error message
    assert response.status_code == 200
    content = response.json()
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'NOT_FOUND'
