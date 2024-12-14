import graphene
from .inputs import CustomerInputs
from .types import CustomerNode
from ..models import Customer, MailingAddress
from stores.models import StaffMember, Store
from graphql import GraphQLError


class CreateCustomer(graphene.relay.ClientIDMutation):
    customer = graphene.Field(CustomerNode)

    class Input:
        customer_inputs = CustomerInputs(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, customer_inputs, default_domain):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
            if not StaffMember.objects.filter(user=user, store=store).exists():
                raise GraphQLError("You are not authorized to access this store.",              extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                })
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        address = customer_inputs.address
        del customer_inputs.address
        default_address = MailingAddress.objects.create(**address)
        customer_inputs.default_address = default_address
        customer = Customer(**customer_inputs.dict())
        customer.save()


class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
