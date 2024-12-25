import pytest
from ...models import Customer


@pytest.fixture
def customer(address):
    default_address = address.get_copy()
