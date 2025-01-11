import pytest
from ...models import Store, StaffMember, StoreAddress


@pytest.fixture
def store(db):
    return Store.objects.create(
        name="Test Store",
    )


@pytest.fixture
def staff_member(user, store):
    return StaffMember.objects.create(user=user, store=store, is_store_owner=True)


@pytest.fixture
def store_address(store):
    return StoreAddress.objects.create(store=store, city="Test City")


@pytest.fixture
def staff_member_with_no_permissions(user, store):
    return StaffMember.objects.create(
        user=user, 
        store=store, 
        is_store_owner=False
    )


@pytest.fixture
def another_store(db):
    return Store.objects.create(name="Another Test Store")
