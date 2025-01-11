import pytest
from graphql import GraphQLError
from core.graphql.tests.utils import get_graphql_content

COLLECTIONS_FIND_QUERY = '''
query CollectionsFind($defaultDomain: String!, $title: String) {
    collectionsFind(defaultDomain: $defaultDomain, title: $title) {
        edges {
            node {
                id
                collectionId
                title
                description
            }
        }
    }
}
'''

@pytest.mark.django_db
def test_collections_find_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    winter_collection
):
    """Test successful retrieval of collections for a store."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTIONS_FIND_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    collections = content['data']['collectionsFind']['edges']
    assert len(collections) > 0
    
    # Check that returned collections belong to the store
    collection_titles = {collection['node']['title'] for collection in collections}
    assert collection.title in collection_titles
    assert winter_collection.title in collection_titles

@pytest.mark.django_db
def test_collections_find_filter_by_title(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    winter_collection
):
    """Test filtering collections by title."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with title filter
    variables = {
        "defaultDomain": store.default_domain,
        "title": collection.title
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTIONS_FIND_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    collections = content['data']['collectionsFind']['edges']
    assert len(collections) == 1
    assert collections[0]['node']['title'] == collection.title

@pytest.mark.django_db
def test_collections_find_unauthorized(
    staff_api_client, 
    store, 
    collection
):
    """Test unauthorized access to collections."""
    # Prepare variables
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query with no permissions
    response = staff_api_client.post_graphql(
        COLLECTIONS_FIND_QUERY, 
        variables,
        permissions=[]  # Remove all permissions
    )

    # Verify error message
    assert response.status_code == 200
    content = response.json()
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'AUTHENTICATION_ERROR'

@pytest.mark.django_db
def test_collections_find_nonexistent_store(
    staff_api_client, 
    staff_member
):
    """Test retrieving collections for a non-existent store."""
    # Prepare variables
    variables = {
        "defaultDomain": "nonexistent.domain"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        COLLECTIONS_FIND_QUERY, 
        variables
    )

    # Verify error message
    assert response.status_code == 200
    content = response.json()
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'NOT_FOUND'
