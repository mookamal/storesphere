
def test_store_list_view(rest_api_client, user, store, staff_member):
    response = rest_api_client.get(
        '/s/stores/',
        SERVER_NAME="api.nour.com",
        content_type="application/json"
    )
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["name"] == "Test Store"


def test_store_detail_view(rest_api_client, user, store, staff_member):
    response = rest_api_client.get(
        f'/s/stores/detail/{store.default_domain}/',
        SERVER_NAME="api.nour.com",
        content_type="application/json"
    )
    assert response.status_code == 200
    assert response.data["name"] == "Test Store"
