import graphene
from core.schema.inputs import CountryInput


class StoreAddressInput(graphene.InputObjectType):
    address1 = graphene.String()
    address2 = graphene.String()
    city = graphene.String()
    country = graphene.Field(CountryInput)
    company = graphene.String()
    phone = graphene.String()
    province_code = graphene.String()
    zip = graphene.String()


class StoreInput(graphene.InputObjectType):
    name = graphene.String()
    email = graphene.String()
    currency_code = graphene.String()
    billing_address = graphene.Field(StoreAddressInput)
