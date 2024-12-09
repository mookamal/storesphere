from ..models import MailingAddress, Customer
import graphene
from graphene_django import DjangoObjectType
from django_countries.graphql.types import Country


class MailingAddressType(DjangoObjectType):
    company = graphene.Field(Country)

    class Meta:
        model = MailingAddress
        fields = ['address1', 'address2', 'city', 'country',
                  'company', 'phone', 'province_code', 'zip',]


class CustomerNode(DjangoObjectType):
    customer_id = graphene.Int()

    class Meta:
        model = Customer
        interfaces = (graphene.relay.Node,)
        exclude = ["store",]
        filter_fields = ["updated_at", "created_at",]

    def resolve_customer_id(self, info):
        return self.id
