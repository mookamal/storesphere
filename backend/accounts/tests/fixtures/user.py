import pytest
from ...models import User
from allauth.account.models import EmailAddress


@pytest.fixture
def user(db):
    user = User.objects.create_user(
        email='test@example.com', password='password')
    EmailAddress.objects.create(
        user=user, email=user.email, verified=True, primary=True)
    return user
