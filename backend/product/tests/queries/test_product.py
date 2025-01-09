import pytest
from core.graphql.tests.utils import get_graphql_content

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
    """Test successful retrieval of a specific product."""
    # Ensure staff member is associated with the store
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
    product
):
    """Test retrieving a product without proper store permissions."""
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

    # Verify unauthorized access
    assert 'errors' in content
    assert any('You are not authorized to access this product' in str(error) for error in content['errors'])


@pytest.mark.django_db
def test_product_nonexistent(
    staff_api_client, 
    staff_member, 
    store
):
    """Test retrieving a non-existent product."""
    # Ensure staff member is associated with the store
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
