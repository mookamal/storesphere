from django_countries.graphql.types import Country
from graphene_django import DjangoObjectType
import graphene
from ..models import StoreAddress, StaffMember, Store


class StoreAddressType(DjangoObjectType):
    country = graphene.Field(Country)

    class Meta:
        model = StoreAddress
        fields = ('address1', 'address2', 'city', 'country',
                  'company', 'phone', 'province_code', 'zip', )


class StoreType(DjangoObjectType):
    billing_address = graphene.Field(StoreAddressType)

    class Meta:
        model = Store

    def resolve_billing_address(self, info):
        return self.billing_address.first() if self.billing_address else None
