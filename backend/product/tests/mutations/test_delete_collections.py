import pytest
from product.models import Collection, Product
from stores.models import StaffMember
from core.utils.constants import StorePermissionErrors

DELETE_COLLECTIONS_MUTATION = '''
mutation DeleteCollections($collectionIds: [ID]!, $defaultDomain: String!) {
  deleteCollections(collectionIds: $collectionIds, defaultDomain: $defaultDomain) {
    success
  }
}
'''

@pytest.mark.django_db
def test_delete_collections_success(staff_api_client, staff_member, store, collection):
    """Test successful deletion of collections"""
    # Ensure the staff member belongs to the store
    assert StaffMember.objects.filter(user=staff_member.user, store=store).exists()

    # Prepare variables for mutation
    variables = {
        "collectionIds": [str(collection.id)],
        "defaultDomain": store.default_domain
    }

    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables
    )

    # Verify response
    assert not Collection.objects.filter(id=collection.id).exists()

@pytest.mark.django_db
def test_delete_collections_unauthorized(staff_api_client, store, collection,staff_member_with_no_permissions):
    """Test unauthorized deletion attempt"""
    # Prepare variables for mutation
    variables = {
        "collectionIds": [str(collection.id)],
        "defaultDomain": store.default_domain
    }


    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables,
    )

    # Verify error response
    response_json = response.json()
    assert 'errors' in response_json
    assert response_json['errors'][0]['extensions']['code'] == StorePermissionErrors.PERMISSION_DENIED["code"]
    assert StorePermissionErrors.PERMISSION_DENIED["message"] in response_json['errors'][0]['message']

@pytest.mark.django_db
def test_delete_multiple_collections(staff_api_client, staff_member, store):
    """Test deleting multiple collections"""
    # Create multiple collections
    collections = [
        Collection.objects.create(store=store, title=f'Collection {i}') 
        for i in range(3)
    ]

    # Prepare variables for mutation
    variables = {
        "collectionIds": [str(collection.id) for collection in collections],
        "defaultDomain": store.default_domain
    }

    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables
    )

    # Verify all collections are deleted
    for collection in collections:
        assert not Collection.objects.filter(id=collection.id).exists()
