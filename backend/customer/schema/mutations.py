import graphene
from .inputs import CustomerInputs
from .types import CustomerNode
from ..models import Customer, MailingAddress
from stores.models import StaffMember, Store
from graphql import GraphQLError
from core.utils import get_store_or_error, check_user_store_permission


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
        store = get_store_or_error(default_domain, user)
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
