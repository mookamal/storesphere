import pytest
from core.graphql.tests.utils import get_graphql_content
from stores.models import StorePermission
from stores.enums import StorePermissions

PRODUCT_DETAILS_VARIANTS_QUERY = '''
query ProductDetailsVariants($productId: ID!) {
    productDetailsVariants(productId: $productId) {
        edges {
            node {
                id
                sku
                pricing {
                    amount
                    currency
                }
                stock
                createdAt
            }
        }
    }
}
'''

@pytest.mark.django_db
def test_product_details_variants_success(
    staff_api_client, 
    staff_member, 
    store, 
    product,
    product_variant
):
    """Test successful retrieval of product variants."""
    # Delete all existing variants for the product
    product.variants.all().delete()
        
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Create the first variant for the product
    first_variant = product.variants.create(
        sku='123',
        price_amount=10.0,
        stock=5,
        created_at='2023-01-01T00:00:00Z'
    )
        
    # Set the first variant for the product
    product.first_variant = first_variant
    product.save()

    # Create additional variants
    additional_variant1 = product.variants.create(
        sku='VARIANT2',
        price_amount=29.99,
        stock=15,
        created_at='2023-02-01T00:00:00Z'
    )
    additional_variant2 = product.variants.create(
        sku='VARIANT3',
        price_amount=39.99,
        stock=20,
        created_at='2023-03-01T00:00:00Z'
    )

    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_DETAILS_VARIANTS_QUERY, 
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    variants = content['data']['productDetailsVariants']['edges']
    
    # Check the number of variants (excluding first variant)
    assert len(variants) == 2
    
    # Check variant details (sorted by created_at in descending order)
    assert variants[0]['node']['sku'] == 'VARIANT3'
    assert variants[1]['node']['sku'] == 'VARIANT2'
    assert float(variants[0]['node']['pricing']['amount']) == 39.99
    assert float(variants[1]['node']['pricing']['amount']) == 29.99
    assert variants[0]['node']['stock'] == 20
    assert variants[1]['node']['stock'] == 15


@pytest.mark.django_db
def test_product_details_variants_unauthorized(
    staff_api_client,
    staff_member_with_no_permissions,
    product
):
    """Test retrieving product variants without PRODUCTS_VIEW permission."""
    # Use staff member with no permissions
    staff_member_with_no_permissions.store = product.store
    staff_member_with_no_permissions.save()

    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_DETAILS_VARIANTS_QUERY,
        variables
    )
    content = response.json()

    # Verify unauthorized access
    assert 'errors' in content
        
    # Check error message and code
    error_messages = [error.get('message', '') for error in content['errors']]
    error_codes = [error.get('extensions', {}).get('code', '') for error in content['errors']]
        
    assert "Authentication failed: You do not have permission to view products." in error_messages
    assert "PERMISSION_DENIED" in error_codes


@pytest.mark.django_db
def test_product_details_variants_nonexistent(
    staff_api_client, 
    staff_member, 
    store
):
    """Test retrieving variants for a non-existent product."""
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Prepare variables with a non-existent product ID
    variables = {
        "productId": "999999"  # Non-existent ID
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_DETAILS_VARIANTS_QUERY, 
        variables
    )
    content = response.json()

    # Verify product not found error
    assert 'errors' in content
    assert any('Product not found' in str(error) for error in content['errors'])
    assert any(error.get('extensions', {}).get('code') == 'NOT_FOUND' for error in content['errors'])


@pytest.mark.django_db
def test_product_details_variants_order(
    staff_api_client,
    staff_member,
    store,
    product
):
    """Test that product variants are returned in descending order of creation."""
    # Add PRODUCTS_VIEW permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_VIEW.codename
    )
    staff_member.permissions.add(store_permission)

    # Delete all existing variants for the product
    product.variants.all().delete()
        
    # Ensure staff member is associated with the store
    staff_member.store = store
    staff_member.save()

    # Create the first variant (which will be excluded)
    first_variant = product.variants.create(
        sku='FIRST_VARIANT',
        price_amount=19.99,
        stock=10,
        created_at='2023-01-01T00:00:00Z'
    )
    product.first_variant = first_variant
    product.save()

    # Create multiple variants with different creation times
    variant1 = product.variants.create(
        sku='VARIANT1',
        price_amount=29.99,
        stock=15,
        created_at='2023-02-01T00:00:00Z'
    )
    variant2 = product.variants.create(
        sku='VARIANT2',
        price_amount=39.99,
        stock=20,
        created_at='2023-03-01T00:00:00Z'
    )

    # Prepare variables for the query
    variables = {
        "productId": str(product.id)
    }

    # Execute the query
    response = staff_api_client.post_graphql(
        PRODUCT_DETAILS_VARIANTS_QUERY,
        variables
    )
    content = get_graphql_content(response)

    # Verify query response
    variants = content['data']['productDetailsVariants']['edges']
        
    # Check that variants are in descending order and first_variant is excluded
    assert len(variants) == 2
    variant_dates = [variant['node']['createdAt'] for variant in variants]
    assert variant_dates == sorted(variant_dates, reverse=True)

    # Verify specific variant details
    assert variants[0]['node']['sku'] == 'VARIANT2'
    assert variants[1]['node']['sku'] == 'VARIANT1'
