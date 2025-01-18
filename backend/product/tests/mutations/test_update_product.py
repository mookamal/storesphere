import json
from core.graphql.tests.utils import get_graphql_content
from core.utils.constants import StorePermissionErrors

UPDATE_PRODUCT_MUTATION = '''
    mutation UpdateProduct($id: ID!, $product: ProductInput!, $defaultDomain: String!) {
        updateProduct(id: $id, product: $product, defaultDomain: $defaultDomain) {
            product {
                id
                title
                description
                status
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
                    pricing {
                        amount
                    }
                    compareAtPrice
                    stock
                }
                collections {
                    collectionId
                    id
                    title
                }
            }
        }
    }
'''

def test_update_product_success(staff_api_client, description_json, store, staff_member, product, collection):
    """Test successful product update by store owner."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,  # Existing title
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Updated SEO Title",
                "description": "Updated SEO Description"
            },
            "firstVariant": {
                "price": 150.0,
                "compareAtPrice": 170.0,
                "stock": 15
            },
            "collectionIds": [str(collection.id)]
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["updateProduct"]["product"]
    
    # Then
    assert product_data["title"] == product.title
    assert product_data["status"] == "ACTIVE"
    assert product_data["seo"]["title"] == "Updated SEO Title"
    assert float(product_data["firstVariant"]["pricing"]["amount"]) == 150.0
    assert float(product_data["firstVariant"]["compareAtPrice"]) == 170.0
    assert product_data["firstVariant"]["stock"] == 15
    assert len(product_data["collections"]) == 1
    assert product_data["collections"][0]["collectionId"] == collection.id

def test_update_product_with_empty_values(staff_api_client, description_json, store, staff_member, product):
    """Test updating product with empty values."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": product.description,
            "status": product.status,
            "seo": {
                "title": product.seo.title,
                "description": product.seo.description
            },
            "firstVariant": {
                "price": float(product.first_variant.price_amount),
                "compareAtPrice": float(product.first_variant.compare_at_price) if product.first_variant.compare_at_price else None,
                "stock": product.first_variant.stock
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["updateProduct"]["product"]
    
    # Then
    assert product_data["title"] == product.title
    assert len(product_data["collections"]) == 0

def test_update_product_with_invalid_price(staff_api_client, description_json, store, staff_member, product):
    """Test updating product with invalid (negative) price."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "firstVariant": {
                "price": -100.0,
                "compareAtPrice": 50.0,
                "stock": 15
            }
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    assert "errors" in content
    assert any("price" in error["message"].lower() for error in content["errors"])

def test_update_product_status_only(staff_api_client, store, staff_member, product):
    """Test updating only the product status."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": product.description,
            "status": "DRAFT",
            "seo": {
                "title": product.seo.title,
                "description": product.seo.description
            },
            "firstVariant": {
                "price": float(product.first_variant.price_amount),
                "compareAtPrice": float(product.first_variant.compare_at_price) if product.first_variant.compare_at_price else None,
                "stock": product.first_variant.stock
            }
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["updateProduct"]["product"]
    
    # Then
    assert product_data["status"] == "DRAFT"

def test_update_product_multiple_collections(staff_api_client, store, staff_member, product, collection, winter_collection):
    """Test updating product with multiple collections."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": product.description,
            "status": product.status,
            "seo": {
                "title": product.seo.title,
                "description": product.seo.description
            },
            "firstVariant": {
                "price": float(product.first_variant.price_amount),
                "compareAtPrice": float(product.first_variant.compare_at_price) if product.first_variant.compare_at_price else None,
                "stock": product.first_variant.stock
            },
            "collectionIds": [str(collection.id), str(winter_collection.id)]
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    product_data = content["data"]["updateProduct"]["product"]
    
    # Then
    assert len(product_data["collections"]) == 2
    collection_ids = {collection["collectionId"] for collection in product_data["collections"]}
    assert collection.id in collection_ids
    assert winter_collection.id in collection_ids

def test_update_product_with_option(staff_api_client, store, staff_member, product, color_option, red_option_value):
    """Test updating product with options."""
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": product.description,
            "status": product.status,
            "options": [
                {
                    "id": str(color_option.id),
                    "name": color_option.name,
                    "values": [{
                        "id": str(red_option_value.id),
                        "name": red_option_value.name
                    }]
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
                "price": float(product.first_variant.price_amount),
                "compareAtPrice": float(product.first_variant.compare_at_price) if product.first_variant.compare_at_price else None,
                "stock": product.first_variant.stock,
            }
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    
    # Then
    product_data = content["data"]["updateProduct"]["product"]
    assert len(product_data["options"]) == 2
    assert product_data["options"][0]["name"] == color_option.name
    assert product_data["options"][1]["name"] == "Size"
    assert len(product_data["options"][1]["values"]) == 2

def test_update_product_without_update_permission(staff_api_client, store, staff_member_with_no_permissions, product, description_json):
    """
    Test updating a product without PRODUCTS_UPDATE permission.

    Verifies that:
    1. A staff member without update permission cannot modify a product
    2. A GraphQL error is raised with correct error code and message
    """
    # Ensure staff member is associated with the store but has no update permissions
    staff_member_with_no_permissions.store = store
    staff_member_with_no_permissions.save()

    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Updated SEO Title",
                "description": "Updated SEO Description"
            },
            "firstVariant": {
                "price": 150.0,
                "compareAtPrice": 170.0,
                "stock": 15
            }
        },
        "defaultDomain": store.default_domain
    }

    # Perform the update mutation
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response, ignore_errors=True)

    # Assert that an error was returned
    assert 'errors' in content, "Expected an error response"

    # Check the specific error details
    error = content['errors'][0]
    assert error['message'] == StorePermissionErrors.PERMISSION_DENIED["message"], \
        f"Unexpected error message: {error['message']}"
    assert error['extensions']['code'] == StorePermissionErrors.PERMISSION_DENIED["code"]