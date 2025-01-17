import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Collection

ADD_PRODUCTS_TO_COLLECTION_MUTATION = '''
mutation AddProductsToCollection(
    $collectionId: ID!
    $productIds: [ID]!
    $defaultDomain: String!
) {
    addProductsToCollection(
        collectionId: $collectionId
        productIds: $productIds
        defaultDomain: $defaultDomain
    ) {
        success
    }
}
'''

@pytest.mark.django_db
def test_add_products_to_collection_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    product, 
    active_product
):
    """Test successful addition of products to a collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "collectionId": str(collection.id),
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        ADD_PRODUCTS_TO_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify mutation response
    assert content['data']['addProductsToCollection']['success'] is True

    # Verify products were added to the collection
    updated_collection = Collection.objects.get(id=collection.id)
    added_products = updated_collection.products.all()
    
    assert product in added_products
    assert active_product in added_products


@pytest.mark.django_db
def test_add_products_to_collection_unauthorized(
    staff_api_client, 
    store, 
    collection, 
    product, 
    staff_member_with_no_permissions,
    active_product
):
    """Test adding products to a collection without proper permissions."""
    # Prepare variables for the mutation
    variables = {
        "collectionId": str(collection.id),
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        ADD_PRODUCTS_TO_COLLECTION_MUTATION,
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify unauthorized access
    assert 'errors' in content
    assert "You do not have permission to update collections." in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "PERMISSION_DENIED"


@pytest.mark.django_db
def test_add_products_to_collection_nonexistent_collection(
    staff_api_client, 
    staff_member, 
    store, 
    product, 
    active_product
):
    """Test adding products to a non-existent collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent collection ID
    variables = {
        "collectionId": "999999",  # Non-existent ID
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        ADD_PRODUCTS_TO_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify collection not found error
    assert 'errors' in content
    assert "Collection not found" in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "NOT_FOUND"


@pytest.mark.django_db
def test_add_products_to_collection_invalid_products(
    staff_api_client, 
    staff_member, 
    store, 
    collection,
    product
):
    """Test adding non-existent or invalid products to a collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with invalid and valid product IDs
    variables = {
        "collectionId": str(collection.id),
        "productIds": ["999999", str(product.id), "888888"],  # Mix of non-existent and valid product IDs
        "defaultDomain": store.default_domain
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        ADD_PRODUCTS_TO_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response, ignore_errors=True)

    # Verify error for invalid products
    assert 'errors' in content
    assert "One or more products not found or do not belong to this store." in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "INVALID_PRODUCTS"
