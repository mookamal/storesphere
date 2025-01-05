import json

UPDATE_PRODUCT_MUTATION = '''
    mutation UpdateProduct($id: ID!, $product: ProductInput!, $defaultDomain: String!) {
        updateProduct(id: $id, product: $product, defaultDomain: $defaultDomain) {
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
            "title": "Updated Test Product",
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
    content = json.loads(response.content.decode())

    # Then
    assert "errors" not in content
    product_data = content["data"]["updateProduct"]["product"]
    assert product_data["title"] == "Updated Test Product"
    assert json.loads(product_data["description"]) == description_json
    assert product_data["status"] == "ACTIVE"
    assert product_data["seo"]["title"] == "Updated SEO Title"
    assert product_data["seo"]["description"] == "Updated SEO Description"
    assert product_data["firstVariant"]["pricing"]['amount'] == 150.0
    assert float(product_data["firstVariant"]["compareAtPrice"]) == 170.0
    assert product_data["firstVariant"]["stock"] == 15
    assert len(product_data["collections"]) == 1
    assert product_data["collections"][0]["title"] == collection.title


def test_update_product_with_empty_values(staff_api_client, description_json, store, staff_member, product):
    variables = {
        "id": str(product.id),
        "product": {
            "title": "Updated Test Product",
            "description": None,
            "status": "ACTIVE",
            "seo": {
                "title": "",
                "description": None
            },
            "firstVariant": {
                "price": 0.0,
                "compareAtPrice": None,
                "stock": 0
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())
    assert "errors" not in content
    product_data = content["data"]["updateProduct"]["product"]
    assert product_data["title"] == "Updated Test Product"
    assert product_data["description"] is None
    assert product_data["firstVariant"]["pricing"]["amount"] == 0.0
    assert product_data["firstVariant"]["compareAtPrice"] is None
    assert product_data["firstVariant"]["stock"] == 0


def test_update_product_with_invalid_price(staff_api_client, description_json, store, staff_member, product):
    variables = {
        "id": str(product.id),
        "product": {
            "title": "Updated Test Product",
            "description": json.dumps(description_json),
            "status": "ACTIVE",
            "seo": {
                "title": "Updated SEO Title",
                "description": "Updated SEO Description"
            },
            "firstVariant": {
                "price": -150.0,  # سعر سالب
                "compareAtPrice": 50.0,  # سعر مقارنة أقل من السعر الأساسي
                "stock": 15
            },
            "collectionIds": []
        },
        "defaultDomain": store.default_domain
    }
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())
    assert "errors" in content
    assert "price" in content["errors"][0]["message"].lower()


def test_update_product_status_only(staff_api_client, store, staff_member, product):
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
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())
    assert "errors" not in content
    assert content["data"]["updateProduct"]["product"]["status"] == "DRAFT"


def test_update_product_with_long_values(staff_api_client, store, staff_member, product):
    long_title = "a" * 256  # أطول من الحد المسموح
    variables = {
        "id": str(product.id),
        "product": {
            "title": long_title,
            "status": "ACTIVE",
            "seo": {
                "title": long_title,
                "description": "a" * 1000
            },
            "firstVariant": {
                "price": 150.0,
                "compareAtPrice": 170.0,
                "stock": 15
            }
        },
        "defaultDomain": store.default_domain
    }
    response = staff_api_client.post_graphql(UPDATE_PRODUCT_MUTATION, variables)
    content = json.loads(response.content.decode())
    assert "errors" in content
    assert "title" in content["errors"][0]["message"].lower()


def test_update_product_multiple_collections(staff_api_client, store, staff_member, product, collection, winter_collection):
    # Given
    variables = {
        "id": str(product.id),
        "product": {
            "title": product.title,
            "status": product.status,
            "collectionIds": [str(collection.id), str(winter_collection.id)],
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
    content = json.loads(response.content.decode())

    # Then
    assert "errors" not in content
    product_data = content["data"]["updateProduct"]["product"]
    collection_titles = {item["title"] for item in product_data["collections"]}
    assert len(collection_titles) == 2
    assert collection.title in collection_titles
    assert winter_collection.title in collection_titles