import graphene
from graphene_django import DjangoObjectType
from .models import Store, StoreAddress, StaffMember
from django.core.exceptions import PermissionDenied
from django_countries.graphql.types import Country
from core.schema.inputs import CountryInput


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
        return self.billing_address if self.billing_address else None


class Query(graphene.ObjectType):
    store = graphene.Field(
        StoreType, default_domain=graphene.String(required=True))

    def resolve_store(self, info, default_domain):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                return store
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Store.DoesNotExist:
            return None


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
                raise PermissionDenied(
                    "You are not authorized to access this store.")

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
                        raise PermissionDenied(
                            f"Error saving billing address: {str(e)}")

            if updated:
                store.save()

            return UpdateStoreProfile(store=store)

        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Error updating store profile: {str(e)}")


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
            raise PermissionDenied(f"Error updating store address: {str(e)}")


class StoreMutation(graphene.ObjectType):
    update_store_profile = UpdateStoreProfile.Field()
    update_store_address = UpdateStoreAddress.Field()
