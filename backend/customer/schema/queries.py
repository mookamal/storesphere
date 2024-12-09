import graphene
from graphene_django.filter import DjangoFilterConnectionField
from .types import CustomerNode
from ..models import Customer


class Query(graphene.ObjectType):
    customer_list_admin = DjangoFilterConnectionField(
        CustomerNode, default_domain=graphene.String(required=True))
