import pytest
from core.graphql.tests.utils import get_graphql_content

ALL_MEDIA_IMAGES_QUERY = '''
query AllMediaImages($defaultDomain: String!) {
    allMediaImages(defaultDomain: $defaultDomain) {
        edges {
            node {
                imageId
                altText
                createdAt
            }
        }
    }
}
'''

@pytest.mark.django_db
def test_all_media_images_success(
    staff_api_client, 
    staff_member, 
    store, 
    product_image,
    product_video
):
    """Test successful retrieval of all media images for a store."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_MEDIA_IMAGES_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    images = content['data']['allMediaImages']['edges']
    assert len(images) > 0
    
    # Check that returned images belong to the store
    image_ids = {image['node']['imageId'] for image in images}
    assert product_image.id in image_ids
    assert product_video.id in image_ids


@pytest.mark.django_db
def test_all_media_images_unauthorized(
    staff_api_client, 
    store
):
    """Test retrieving media images without proper store permissions."""
    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_MEDIA_IMAGES_QUERY,
        variables
    )
    content = response.json()

    # Verify unauthorized access
    assert 'errors' in content
    assert any('You are not authorized to access this store' in str(error) for error in content['errors'])
    assert any(error.get('extensions', {}).get('code') == 'AUTHENTICATION_ERROR' for error in content['errors'])


@pytest.mark.django_db
def test_all_media_images_nonexistent_store(
    staff_api_client, 
    staff_member
):
    """Test retrieving media images for a non-existent store."""
    # Prepare variables with a non-existent store domain
    variables = {
        "defaultDomain": "nonexistent.store"
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_MEDIA_IMAGES_QUERY, 
        variables
    )
    content = response.json()

    # Verify store not found error
    assert 'errors' in content
    assert any('Store not found' in str(error) for error in content['errors'])
    assert any(error.get('extensions', {}).get('code') == 'NOT_FOUND' for error in content['errors'])


@pytest.mark.django_db
def test_all_media_images_order(
    staff_api_client, 
    staff_member, 
    store, 
    product_image,
    product_video
):
    """Test that media images are returned in descending order of creation."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the query
    variables = {
        "defaultDomain": store.default_domain
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        ALL_MEDIA_IMAGES_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    images = content['data']['allMediaImages']['edges']
    
    # Check that images are in descending order
    image_dates = [image['node']['createdAt'] for image in images]
    assert image_dates == sorted(image_dates, reverse=True)
