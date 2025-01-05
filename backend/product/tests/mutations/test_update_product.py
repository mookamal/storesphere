import json
import pytest
from graphql import GraphQLError

UPDATE_PRODUCT_MUTATION = '''
    mutation UpdateProduct($id: ID!, $product: ProductInput!, $defaultDomain: String!) {
        updateProduct(input: {
            id: $id,
            product: $product,
            defaultDomain: $defaultDomain
        }) {
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
            }
        }
    }
'''

def test_update_product_success(staff_api_client, description_json, store, staff_member, product):
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
            "collectionIds": []
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