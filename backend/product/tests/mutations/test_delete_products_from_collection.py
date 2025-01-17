import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Collection


DELETE_PRODUCTS_FROM_COLLECTION_MUTATION = '''
mutation DeleteProductsFromCollection(
    $collectionId: ID!
    $productIds: [ID]!
    $defaultDomain: String!
) {
    deleteProductsFromCollection(
        collectionId: $collectionId
        productIds: $productIds
        defaultDomain: $defaultDomain
    ) {
        success
    }
}
'''

@pytest.mark.django_db
def test_delete_products_from_collection_success(
    staff_api_client, 
    staff_member, 
    store, 
    collection, 
    product, 
    active_product
):
    """Test successful deletion of products from a collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # First, add products to the collection
    collection.products.add(product, active_product)

    # Prepare variables for the mutation
    variables = {
        "collectionId": str(collection.id),
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain,
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        DELETE_PRODUCTS_FROM_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify mutation response
    assert content['data']['deleteProductsFromCollection']['success'] is True

    # Verify products were removed from the collection
    updated_collection = Collection.objects.get(id=collection.id)
    remaining_products = updated_collection.products.all()
    
    assert product not in remaining_products
    assert active_product not in remaining_products


@pytest.mark.django_db
def test_delete_products_from_collection_unauthorized(
    staff_api_client, 
    store, 
    collection, 
    product,
    staff_member_with_no_permissions,
    active_product
):
    """Test deleting products from a collection without proper permissions."""
    # First, add products to the collection
    collection.products.add(product, active_product)

    # Prepare variables for the mutation
    variables = {
        "collectionId": str(collection.id),
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain,
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        DELETE_PRODUCTS_FROM_COLLECTION_MUTATION,
        variables
    )
    content = get_graphql_content(response , ignore_errors=True)

    # Verify unauthorized access
    assert 'errors' in content
    assert "You do not have permission to update collections." in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "PERMISSION_DENIED"


@pytest.mark.django_db
def test_delete_products_from_collection_nonexistent_collection(
    staff_api_client, 
    staff_member, 
    store, 
    product, 
    active_product
):
    """Test deleting products from a non-existent collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent collection ID
    variables = {
        "collectionId": "999999",  # Non-existent ID
        "productIds": [str(product.id), str(active_product.id)],
        "defaultDomain": store.default_domain,
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        DELETE_PRODUCTS_FROM_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response , ignore_errors=True)

    # Verify collection not found error
    assert 'errors' in content
    assert "Collection not found" in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "NOT_FOUND"


@pytest.mark.django_db
def test_delete_products_from_collection_nonexistent_products(
    staff_api_client, 
    staff_member, 
    store, 
    collection
):
    """Test deleting non-existent products from a collection."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with non-existent product IDs
    variables = {
        "collectionId": str(collection.id),
        "productIds": ["999999", "888888"],  # Non-existent product IDs
        "defaultDomain": store.default_domain,
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        DELETE_PRODUCTS_FROM_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response , ignore_errors=True)

    # Verify error for non-existent products
    assert 'errors' in content
    assert "One or more products not found or do not belong to this store." in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "INVALID_PRODUCTS"
