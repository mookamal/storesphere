

def test_user_fixture(user):
    assert user.email == "test@example.com"
    assert user.check_password("password")
