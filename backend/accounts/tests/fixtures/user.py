import pytest
from ...models import User


@pytest.fixture
def user(db):
    return User.objects.create_user(email='test@example.com', password='password')
