import graphene
from graphene_django.filter import DjangoFilterConnectionField
from .types import CustomerNode
from graphql import GraphQLError
from stores.models import Store, StaffMember


class Query(graphene.ObjectType):
    customer_list_admin = DjangoFilterConnectionField(
        CustomerNode, default_domain=graphene.String(required=True))

    def resolve_customer_list_admin(self, info, default_domain, **kwargs):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise GraphQLError(
                "Store not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise GraphQLError(
                "You are not authorized to access this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )

        try:
            return store.customers.all()
        except Exception as e:
            raise GraphQLError(
                f"Unexpected error occurred: {str(e)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )
