
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
    assert response.data["store"]["name"] == store.name
    assert response.data["store"]["email"] == store.email
    assert response.data["store"]["currencyCode"] == store.currency_code
    assert response.data["store"]["billingAddress"]["phone"] == store.billing_address.phone
    assert response.data["store"]["billingAddress"]["address1"] == store.billing_address.address1
    assert response.data["store"]["billingAddress"]["address2"] == store.billing_address.address2
    assert response.data["store"]["billingAddress"]["city"] == store.billing_address.city
    assert response.data["store"]["billingAddress"]["company"] == store.billing_address.company
