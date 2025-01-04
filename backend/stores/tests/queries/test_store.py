
def test_store(staff_api_client, store):
    query = """
    query SettingsGeneral($domain: String!) {
        store(defaultDomain: $domain) {
        name
        email
        currencyCode
        billingAddress {
            phone
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
    variables = {
        "domain": store.default_domain
    }

    response = staff_api_client.post_graphql(query, variables)
    print("Response:", response.content)
    print("Response JSON:", response.json())
    data = response['data']
    assert data['store']['name'] == store.name
