import pytest
from ...models import Store, StaffMember, StoreAddress


@pytest.fixture
def store():
    return Store.objects.create(
        name="Test Store",
        description="Test Store Description",
    )


@pytest.fixture
def staff_member(user, store):
    return StaffMember.objects.create(user=user, store=store, is_store_owner=True)


@pytest.fixture
def store_address(store):
    return StoreAddress.objects.create(store=store, city="Test City")
