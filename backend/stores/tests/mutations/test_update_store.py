
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


UPDATE_STORE_ADDRESS = """
      mutation UpdateStoreAddress($input: StoreAddressInput!, $defaultDomain: String!) {
        updateStoreAddress(input: $input, defaultDomain: $defaultDomain) {
      billingAddress {
        address1
        address2
        city
        company
        zip
        country {
          name
          code
        }
      }
    }
  }
"""


def test_update_store_address(staff_api_client, store, staff_member, store_address):
    updated_address1 = "Updated Address 1"
    updated_address2 = "Updated Address 2"
    updated_city = "Updated City"
    updated_company = "Updated Company"
    updated_zip = "12345"
    updated_country_code = "US"
    updated_country_name = "United States of America"
    variables = {
        "defaultDomain": store.default_domain,
        "input": {
            "address1": updated_address1,
            "address2": updated_address2,
            "city": updated_city,
            "company": updated_company,
            "zip": updated_zip,
            "country": {
                "code": updated_country_code,
                "name": updated_country_name
            }
        }
    }
    response = staff_api_client.post_graphql(
        query=UPDATE_STORE_ADDRESS, variables=variables)
    content = get_graphql_content(response)
    data = content['data']['updateStoreAddress']
    assert data["billingAddress"]['address1'] == updated_address1
    assert data["billingAddress"]['address2'] == updated_address2
    assert data["billingAddress"]['city'] == updated_city
    assert data["billingAddress"]['company'] == updated_company
    assert data["billingAddress"]['zip'] == updated_zip
    assert data["billingAddress"]["country"]["code"] == updated_country_code
    assert data["billingAddress"]["country"]["name"] == updated_country_name
