import graphene
from graphene_django.filter import DjangoFilterConnectionField
from .types import CustomerNode
from graphql import GraphQLError
from core.utils.utils import get_store_or_error, check_user_store_permission
from ..models import Customer


class Query(graphene.ObjectType):
    customer_list_admin = DjangoFilterConnectionField(
        CustomerNode, default_domain=graphene.String(required=True))

    def resolve_customer_list_admin(self, info, default_domain, **kwargs):
        user = info.context.user
        store = get_store_or_error(default_domain, user)
        return store.customers.all()

    # customer details
    customer_details = graphene.Field(
        CustomerNode, id=graphene.ID(required=True))

    def resolve_customer_details(self, info, id):
        user = info.context.user
        try:
            customer = Customer.objects.get(id=id)
            check_user_store_permission(user, customer.store)
            return customer
        except Customer.DoesNotExist:
            raise GraphQLError(
                "Customer not found or you do not have access to this customer.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
