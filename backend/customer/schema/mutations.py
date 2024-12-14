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
    def mutate_and_get_payload(cls, root, info, **input):
        default_domain = input.get('default_domain')
        customer_inputs = input.get('customer_inputs')
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
            if not StaffMember.objects.filter(user=user, store=store).exists():
                raise GraphQLError("You are not authorized to access this store.",
                                   extensions={
                                       "code": "PERMISSION_DENIED",
                                       "status": 403
                                   })
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        if customer_inputs.default_address:
            address = customer_inputs.default_address
            customer_inputs.pop("default_address")
            default_address = MailingAddress.objects.create(**address)
        else:
            default_address = None
        customer = Customer(store=store,
                            default_address=default_address, **customer_inputs,)
        customer.save()

        return CreateCustomer(customer=customer)


class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
