import graphene
from core.schema.inputs import CountryInput
from core.schema.scalars import PhoneNumberScalar, EmailScalar


class AddressInputs(graphene.InputObjectType):
    id = graphene.ID()
    address1 = graphene.String()
    address2 = graphene.String()
    city = graphene.String()
    company = graphene.String()
    country = graphene.Field(CountryInput)
    phone = PhoneNumberScalar()
    province_code = graphene.String()
    zip = graphene.String()


class CustomerInputs(graphene.InputObjectType):
    id = graphene.ID()
    customer_id = graphene.ID()
    first_name = graphene.String()
    last_name = graphene.String()
    email = EmailScalar()
    default_address = AddressInputs()
