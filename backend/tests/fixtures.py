import pytest
from customer.models import Address


@pytest.fixture
def address():
    return Address.objects.create(
        address1="123 Main St",
        address2="Apt 4B",
        city="and",
        country="US",
        company="Test Company",
        phone="+1234567890",
        province_code="NY",
        zip="12345"
    )
