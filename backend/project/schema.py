import graphene
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
from product.schema.queries import Query as productQueries
from product.schema.mutations import Mutation as productMutations
from customer.schema.queries import Query as customerQueries
from customer.schema.mutations import Mutation as customerMutations
from stores.schema.queries import Query as storesQueries
from stores.schema.mutations import Mutation as storesMutations


class AuthenticationMiddleware:
    def resolve(self, next, root, info, **kwargs):
        request = info.context
        try:
            user, token = JWTAuthentication().authenticate(request)
            if not user or not user.is_authenticated:
                raise PermissionDenied(
                    "Authentication credentials were not provided or are invalid.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

        info.context.user = user
        return next(root, info, **kwargs)


class Query(
    storesQueries,
    productQueries,
    customerQueries,
    graphene.ObjectType,
):
    pass


class Mutation(
        storesMutations,
        productMutations,
        customerMutations,
        graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
