import pytest
from ...models import SEO


@pytest.fixture
def seo():
    return SEO.objects.create(title="seo title", description="seo description")
