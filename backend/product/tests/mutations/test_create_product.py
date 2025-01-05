import json
from core.models import SEO
from product.models import Product, ProductVariant
import pytest

CREATE_PRODUCT_MUTATION = '''
    mutation CreateProduct($product: ProductInput!, $defaultDomain: String!) {
        createProduct(product: $product, defaultDomain: $defaultDomain) {
            product {
                id
                title
                description
                status
                seo {
                    title
                    description
                }
                firstVariant {
                    priceAmount
                    compareAtPrice
                    stock
                }
            }
        }
    }
'''

def test_create_product_success(staff_api_client, description_json, store, staff_member):
    # Given
    variables = {
        "product": {
            "title": "Test Product",
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())

    # Then
    assert 'errors' not in content
    product_data = content['data']['createProduct']['product']
    assert product_data['title'] == variables['product']['title']
    assert product_data['description'] == variables['product']['description']
    assert product_data['status'] == variables['product']['status']
    
    # Verify product was created in database
    product = Product.objects.get(title=variables['product']['title'])
    assert product is not None
    assert product.store == store
    
    # Verify SEO was created
    assert product.seo.title == variables['product']['seo']['title']
    assert product.seo.description == variables['product']['seo']['description']
    
    # Verify first variant was created
    variant = product.first_variant
    assert variant.price_amount == variables['product']['firstVariant']['price']
    assert variant.compare_at_price == variables['product']['firstVariant']['compareAtPrice']
    assert variant.stock == variables['product']['firstVariant']['stock']

def test_create_product_unauthorized(staff_api_client, description_json, store):
    # Given
    variables = {
        "product": {
            "title": "Test Product",
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())

    # Then
    assert 'errors' in content
    assert content['errors'][0]['message'] == "You do not have permission to create products."

def test_create_product_invalid_store(staff_api_client, description_json, store, staff_member):
    # Given
    variables = {
        "product": {
            "title": "Test Product",
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": "invalid-store-domain"
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())

    # Then
    assert 'errors' in content
    assert "Store matching query does not exist" in content['errors'][0]['message']

def test_create_product_missing_required_fields(staff_api_client, description_json, store, staff_member):
    # Given
    variables = {
        "product": {
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())

    # Then
    assert 'errors' in content
    assert "title" in content['errors'][0]['message'].lower()

def test_create_product_invalid_status(staff_api_client, description_json, store, staff_member):
    # Given
    variables = {
        "product": {
            "title": "Test Product",
            "description": json.dumps(description_json),
            "status": "INVALID_STATUS",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())

    # Then
    assert 'data' in content
    product_data = content['data']['createProduct']['product']
    assert product_data['status'] == "DRAFT"  # يجب أن يتم تعيين الحالة إلى DRAFT عندما تكون الحالة غير صالحة
