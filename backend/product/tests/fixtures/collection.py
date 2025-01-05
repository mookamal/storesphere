import pytest
from ...models import Collection


@pytest.fixture
def collection(db, store):
    return Collection.objects.create(
        store=store,
        title="Summer Collection",
        description="Summer 2025 Collection"
    )


@pytest.fixture
def winter_collection(db, store):
    return Collection.objects.create(
        store=store,
        title="Winter Collection",
        description="Winter 2025 Collection"
    )
