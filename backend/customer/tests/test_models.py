

def test_address_as_data(address):
    data = address.as_data()
    assert data == {
        "address1": "123 Main St",
        "address2": "Apt 4B",
        "city": "and",
        "country": "US",
        "company": "Test Company",
        "phone": "+1234567890",
        "province_code": "NY",
        "zip": "12345"
    }
