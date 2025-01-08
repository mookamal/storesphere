import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Collection, Image
from stores.models import Store

CREATE_COLLECTION_MUTATION = """
mutation CreateCollection(
    $defaultDomain: String!
    $collectionInputs: CollectionInputs!
) {
    createCollection(
        defaultDomain: $defaultDomain
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
def test_create_collection_success(
    staff_api_client,
    staff_member,
    store,
    product_image
):
    """Test successful collection creation with all details."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Summer Sale",
            "description": "Best summer deals",
            "handle": "summer-sale",
            "imageId": product_image.pk,
            "seo": {
                "title": "Summer Sale Collection",
                "description": "Amazing summer discounts"
            }
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['createCollection']['collection']
    assert collection_data['title'] == "Summer Sale"
    assert collection_data['description'] == "Best summer deals"
    assert collection_data['handle'] == "summer-sale"
    assert collection_data['image']['imageId'] == product_image.pk
    assert collection_data['seo']['title'] == "Summer Sale Collection"
    assert collection_data['seo']['description'] == "Amazing summer discounts"

    # Verify database state
    collection = Collection.objects.get(title="Summer Sale")
    assert collection.store == store
    assert collection.image == product_image
    assert collection.seo.title == "Summer Sale Collection"


@pytest.mark.django_db
def test_create_collection_unauthorized(
    staff_api_client,
    store
):
    """Test creating a collection without store permissions."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Unauthorized Collection",
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for permission denied error
    content = response.json()
    assert 'errors' in content
    assert any(
        'You are not authorized' in error['message'] 
        for error in content['errors']
    )


@pytest.mark.django_db
def test_create_collection_nonexistent_store(
    staff_api_client,
    staff_member
):
    """Test creating a collection with a non-existent store."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": "nonexistent.com",
        "collectionInputs": {
            "title": "Nonexistent Store Collection",
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for store not found error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Store with the provided domain does not exist' in error['message'] 
        for error in content['errors']
    )


@pytest.mark.django_db
def test_create_collection_minimal_details(
    staff_api_client,
    staff_member,
    store
):
    """Test creating a collection with minimal required details."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Minimal Collection",
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['createCollection']['collection']
    assert collection_data['title'] == "Minimal Collection"
    assert collection_data['description'] == ""
    assert collection_data['seo']['title'] == "Minimal Collection"

    # Verify database state
    collection = Collection.objects.get(title="Minimal Collection")
    assert collection.store == store
    assert collection.description == ""
    assert collection.seo.title == "Minimal Collection"


@pytest.mark.django_db
def test_create_collection_with_optional_image(
    staff_api_client,
    staff_member,
    store,
    product_image
):
    """Test creating a collection with an optional image."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Image Collection",
            "imageId": product_image.pk
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify collection details
    collection_data = content['data']['createCollection']['collection']
    assert collection_data['title'] == "Image Collection"
    assert collection_data['image']['imageId'] == product_image.pk

    # Verify database state
    collection = Collection.objects.get(title="Image Collection")
    assert collection.image == product_image


@pytest.mark.django_db
def test_create_collection_duplicate_handle(
    staff_api_client,
    staff_member,
    store
):
    """Test creating a collection with a duplicate handle."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Create initial collection
    Collection.objects.create(
        store=store,
        title="First Collection",
        handle="first-collection"
    )

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Duplicate Collection",
            "handle": "first-collection"
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
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
def test_create_collection_long_title(
    staff_api_client,
    staff_member,
    store
):
    """Test creating a collection with an excessively long title."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation with a very long title
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "A" * 300,  # Exceeds 255 characters
            "handle": "very-long-title-collection"
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for title too long error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Collection title is too long' in error['message'] 
        for error in content['errors']
    )


@pytest.mark.django_db
def test_create_collection_invalid_image(
    staff_api_client,
    staff_member,
    store
):
    """Test creating a collection with an image from a different store."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Create an image from a different store
    another_store = Store.objects.create(
        name="Another Store", 
        default_domain="another.com"
    )
    invalid_image = Image.objects.create(
        store=another_store, 
        alt_text="Invalid Image"
    )

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "Image Collection",
            "handle": "image-collection",
            "imageId": invalid_image.pk
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    
    # Check for invalid image error
    content = response.json()
    assert 'errors' in content
    assert any(
        'Image not found or does not belong to this store' in error['message'] 
        for error in content['errors']
    )


@pytest.mark.django_db
def test_create_collection_seo_truncation(
    staff_api_client,
    staff_member,
    store
):
    """Test SEO data truncation for long titles and descriptions."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation with very long SEO data
    variables = {
        "defaultDomain": store.default_domain,
        "collectionInputs": {
            "title": "SEO Truncation Test",
            "handle": "seo-truncation",
            "seo": {
                "title": "A" * 100,  # Exceeds 70 characters
                "description": "B" * 200  # Exceeds 160 characters
            }
        }
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        CREATE_COLLECTION_MUTATION, 
        variables
    )
    content = get_graphql_content(response)

    # Verify SEO data truncation
    collection_data = content['data']['createCollection']['collection']
    assert len(collection_data['seo']['title']) <= 70
    assert len(collection_data['seo']['description']) <= 160
