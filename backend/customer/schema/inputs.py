import graphene
from core.schema.inputs import CountryInput
from core.schema.scalars import PhoneNumberScalar


class AddressInputs(graphene.InputObjectType):
    id = graphene.ID()
    address1 = graphene.String()
    address2 = graphene.String()
    city = graphene.String()
    country = graphene.Field(CountryInput)
    phone = PhoneNumberScalar()
    province_code = graphene.String()
    zip = graphene.String()
