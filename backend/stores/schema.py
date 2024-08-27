import graphene
from graphene_django import DjangoObjectType
from .models import Store,StoreAddress
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied

class AuthenticationMiddleware:
    def resolve(self, next, root, info, **kwargs):
        request = info.context
        try:
            user, token = JWTAuthentication().authenticate(request)
            if not user or not user.is_authenticated:
                raise PermissionDenied("Authentication credentials were not provided or are invalid.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

        info.context.user = user
        return next(root, info, **kwargs)

class StoreAddressType(DjangoObjectType):
    class Meta:
        model = StoreAddress


class StoreType(DjangoObjectType):
    class Meta:
        model = Store

class Query(graphene.ObjectType):
    shop = graphene.Field(StoreType,default_domain=graphene.String(required=True))

    def resolve_shop(self, info, domain):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=domain)
            if user.store_owner != store.owner:
                raise PermissionDenied("You are not authorized to access this store.")
            return store
        except Store.DoesNotExist:
            return None
        