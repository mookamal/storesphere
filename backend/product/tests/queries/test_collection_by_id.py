import base64
import pytest
from core.graphql.tests.utils import get_graphql_content

COLLECTION_BY_ID_QUERY = '''
query CollectionById($id: ID!) {
    collectionById(id: $id) {
        id
        collectionId
        title
        description
        productsCount
    }
}
'''

@pytest.mark.django_db
def test_collection_by_id_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection
):
    """Test successful retrieval of a specific collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()


    
    variables = {
        "id": collection.id
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTION_BY_ID_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    retrieved_collection = content['data']['collectionById']
    assert retrieved_collection['title'] == collection.title
    assert int(retrieved_collection['collectionId']) == collection.id

@pytest.mark.django_db
def test_collection_by_id_unauthorized(
    staff_api_client, 
    store, 
    collection
):
    """Test retrieving a collection without proper store permissions."""

    
    variables = {
        "id": collection.id
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTION_BY_ID_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify error response
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'AUTHENTICATION_ERROR'

@pytest.mark.django_db
def test_collection_by_id_nonexistent(
    staff_api_client, 
    staff_member
):
    """Test retrieving a non-existent collection."""
    # Prepare variables for the query
    # Use a very large ID that is unlikely to exist
    variables = {
        "id": "999999"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTION_BY_ID_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify error response
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'NOT_FOUND'
