import graphene
from .inputs import StoreInput, StoreAddressInput
from .types import StoreType, StoreAddressType
from ..models import Store, StaffMember
from graphql import GraphQLError


class UpdateStoreProfile(graphene.Mutation):
    class Arguments:
        input = StoreInput(required=True)
        default_domain = graphene.String(required=True)

    store = graphene.Field(StoreType)

    @classmethod
    def mutate(cls, root, info, input, default_domain):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)

            if not StaffMember.objects.filter(user=user, store=store).exists():
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )

            updated = False
            if input.name and store.name != input.name:
                store.name = input.name
                updated = True
            if input.email and store.email != input.email:
                store.email = input.email
                updated = True
            if input.currency_code and store.currency_code != input.currency_code:
                store.currency_code = input.currency_code
                updated = True

            if input.billing_address and store.billing_address:
                if store.billing_address.phone != input.billing_address.phone:
                    store.billing_address.phone = input.billing_address.phone
                    try:
                        store.billing_address.save()
                        updated = True
                    except Exception as e:
                        raise GraphQLError(
                            f"Error saving billing address: {str(e)}",
                            extensions={
                                "code": "INTERNAL_SERVER_ERROR",
                                "status": 500
                            }
                        )

            if updated:
                store.save()

            return UpdateStoreProfile(store=store)

        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                                   "code": "AUTHENTICATION_ERROR",
                                   "status": 401
            })


class UpdateStoreAddress(graphene.Mutation):
    class Arguments:
        input = StoreAddressInput(required=True)
        default_domain = graphene.String(required=True)

    billing_address = graphene.Field(StoreAddressType)

    @classmethod
    def mutate(cls, root, info, input, default_domain):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                store.billing_address.address1 = input.address1
                store.billing_address.address2 = input.address2
                store.billing_address.city = input.city
                store.billing_address.country = input.country
                store.billing_address.company = input.company
                store.billing_address.zip = input.zip
                store.billing_address.save()
                store.save()
                return UpdateStoreAddress(billing_address=store.billing_address)
        except Exception as e:
            raise GraphQLError(f"Error updating store address: {str(e)}",
                               extensions={
                                   "code": "INTERNAL_SERVER_ERROR",
                                   "status": 500
            })


class Mutation(graphene.ObjectType):
    update_store_profile = UpdateStoreProfile.Field()
    update_store_address = UpdateStoreAddress.Field()
