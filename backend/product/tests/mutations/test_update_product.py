import json
from core.graphql.tests.utils import get_graphql_content

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
                    id
                    title
                }
            }
        }
    }
'''

def test_update_product_success(staff_api_client, description_json, store, staff_member, product, collection):
    # Given
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
    assert product_data["collections"][0]["id"] == "Q29sbGVjdGlvbk5vZGU6MQ=="

def test_update_product_with_empty_values(staff_api_client, description_json, store, staff_member, product):
    # Given
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,  # Existing title
            "description": product.description,  # Existing description
            "status": product.status,  # Existing status
            "seo": {
                "title": product.seo.title,  # Existing SEO title
                "description": product.seo.description  # Existing SEO description
            },
            "firstVariant": {
                "price": float(product.first_variant.price_amount),  # Existing price
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
    # Given
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,  # Existing title
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
    # Given
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

def test_update_product_with_long_values(staff_api_client, store, staff_member, product):
    # Given
    long_title = "A" * 300  # Assuming there's a max length validation
    long_description = json.dumps({"blocks": [{"text": "B" * 5000}]})  # JSON-formatted description
    
    variables = {
        "id": str(product.id),
        "product": {
            "title": long_title,
            "description": long_description,
            "status": product.status,
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
    content = get_graphql_content(response, ignore_errors=True)

    # Then
    # The test should pass if:
    # 1. The mutation succeeds and returns the long values
    # 2. The mutation fails with a length or constraint error
    # 3. The mutation truncates the long values
    if "errors" in content:
        # If there are validation errors for long values
        assert any("length" in error["message"].lower() or "constraint" in error["message"].lower() for error in content["errors"]), \
            f"Unexpected error: {content['errors']}"
    else:
        # If long values are allowed or truncated
        product_data = content["data"]["updateProduct"]["product"]
        # Verify the title and description are not longer than expected
        assert len(product_data["title"]) <= len(long_title), \
            f"Title length {len(product_data['title'])} exceeds max length {len(long_title)}"
        
        # For description, check the JSON-parsed length
        parsed_description = json.loads(product_data["description"])
        assert len(parsed_description.get("blocks", [{}])[0].get("text", "")) <= 5000, \
            f"Description length {len(parsed_description.get('blocks', [{}])[0].get('text', ''))} exceeds max length 5000"

def test_update_product_multiple_collections(staff_api_client, store, staff_member, product, collection, winter_collection):
    # Given
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
    collection_ids = {collection["id"] for collection in product_data["collections"]}
    assert "Q29sbGVjdGlvbk5vZGU6MQ==" in collection_ids  # Summer Collection
    assert "Q29sbGVjdGlvbk5vZGU6Mg==" in collection_ids  # Winter Collection

def test_update_product_with_option_values(staff_api_client, store, staff_member, product, color_option, red_option_value):
    # Given
    # Ensure the product has an option
    product.options.add(color_option)
    
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "description": product.description,
            "status": product.status,
            "firstVariant": {
                "price": float(product.first_variant.price_amount),
                "compareAtPrice": float(product.first_variant.compare_at_price) if product.first_variant.compare_at_price else None,
                "stock": product.first_variant.stock,
                "optionValues": [str(red_option_value.id)]
            }
        },
        "defaultDomain": store.default_domain
    }

    # When
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = get_graphql_content(response)
    
    # Then
    # Refresh the first variant from the database
    product.first_variant.refresh_from_db()
    
    # Check that the option value was added to the first variant
    assert product.first_variant.selected_options.count() == 1
    assert product.first_variant.selected_options.first() == red_option_value