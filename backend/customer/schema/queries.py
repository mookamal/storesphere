import graphene
from graphene_django.filter import DjangoFilterConnectionField
from .types import CustomerNode
from graphql import GraphQLError
from stores.models import Store, StaffMember
from core.utils import get_store_or_error


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
        pass
