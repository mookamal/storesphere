import pytest
from product.models import Collection, Product
from stores.models import StaffMember

DELETE_COLLECTIONS_MUTATION = '''
mutation DeleteCollections($collectionIds: [ID]!) {
  deleteCollections(collectionIds: $collectionIds) {
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
        "collectionIds": [str(collection.id)]
    }

    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables
    )

    # Verify response
    assert not Collection.objects.filter(id=collection.id).exists()

@pytest.mark.django_db
def test_delete_collections_unauthorized(staff_api_client, store, collection):
    """Test unauthorized deletion attempt"""
    # Prepare variables for mutation
    variables = {
        "collectionIds": [str(collection.id)]
    }


    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables,
    )

    # Verify error response
    response_json = response.json()
    assert 'errors' in response_json
    assert response_json['errors'][0]['extensions']['code'] == 'PERMISSION_DENIED'
    assert response_json['errors'][0]['extensions']['status'] == 403

@pytest.mark.django_db
def test_delete_collections_with_products(staff_api_client, staff_member, store, collection, product):
    """Test deleting a collection with associated products"""
    # Add product to collection
    collection.products.add(product)

    # Prepare variables for mutation
    variables = {
        "collectionIds": [str(collection.id)]
    }

    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables
    )

    # Verify collection is deleted
    assert not Collection.objects.filter(id=collection.id).exists()
    
    # Verify product still exists
    assert Product.objects.filter(id=product.id).exists()
    
    # Verify product is no longer in the deleted collection
    assert not product.collections.filter(id=collection.id).exists()

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
        "collectionIds": [str(collection.id) for collection in collections]
    }

    # Execute mutation
    response = staff_api_client.post_graphql(
        DELETE_COLLECTIONS_MUTATION,
        variables
    )

    # Verify all collections are deleted
    for collection in collections:
        assert not Collection.objects.filter(id=collection.id).exists()
