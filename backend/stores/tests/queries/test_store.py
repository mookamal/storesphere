def test_store(staff_api_client, store, staff_member, store_address):
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

    assert response.status_code == 200, f"Unexpected status code: {
        response.status_code}"

    json_response = response.json()

    assert "errors" not in json_response, f"GraphQL errors: {
        json_response.get('errors')}"

    data = json_response.get("data")
    assert data is not None, "GraphQL response does not contain 'data'"

    assert data['store']['name'] == store.name
