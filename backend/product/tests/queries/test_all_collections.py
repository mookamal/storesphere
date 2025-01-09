import pytest
from core.graphql.tests.utils import get_graphql_content

ALL_COLLECTIONS_QUERY = '''
query AllCollections($defaultDomain: String!) {
    allCollections(defaultDomain: $defaultDomain) {
        edges {
            node {
                id
                title
                description
            }
        }
    }
}
'''

@pytest.mark.django_db
def test_all_collections_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    winter_collection
):
    """Test successful retrieval of all collections for a store."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    collections = content['data']['allCollections']['edges']
    assert len(collections) > 0
    
    # Check that returned collections belong to the store
    collection_titles = {collection['node']['title'] for collection in collections}
    assert collection.title in collection_titles
    assert winter_collection.title in collection_titles

@pytest.mark.django_db
def test_all_collections_unauthorized(
    staff_api_client, 
    store
):
    """Test retrieving collections without proper store permissions."""
    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify error response
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'AUTHENTICATION_ERROR'

@pytest.mark.django_db
def test_all_collections_nonexistent_store(
    staff_api_client
):
    """Test retrieving collections for a non-existent store."""
    # Prepare variables for the query
    variables = {
        "defaultDomain": "nonexistent.domain"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify error response
    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'NOT_FOUND'
