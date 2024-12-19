from django.db import transaction
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


class UpdateCustomer(graphene.relay.ClientIDMutation):
    customer = graphene.Field(CustomerNode)

    class Input:
        id = graphene.ID(required=True)
        customer_inputs = CustomerInputs(required=True)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **input):
        id = input.get('id')
        customer_inputs = input.get('customer_inputs')
        user = info.context.user

        try:
            customer = Customer.objects.get(pk=id)
        except Customer.DoesNotExist:
            raise GraphQLError(
                "Customer not found.",
                extensions={"code": "NOT_FOUND", "status": 404}
            )

        store = customer.store
        check_user_store_permission(user, store)

        default_address = customer_inputs.pop("default_address", None)

        with transaction.atomic():
            # Update default address
            if default_address:
                address = customer.default_address
                for key, value in default_address.items():
                    setattr(address, key, value)
                address.save()

            # Update customer fields
            for key, value in customer_inputs.items():
                setattr(customer, key, value)

            customer.save()

        return UpdateCustomer(customer=customer)


class DeleteCustomer(graphene.relay.ClientIDMutation):
    customer = graphene.Field(CustomerNode)

    class Input:
        id = graphene.ID(required=True)
    success = graphene.Boolean()

    @classmethod
    def mutate_and_get_payload(cls, root, info, id):
        user = info.context.user
        try:
            customer = Customer.objects.get(pk=id)
        except Customer.DoesNotExist:
            raise GraphQLError(
                "Customer not found.",
                extensions={"code": "NOT_FOUND", "status": 404}
            )
        store = customer.store

        check_user_store_permission(user, store)
        customer.delete()
        return DeleteCustomer(success=True)


class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
    update_customer = UpdateCustomer.Field()
    delete_customer = DeleteCustomer.Field()
