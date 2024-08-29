import graphene
from graphene_django import DjangoObjectType
from .models import Store,StoreAddress , StaffMember
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
        fields = ('address1', 'address2', 'city', 'country_code_v2', 'company', 'phone', 'province_code', 'zip', )


class StoreType(DjangoObjectType):
    billing_address = graphene.Field(StoreAddressType)
    class Meta:
        model = Store
    
    def resolve_billing_address(self, info):
        return self.billing_address if self.billing_address else None

class Query(graphene.ObjectType):
    shop = graphene.Field(StoreType,default_domain=graphene.String(required=True))

    def resolve_shop(self, info, default_domain):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user,store=store).exists():
                return store
            else:
                raise PermissionDenied("You are not authorized to access this store.")
        except Store.DoesNotExist:
            return None
        