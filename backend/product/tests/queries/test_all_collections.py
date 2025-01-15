import pytest
from core.graphql.tests.utils import get_graphql_content
from stores.models import StorePermission
from stores.enums import StorePermissions

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
    staff_member.store = store
    staff_member.save()

    variables = {
        "defaultDomain": store.default_domain
    }

    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    collections = content['data']['allCollections']['edges']
    assert len(collections) > 0
    
    collection_titles = {collection['node']['title'] for collection in collections}
    assert collection.title in collection_titles
    assert winter_collection.title in collection_titles

@pytest.mark.django_db
def test_all_collections_staff_member_with_permission(
    staff_api_client, 
    staff_member_with_no_permissions,
    store, 
    collection, 
    winter_collection
):
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member_with_no_permissions.permissions.add(store_permission)
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    variables = {
        "defaultDomain": store.default_domain
    }

    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    collections = content['data']['allCollections']['edges']
    assert len(collections) > 0
    
    collection_titles = {collection['node']['title'] for collection in collections}
    assert collection.title in collection_titles
    assert winter_collection.title in collection_titles

@pytest.mark.django_db
def test_all_collections_unauthorized(
    staff_api_client, 
    staff_member_with_no_permissions,
    store
):
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    variables = {
        "defaultDomain": store.default_domain
    }

    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    error_messages = [error.get('message', '') for error in content['errors']]
    error_codes = [error.get('extensions', {}).get('code', '') for error in content['errors']]
        
    assert "You do not have permission to view products." in error_messages
    assert "PERMISSION_DENIED" in error_codes

@pytest.mark.django_db
def test_all_collections_nonexistent_store(
    staff_api_client
):
    variables = {
        "defaultDomain": "nonexistent.domain"
    }

    response = staff_api_client.post_graphql(
        ALL_COLLECTIONS_QUERY, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert content['errors'][0]['extensions']['code'] == 'NOT_FOUND'
