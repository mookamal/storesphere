from ..models import Domain, StaffMember
import pytest


def test_store_primary_and_default_domain(store):
    assert store.primary_domain.host == store.default_domain


def test_domain_uniqueness(store):
    with pytest.raises(Exception) as e:
        Domain.objects.create(host=store.primary_domain.host)
    assert "UNIQUE constraint failed" in str(e.value)


def test_staff_member_creation(staff_member):
    assert staff_member.is_store_owner is True
    assert staff_member.store.name == "Test Store"


def test_store_address_creation(store_address):
    assert store_address.city == "Test City"
    assert store_address.store.name == "Test Store"


def test_staff_member(staff_member, user, store):
    get_staff_member = StaffMember.objects.filter(
        user=user, store=store).first()
    assert get_staff_member.pk == staff_member.pk
