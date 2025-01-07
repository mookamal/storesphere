import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Image

ADD_IMAGES_PRODUCT_MUTATION = """
mutation AddImagesProduct(
    $defaultDomain: String!
    $productId: ID!
    $imageIds: [ID]
) {
    addImagesProduct(
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
def test_add_images_product_success(
    staff_api_client,
    staff_member,
    store,
    product,
    product_image
):
    """Test successful addition of images to a product."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        ADD_IMAGES_PRODUCT_MUTATION,
        variables
    )
    content = get_graphql_content(response)

    # Refresh the product to get the latest data
    product.refresh_from_db()

    # Get the first variant and its images
    first_variant = product.first_variant
    variant_images = first_variant.images.all()

    # GraphQL response images
    graphql_image_ids = [
        int(edge["node"]["imageId"]) 
        for edge in content["data"]["addImagesProduct"]["product"]["firstVariant"]["images"]["edges"]
    ]

    # Assertions
    assert str(content["data"]["addImagesProduct"]["product"]["productId"]) == str(product.pk)
    assert len(content["data"]["addImagesProduct"]["product"]["firstVariant"]["images"]["edges"]) > 0
    
    # Verify the image is added to the variant and appears in GraphQL response
    assert product_image in variant_images, f"Image {product_image.pk} not found in variant images"
    assert product_image.pk in graphql_image_ids, f"Image {product_image.pk} not found in GraphQL response"

@pytest.mark.django_db
def test_add_images_product_unauthorized(
    staff_api_client,
    store,
    product,
    product_image
):
    """Test adding images to a product without store permissions."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        ADD_IMAGES_PRODUCT_MUTATION,
        variables
    )

    # Assertions
    assert response.status_code == 200
    content = get_graphql_content(response, ignore_errors=True)
    assert "errors" in content
    assert any(
        "You are not authorized" in str(error["message"]) 
        for error in content["errors"]
    )

@pytest.mark.django_db
def test_add_images_product_nonexistent_store(
    staff_api_client,
    staff_member,
    product,
    product_image
):
    """Test adding images to a product with a non-existent store domain."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": "nonexistent-store.com",
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        ADD_IMAGES_PRODUCT_MUTATION,
        variables
    )

    # Assertions
    assert response.status_code == 200
    content = get_graphql_content(response, ignore_errors=True)
    assert "errors" in content
    assert any(
        "Store with the provided domain does not exist" in str(error["message"]) 
        for error in content["errors"]
    )

@pytest.mark.django_db
def test_add_images_product_nonexistent_product(
    staff_api_client,
    staff_member,
    store,
    product_image
):
    """Test adding images to a non-existent product."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": "999999",  # Non-existent product ID
        "imageIds": [product_image.pk]
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        ADD_IMAGES_PRODUCT_MUTATION,
        variables
    )

    # Assertions
    assert response.status_code == 200
    content = get_graphql_content(response, ignore_errors=True)
    assert "errors" in content
    assert any(
        "Product not found" in str(error["message"]) 
        for error in content["errors"]
    )

@pytest.mark.django_db
def test_add_images_product_multiple_images(
    staff_api_client,
    staff_member,
    store,
    product
):
    """Test adding multiple images to a product."""
    # Ensure staff member has permission to the store
    staff_member.store = store
    staff_member.save()

    # Create multiple test images
    images = [
        Image.objects.create(store=store, alt_text=f"Test Image {i}")
        for i in range(3)
    ]

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [img.pk for img in images]
    }

    # Perform the mutation
    response = staff_api_client.post_graphql(
        ADD_IMAGES_PRODUCT_MUTATION,
        variables
    )
    content = get_graphql_content(response)

    # Refresh the product to get the latest data
    product.refresh_from_db()

    # Get the first variant and its images
    first_variant = product.first_variant
    variant_images = first_variant.images.all()

    # GraphQL response images
    graphql_image_ids = [
        int(edge["node"]["imageId"]) 
        for edge in content["data"]["addImagesProduct"]["product"]["firstVariant"]["images"]["edges"]
    ]

    # Assertions
    assert str(content["data"]["addImagesProduct"]["product"]["productId"]) == str(product.pk)
    assert len(variant_images) == len(images), "Not all images were added to the variant"
    
    # Verify each image is added to the variant and appears in GraphQL response
    for img in images:
        assert img in variant_images, f"Image {img.pk} not found in variant images"
        assert img.pk in graphql_image_ids, f"Image {img.pk} not found in GraphQL response"