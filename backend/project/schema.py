import graphene
import stores.schema
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
from product.schema.queries import Query as productQueries
from product.schema.mutations import Mutation as productMutations
from customer.schema.queries import Query as customerQueries
from customer.schema.mutations import Mutation as customerMutations


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
    stores.schema.Query,
    productQueries,
    customerQueries,
    graphene.ObjectType,
):
    pass


class Mutation(
        stores.schema.StoreMutation,
        productMutations,
        customerMutations,
        graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
