import json
import pytest
from product.models import Product
from stores.models import StorePermission
from stores.enums import StorePermissions
from core.graphql.tests.utils import get_graphql_content
from core.utils.constants import StorePermissionErrors

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

@pytest.mark.django_db
def test_create_product_success(staff_member, staff_api_client, description_json, store):
    """Test successful product creation by store owner."""
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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]
    
    # Verify product details
    assert product_data["title"] == "Test Product"
    assert product_data["status"] == "ACTIVE"
    assert product_data["seo"]["title"] == "Test SEO Title"
    assert float(product_data["firstVariant"]["priceAmount"]) == 100.0
    assert float(product_data["firstVariant"]["compareAtPrice"]) == 120.0
    assert product_data["firstVariant"]["stock"] == 10

    # Verify database creation
    product = Product.objects.get(title=variables['product']['title'])
    assert product is not None
    assert product.store == store
    
    assert product.seo.title == variables['product']['seo']['title']
    assert product.seo.description == variables['product']['seo']['description']
    
    variant = product.first_variant
    assert variant.price_amount == variables['product']['firstVariant']['price']
    assert variant.compare_at_price == variables['product']['firstVariant']['compareAtPrice']
    assert variant.stock == variables['product']['firstVariant']['stock']

@pytest.mark.django_db
def test_create_product_with_permission(staff_api_client, description_json, store, staff_member_with_no_permissions):
    """Test product creation with explicit PRODUCTS_CREATE permission."""
    # Add PRODUCTS_CREATE permission to staff member without store ownership
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member_with_no_permissions.permissions.add(store_permission)
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]
    
    # Verify product details
    assert product_data["title"] == "Test Product"
    assert product_data["status"] == "ACTIVE"

@pytest.mark.django_db
def test_create_product_unauthorized(staff_api_client, description_json, store, staff_member_with_no_permissions):
    """Test product creation without PRODUCTS_CREATE permission."""
    # Ensure no permissions are added
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert StorePermissionErrors.PERMISSION_DENIED["message"] in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == StorePermissionErrors.PERMISSION_DENIED["code"]

@pytest.mark.django_db
def test_create_product_invalid_store(staff_api_client, description_json, staff_member):
    """Test product creation with non-existent store."""
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
        "defaultDomain": "nonexistent.store"
    }

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert content['errors'][0]['message'] == "Store not found."
    assert content['errors'][0]['extensions']['code'] == "NOT_FOUND"

@pytest.mark.django_db
def test_create_product_missing_title(staff_api_client, description_json, store, staff_member):
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert "Field 'title' of required type 'String!' was not provided" in content['errors'][0]['message']

@pytest.mark.django_db
def test_create_product_negative_price(staff_api_client, description_json, store, staff_member):
    """Test product creation with negative price."""
    # Add PRODUCTS_CREATE permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

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
                "price": -100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    assert 'errors' in content
    assert "Price cannot be negative" in content['errors'][0]['message']
    assert content['errors'][0]['extensions']['code'] == "VARIANT_ERROR"

@pytest.mark.django_db
def test_create_product_invalid_status(staff_api_client, description_json, store, staff_member):
    """Test product creation with invalid status."""
    # Add PRODUCTS_CREATE permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    
    # Verify status defaults to DRAFT
    product_data = content["data"]["createProduct"]["product"]
    assert product_data["status"] == "DRAFT"

@pytest.mark.django_db
def test_create_product_with_collection(staff_api_client, description_json, store, staff_member, collection):
    """Test product creation with collection."""
    # Add PRODUCTS_CREATE permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

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

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]

    product_id = product_data['productId']
    
    product = Product.objects.get(id=product_id)
    assert product.title == "Test Product"
    assert product.collections.count() == 1
    assert product.collections.first() == collection

@pytest.mark.django_db
def test_create_product_with_option(staff_api_client, description_json, store, staff_member):
    """Test product creation with product options."""
    # Add PRODUCTS_CREATE permission
    store_permission = StorePermission.objects.get(
        codename=StorePermissions.PRODUCTS_CREATE.codename
    )
    staff_member.permissions.add(store_permission)
    staff_member.store = store
    staff_member.save()

    variables = {
        "product": {
            "title": "Test Product with Options",
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Test SEO Title",
                "description": "Test SEO Description"
            },
            "options": [
                {
                    "name": "Color",
                    "values": [
                        {"name": "Red"},
                        {"name": "Blue"}
                    ]
                },
                {
                    "name": "Size",
                    "values": [
                        {"name": "Small"},
                        {"name": "Medium"}
                    ]
                }
            ],
            "firstVariant": {
                "price": 100.0,
                "compareAtPrice": 120.0,
                "stock": 10
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    response = staff_api_client.post_graphql(CREATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["createProduct"]["product"]
    
    # Verify product details
    assert product_data["title"] == "Test Product with Options"
    assert product_data["status"] == "ACTIVE"
    
    # Verify options
    assert len(product_data["options"]) == 2
    assert product_data["options"][0]["name"] == "Color"
    assert len(product_data["options"][0]["values"]) == 2
    assert product_data["options"][1]["name"] == "Size"
    assert len(product_data["options"][1]["values"]) == 2
    
    # Verify product was created in database
    product = Product.objects.get(title=variables['product']['title'])
    assert product is not None
    assert product.store == store
    
    # Verify first variant was created
    variant = product.first_variant
    assert variant.price_amount == variables['product']['firstVariant']['price']
    assert variant.compare_at_price == variables['product']['firstVariant']['compareAtPrice']
    assert variant.stock == variables['product']['firstVariant']['stock']
