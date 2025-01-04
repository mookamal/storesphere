import graphene
from .types import StoreType
from ..models import Store, StaffMember
from graphql import GraphQLError


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
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               }
                               )
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                                   "code": "AUTHENTICATION_ERROR",
                                   "status": 401
            }
            )
