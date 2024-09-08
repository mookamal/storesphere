import graphene
import stores.schema
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import PermissionDenied
import product.schema
class AuthenticationMiddleware:
    def resolve(self, next, root, info, **kwargs):
        request = info.context
        try:
            user, token = JWTAuthentication().authenticate(request)
            if not user or not user.is_authenticated:
                raise PermissionDenied("Authentication credentials were not provided or are invalid.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

        info.context.user = user
        return next(root, info, **kwargs)

class Query(
    stores.schema.Query,
    product.schema.Query,
    graphene.ObjectType,
    ):
    pass

class Mutation(
    stores.schema.StoreMutation,
    product.schema.Mutation,
    graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query,mutation=Mutation)