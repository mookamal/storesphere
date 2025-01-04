
from core.graphql.tests.utils import get_graphql_content
UPDATE_STORE_PROFILE = """
      mutation UpdateStoreProfile($input: StoreInput!, $defaultDomain: String!) {
        updateStoreProfile(input: $input, defaultDomain: $defaultDomain) {
      store {
        name
        email
        currencyCode
        billingAddress {
          phone
        }
      }
    }
  }
"""


def test_update_store_profile(staff_api_client, store, staff_member, store_address):
    updated_name = "Updated Store"
    updated_email = "updated@example.com"
    updated_phone = "+1 123-456-7890"
    updated_currency_code = "USD"

    variables = {
        "input": {
            "name": updated_name,
            "email": updated_email,
            "billingAddress": {
                "phone": updated_phone,
            }
        },
        "defaultDomain": store.default_domain
    }
    response = staff_api_client.post_graphql(
        query=UPDATE_STORE_PROFILE, variables=variables)
    content = get_graphql_content(response)
    data = content['data']['updateStoreProfile']
    assert data["store"]['name'] == updated_name
    assert data["store"]['email'] == updated_email
    assert data["store"]['billingAddress']['phone'] == updated_phone
    assert data["store"]['currencyCode'] == updated_currency_code
