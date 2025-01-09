import pytest
from core.graphql.tests.utils import get_graphql_content

GET_IMAGES_PRODUCT_QUERY = '''
query GetImagesProduct($productId: ID!) {
    getImagesProduct(productId: $productId) {
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
def test_get_images_product_success(
    staff_api_client, 
    staff_member, 
    store, 
    product,
    product_image,
    product_video,
    product_variant
):
    """Test successful retrieval of product images."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Set the first variant for the product
    product.first_variant = product_variant
    product.save()

    # Manually associate images with the product variant
    product_variant.images.add(product_image)
    product_variant.videos.add(product_video)
    product_variant.save()

    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        GET_IMAGES_PRODUCT_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    images = content['data']['getImagesProduct']['edges']
    assert len(images) > 0
    
    # Check that returned images belong to the product
    image_ids = {image['node']['imageId'] for image in images}
    assert product_image.id in image_ids
    assert product_video.id in image_ids


@pytest.mark.django_db
def test_get_images_product_unauthorized(
    staff_api_client, 
    product
):
    """Test retrieving product images without proper store permissions."""
    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        GET_IMAGES_PRODUCT_QUERY,
        variables
    )
    content = response.json()

    # Verify unauthorized access
    assert 'errors' in content
    assert any('You are not authorized to access this store' in str(error) for error in content['errors'])
    assert any(error.get('extensions', {}).get('code') == 'AUTHENTICATION_ERROR' for error in content['errors'])


@pytest.mark.django_db
def test_get_images_product_nonexistent(
    staff_api_client, 
    staff_member, 
    store
):
    """Test retrieving images for a non-existent product."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent product ID
    variables = {
        "productId": "999999"  # Non-existent ID
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        GET_IMAGES_PRODUCT_QUERY, 
        variables
    )
    content = response.json()

    # Verify product not found error
    assert 'errors' in content
    assert any('Product not found' in str(error) for error in content['errors'])
    assert any(error.get('extensions', {}).get('code') == 'NOT_FOUND' for error in content['errors'])


@pytest.mark.django_db
def test_get_images_product_order(
    staff_api_client, 
    staff_member, 
    store, 
    product,
    product_image,
    product_video,
    product_variant
):
    """Test that product images are returned in descending order of creation."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Manually associate images with the product variant
    product_variant.images.add(product_image)
    product_variant.videos.add(product_video)
    product_variant.save()

    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        GET_IMAGES_PRODUCT_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    images = content['data']['getImagesProduct']['edges']
    # Check that images are in descending order
    image_dates = [image['node']['createdAt'] for image in images]
    assert image_dates == sorted(image_dates, reverse=True)
