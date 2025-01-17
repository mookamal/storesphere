import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Collection

UPDATE_COLLECTION_MUTATION = """
mutation UpdateCollection(
    $collectionId: ID!
    $collectionInputs: CollectionInputs!
) {
    updateCollection(
        collectionId: $collectionId
        collectionInputs: $collectionInputs
    ) {
        collection {
            title
            description
            handle
            image {
                imageId
            }
            seo {
                title
                description
            }
        }
    }
}
"""

@pytest.mark.django_db
def test_update_collection_partial_update(
    staff_api_client,
    staff_member,
    store,
    collection,
    product_image
):
    """Test partial update of a collection."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": "Updated Collection Title",
            "imageId": product_image.pk
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['updateCollection']['collection']
    assert collection_data['title'] == "Updated Collection Title"
    assert str(collection_data['image']['imageId']) == str(product_image.pk)

    # Verify database state
    updated_collection = Collection.objects.get(pk=collection.pk)
    assert updated_collection.title == "Updated Collection Title"
    assert updated_collection.image == product_image


@pytest.mark.django_db
def test_update_collection_unauthorized(
    staff_api_client,
    store,
    staff_member_with_no_permissions,
    collection
):
    """Test updating a collection without store permissions."""
    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": "Unauthorized Update"
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for permission denied error
    content = get_graphql_content(response , ignore_errors=True)
    assert 'errors' in content
    assert "You do not have permission to update collections." in content['errors'][0]['message']
    assert "PERMISSION_DENIED" == content['errors'][0]['extensions']['code']


@pytest.mark.django_db
def test_update_collection_nonexistent(
    staff_api_client,
    staff_member,
    store
):
    """Test updating a non-existent collection."""
    # Prepare variables for the mutation
    variables = {
        "collectionId": 99999,  # Non-existent collection ID
        "collectionInputs": {
            "title": "Nonexistent Collection"
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for collection not found error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Collection not found' in error['message'] 
        for error in content['errors']
    )


@pytest.mark.django_db
def test_update_collection_full_update(
    staff_api_client,
    staff_member,
    store,
    collection,
    product_image
):
    """Test full update of a collection with all fields."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": "Completely New Title",
            "description": "Brand new description",
            "handle": "new-handle",
            "imageId": product_image.pk,
            "seo": {
                "title": "SEO Title",
                "description": "SEO Description"
            }
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['updateCollection']['collection']
    assert collection_data['title'] == "Completely New Title"
    assert collection_data['description'] == "Brand new description"
    assert collection_data['handle'] == "new-handle"
    assert str(collection_data['image']['imageId']) == str(product_image.pk)
    assert collection_data['seo']['title'] == "SEO Title"
    assert collection_data['seo']['description'] == "SEO Description"

    # Verify database state
    updated_collection = Collection.objects.get(pk=collection.pk)
    assert updated_collection.title == "Completely New Title"
    assert updated_collection.description == "Brand new description"
    assert updated_collection.handle == "new-handle"
    assert updated_collection.image == product_image
    assert updated_collection.seo.title == "SEO Title"
    assert updated_collection.seo.description == "SEO Description"


@pytest.mark.django_db
def test_update_collection_remove_image(
    staff_api_client,
    staff_member,
    store,
    collection,
    product_image
):
    """Test removing an image from a collection."""
    # Add image to collection first
    collection.image = product_image
    collection.save()

    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": collection.title,
            "imageId": None
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION,
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['updateCollection']['collection']
    assert collection_data.get('image') is None

    # Verify database state
    updated_collection = Collection.objects.get(pk=collection.pk)
    assert updated_collection.image is None


@pytest.mark.django_db
def test_update_collection_invalid_image(
    staff_api_client,
    staff_member,
    store,
    collection
):
    """Test updating collection with an invalid image."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": collection.title,
            "imageId": 99999  # Use a non-existent image ID
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION,
        variables
    )

    # Check for invalid image error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Image with the given ID not found' in error['message']
        for error in content['errors']
    )


@pytest.mark.django_db
def test_update_collection_duplicate_handle(
    staff_api_client,
    staff_member,
    store,
    collection
):
    """Test updating a collection with a duplicate handle."""
    # Create another collection in the same store
    another_collection = Collection.objects.create(
        store=store, 
        title="Another Collection", 
        handle="another-collection"
    )

    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": collection.title,
            "handle": another_collection.handle
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION,
        variables
    )

    # Check for duplicate handle error
    content = response.json()
    assert 'errors' in content
    assert any(
        'A collection with this handle already exists' in error['message']
        for error in content['errors']
    )


@pytest.mark.django_db
def test_update_collection_long_title(
    staff_api_client,
    staff_member,
    store,
    collection
):
    """Test updating a collection with a title that is too long."""
    # Prepare variables for the mutation
    variables = {
        "collectionId": collection.pk,
        "collectionInputs": {
            "title": "A" * 300,  # Exceeds 255 characters
            "handle": collection.handle
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        UPDATE_COLLECTION_MUTATION,
        variables
    )

    # Check for title too long error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Collection title cannot exceed 255 characters' in error['message']
        for error in content['errors']
    )
