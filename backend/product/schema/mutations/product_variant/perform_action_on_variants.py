import graphene
from product.models import ProductVariant
from stores.enums import StorePermissions
from graphql import GraphQLError
from core.mutations import BaseMutation

class VariantActions(graphene.Enum):
    """
    Enum for actions that can be performed on product variants.
    """
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE"



class PerformActionOnVariants(BaseMutation):
    """
    GraphQL mutation for performing actions on product variants.
    
    Handles actions such as deleting variants.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the action was successful.
        message (graphene.String): A message describing the result of the action.
        errors (graphene.List): A list of error messages if the action failed.
    
    Arguments:
        action (VariantActions): The action to perform.
        variant_ids (graphene.List): IDs of the variants to perform the action on.
        default_domain (graphene.String): The domain of the store.
    """
    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    class Arguments:
        action = VariantActions(required=True)
        variant_ids = graphene.List(graphene.ID, required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, action, variant_ids, default_domain):
        """
        Mutation method to perform an action on product variants.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            action (VariantActions): The action to perform.
            variant_ids (list): IDs of the variants to perform the action on.
            default_domain (str): Domain of the store.
        
        Returns:
            PerformActionOnVariants: A mutation result containing the outcome of the action.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Get user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member
        staff_member = cls.get_staff_member(user, store)

        # Check permission
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

        # Check variant existence in a single query
        variants = ProductVariant.objects.filter(id__in=variant_ids)

        # Verify all requested variants exist
        if variants.count() != len(variant_ids):
            raise GraphQLError(
                "Product variant not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        if action == VariantActions.DELETE:
            variants.delete()
            return PerformActionOnVariants(success=True, message="Product variants deleted successfully.")

        # Handle other actions if needed
        # ...

        return PerformActionOnVariants(success=False, message="Action not performed.")