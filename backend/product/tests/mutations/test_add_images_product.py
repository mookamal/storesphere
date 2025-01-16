import pytest
from core.graphql.tests.utils import get_graphql_content
from product.models import Product, Image, ProductVariant

ADD_IMAGES_PRODUCT_MUTATION = '''
mutation AddImagesProduct(
    $defaultDomain: String!
    $productId: ID!
    $imageIds: [ID]!
) {
    addImagesProduct(
        defaultDomain: $defaultDomain
        productId: $productId
        imageIds: $imageIds
    ) {
        product {
            id
            title
        }
    }
}
'''

@pytest.mark.django_db
def test_add_images_product_success(
    staff_member, 
    staff_api_client, 
    store, 
    product, 
    product_image
):
    """Test successful addition of images to a product by store owner."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Create a second image with the same store
    second_product_image = Image.objects.create(
        store=store,
        alt_text="Second Test Product Image"
    )

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk, second_product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(ADD_IMAGES_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    
    # Verify product details in response
    assert content['data']['addImagesProduct']['product']['id']
    assert content['data']['addImagesProduct']['product']['title'] == product.title

    # Verify database state
    updated_product = Product.objects.get(pk=product.pk)
    assert updated_product.first_variant is not None
    assert product_image in updated_product.first_variant.images.all()
    assert second_product_image in updated_product.first_variant.images.all()


@pytest.mark.django_db
def test_add_images_product_unauthorized(
    staff_member_with_no_permissions, 
    staff_api_client, 
    store, 
    product, 
    product_image
):
    """Test adding images without product update permission."""
    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(ADD_IMAGES_PRODUCT_MUTATION, variables)
    
    # Verify unauthorized access
    content = response.json()
    assert 'errors' in content
    assert len(content['errors']) > 0
    
    # Check specific error details
    error = content['errors'][0]
    assert 'You do not have permission' in error['message']
    assert error['extensions']['code'] == 'PERMISSION_DENIED'
    assert error['extensions']['status'] == 403


@pytest.mark.django_db
def test_add_images_product_nonexistent_product(
    staff_member, 
    staff_api_client, 
    store, 
    product_image
):
    """Test adding images to a non-existent product."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent product ID
    variables = {
        "defaultDomain": store.default_domain,
        "productId": 999999,  # Non-existent ID
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(ADD_IMAGES_PRODUCT_MUTATION, variables)
    content = response.json()

    # Verify error for non-existent product
    assert 'errors' in content
    assert any('Product not found' in str(error) for error in content['errors'])


@pytest.mark.django_db
def test_add_images_product_invalid_images(
    staff_member, 
    staff_api_client, 
    store, 
    product
):
    """Test adding invalid or non-existent images to a product."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with invalid image IDs
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product.pk,
        "imageIds": [999999, 888888]  # Non-existent image IDs
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(ADD_IMAGES_PRODUCT_MUTATION, variables)
    content = response.json()

    # Verify error for invalid images
    assert 'errors' in content
    assert any('No valid images found' in str(error) for error in content['errors'])


@pytest.mark.django_db
def test_add_images_product_no_first_variant(
    staff_member, 
    staff_api_client, 
    store, 
    product_image
):
    """Test adding images to a product without a first variant."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Create a product without a first variant
    product_without_variant = Product.objects.create(
        store=store
    )

    # Prepare variables for the mutation
    variables = {
        "defaultDomain": store.default_domain,
        "productId": product_without_variant.pk,
        "imageIds": [product_image.pk]
    }

    # Execute the mutation
    response = staff_api_client.post_graphql(ADD_IMAGES_PRODUCT_MUTATION, variables)
    content = response.json()

    # Verify error for product without first variant
    assert 'errors' in content
    assert any('Product does not have a first variant' in str(error) for error in content['errors'])
