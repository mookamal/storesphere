import pytest
from django.test.client import Client
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.core.serializers.json import DjangoJSONEncoder

API_PATH = reverse("graphql")


class BaseApiClient(Client):
    """GraphQL API client."""

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user", None)
        self.user = user
        self.api_path = API_PATH
        super().__init__(*args, **kwargs)

    def authenticate(self):
        """Authenticate the user and return the JWT token."""
        if self.user is None:
            raise ValueError("No user specified for authentication.")
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.headers.update({"Authorization": f"Bearer {access_token}"})

    def post(self, data=None, **kwargs):
        """Send a POST request.

        This wrapper sets the `application/json` content type which is
        more suitable for standard GraphQL requests and doesn't mismatch with
        handling multipart requests in Graphene.
        """
        self.authenticate()
        if data:
            data = json.dumps(data, cls=DjangoJSONEncoder)
        kwargs["content_type"] = "application/json"
        return super().post(self.api_path, data, **kwargs)


class ApiClient(BaseApiClient):
    def post_graphql(self, query, variables=None, **kwargs,):
        """Dedicated helper for posting GraphQL queries.

        Sets the `application/json` content type and json.dumps the variables
        if present.
        """
        data = {"query": query}
        if variables is not None:
            data["variables"] = variables
        if data:
            data = json.dumps(data, cls=DjangoJSONEncoder)
        kwargs["content_type"] = "application/json"
        result = super(Client, self).post(self.api_path, data, **kwargs)
        return result
