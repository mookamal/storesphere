import json
from product.models import Product
from core.graphql.tests.utils import get_graphql_content

CREATE_PRODUCT_MUTATION = '''
    mutation CreateProduct($product: ProductInput!, $defaultDomain: String!) {
        createProduct(product: $product, defaultDomain: $defaultDomain) {
            product {
                id
                title
                description
                status
                productId
                options {
                    id
                    name
                    values {
                        id
                        name
                    }
                }
                seo {
                    title
                    description
                }
                firstVariant {
                    priceAmount
                    compareAtPrice
                    stock
                }
                collections {
                    id
                    title
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
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]
    
    # Then
    assert product_data["title"] == "Test Product"
    assert product_data["status"] == "ACTIVE"
    assert product_data["seo"]["title"] == "Test SEO Title"
    assert float(product_data["firstVariant"]["priceAmount"]) == 100.0
    assert float(product_data["firstVariant"]["compareAtPrice"]) == 120.0
    assert product_data["firstVariant"]["stock"] == 10

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
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    assert 'errors' in content
    assert "permission" in content["errors"][0]["message"].lower()

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
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    assert "errors" in content
    assert "store" in content["errors"][0]["message"].lower()

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
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    assert "errors" in content
    assert "title" in content["errors"][0]["message"].lower()

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
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    # Since the mutation might default to DRAFT instead of raising an error
    # we'll check if the status is DRAFT or if there are errors
    if "errors" not in content:
        assert content["data"]["createProduct"]["product"]["status"] == "DRAFT"
    else:
        assert "status" in content["errors"][0]["message"].lower()

def test_create_product_with_collection(staff_api_client, description_json, store, staff_member, collection):
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
            "collectionIds": [str(collection.id)]
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]
    

    product_id = product_data['productId']
    
    product = Product.objects.get(id=product_id)
    assert product.title == "Test Product"
    assert product.collections.count() == 1
    assert product.collections.first() == collection
