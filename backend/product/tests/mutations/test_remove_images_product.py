import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Product, Image

REMOVE_IMAGES_PRODUCT_MUTATION = """
mutation RemoveImagesProduct(
    $defaultDomain: String!
    $productId: ID!
    $imageIds: [ID]!
) {
    removeImagesProduct(
        defaultDomain: $defaultDomain
        productId: $productId
        imageIds: $imageIds
    ) {
        product {
            productId
            firstVariant {
                images {
                    edges {
                        node {
                            imageId
                        }
                    }
                }
            }
        }
    }
}
"""

@pytest.mark.django_db
def test_remove_images_product_success(
    staff_api_client,
    staff_member,
    store,
    product,
    product_image
):
    """Test successful removal of images from a product."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # First, add the image to the product's first variant
    product.first_variant.images.add(product_image)

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION, 
        variables
    )
    content = get_graphql_content(response)
    
    # Verify the image was removed
    assert content['data']['removeImagesProduct']['product']['productId'] == product.pk
    assert len(product.first_variant.images.all()) == 0


@pytest.mark.django_db
def test_remove_images_product_unauthorized(
    staff_api_client,
    store,
    product,
    product_image,
    staff_member_with_no_permissions,
):
    """Test removing images without store permissions."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION, 
        variables
    )
    
    # Check for permission denied error
    content = get_graphql_content(response, ignore_errors=True)
    assert 'errors' in content
    assert "You do not have permission to update products." in content['errors'][0]['message']
    assert "PERMISSION_DENIED" == content['errors'][0]['extensions']['code']


@pytest.mark.django_db
def test_remove_images_product_nonexistent_store(
    staff_api_client,
    staff_member,
    product,
    product_image
):
    """Test removing images with a non-existent store domain."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": "nonexistent.com",
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION, 
        variables
    )
    
    # Check for store not found error
    content = get_graphql_content(response, ignore_errors=True)
    assert 'errors' in content
    assert "Store not found" in content['errors'][0]['message']
    assert "NOT_FOUND" == content['errors'][0]['extensions']['code']


@pytest.mark.django_db
def test_remove_images_product_nonexistent_product(
    staff_api_client,
    staff_member,
    store,
    product_image
):
    """Test removing images from a non-existent product."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": 99999,  # Non-existent product ID
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION, 
        variables
    )
    
    # Check for product not found error
    content = get_graphql_content(response, ignore_errors=True)
    assert 'errors' in content
    assert "Product not found" in content['errors'][0]['message']
    assert "NOT_FOUND" == content['errors'][0]['extensions']['code']


@pytest.mark.django_db
def test_remove_images_product_multiple_images(
    staff_api_client,
    staff_member,
    store,
    product
):
    """Test removing multiple images from a product."""
    # Create multiple images
    images = [
        Image.objects.create(store=store, alt_text=f"Test Image {i}") 
        for i in range(3)
    ]
    
    # Add images to the product's first variant
    product.first_variant.images.add(*images)

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [img.pk for img in images[:2]]  # Remove first two images
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION, 
        variables
    )
    content = get_graphql_content(response)
    
    # Verify the images were removed
    assert content['data']['removeImagesProduct']['product']['productId'] == product.pk
    assert len(product.first_variant.images.all()) == 1


@pytest.mark.django_db
def test_remove_images_product_no_first_variant(
    staff_api_client,
    staff_member,
    store,
    product_image
):
    """Test removing images from a product without a first variant."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Create a product without a first variant
    product = Product.objects.create(
        store=store,
        title="No First Variant Product",
        first_variant=None
    )

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION,
        variables
    )
    
    # Check for no first variant error
    content = get_graphql_content(response, ignore_errors=True)
    assert 'errors' in content
    assert "Product does not have a first variant." in content['errors'][0]['message']
    assert "NO_FIRST_VARIANT" == content['errors'][0]['extensions']['code']


@pytest.mark.django_db
def test_remove_images_product_invalid_images(
    staff_api_client,
    staff_member,
    store,
    product
):
    """Test removing non-existent or unrelated images."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation with non-existent image IDs
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [99999]  # Non-existent image ID
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(
        REMOVE_IMAGES_PRODUCT_MUTATION,
        variables
    )
    
    # Check for invalid images error
    content = response.json()
    assert 'errors' in content
    assert any(
        'No valid images found for removal' in error['message'] 
        for error in content['errors']
    )
