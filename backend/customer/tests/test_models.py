from django_countries.fields import Country


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


def test_copy_address(address):
    copied_address = address.get_copy()
    assert copied_address.pk != address.pk
    assert copied_address == address


def test_compare_addresses_with_country_object(address):
    copied_address = address.get_copy()
    copied_address.country = Country("US")
    copied_address.save()
    assert address == copied_address
