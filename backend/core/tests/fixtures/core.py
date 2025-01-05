import pytest
from ...models import SEO


@pytest.fixture
def seo(db):
    return SEO.objects.create(title="seo title", description="seo description")
