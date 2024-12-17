from graphql import GraphQLError
from stores.models import StaffMember, Store


def get_store_or_error(default_domain, user):
    try:
        store = Store.objects.get(default_domain=default_domain)
    except Store.DoesNotExist:
        raise GraphQLError(
            "Store not found.",
            extensions={"code": "NOT_FOUND", "status": 404}
        )

    check_user_store_permission(user, store)
    return store


def check_user_store_permission(user, store):
    if not StaffMember.objects.filter(user=user, store=store).exists():
        raise GraphQLError(
            "You are not authorized to access this store.",
            extensions={"code": "PERMISSION_DENIED", "status": 403}
        )
