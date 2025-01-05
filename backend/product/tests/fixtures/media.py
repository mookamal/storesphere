import pytest
from ...models import Image, Video


@pytest.fixture
def product_image(db, store):
    return Image.objects.create(
        store=store,
        alt_text="Test Product Image"
    )


@pytest.fixture
def product_video(db, store):
    return Video.objects.create(
        store=store,
        youtube_url="https://youtube.com/watch?v=test"
    )
