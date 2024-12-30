
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
        "domain": store.primary_domain.host
    }
    response = staff_api_client.post_graphql(query, variables)
    data = response['data']
    assert data['store']['name'] == store.name
