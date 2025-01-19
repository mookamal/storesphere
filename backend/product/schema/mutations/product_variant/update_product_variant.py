import graphene
from product.models import ProductVariant
from product.utils import add_values_to_variant
from stores.enums import StorePermissions
from ...types import ProductVariantNode
from ...inputs import ProductVariantInput
from graphql import GraphQLError
from core.mutations import BaseMutation

class UpdateProductVariant(BaseMutation):
    """
    GraphQL mutation for updating an existing product variant.
    
    Handles updating variant details and associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        product_variant (graphene.Field): The updated product variant.
    
    Arguments:
        variant_inputs (ProductVariantInput): Input data for updating the variant.
        default_domain (str): Domain of the store.
    """
    product_variant = graphene.Field(ProductVariantNode)

    class Arguments:
        variant_inputs = ProductVariantInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, variant_inputs, default_domain):
        """
        Mutation method to update an existing product variant.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            variant_inputs (ProductVariantInput): Detailed input for updating the variant.
            default_domain (str): Domain of the store.
        
        Returns:
            UpdateProductVariant: A mutation result containing the updated product variant.
        
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

        # Get product variant
        try:
            # Find product variant by ID
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)
        except ProductVariant.DoesNotExist:
            raise GraphQLError(
                "Product variant not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate and update price
        if variant_inputs.price is not None:
            if variant_inputs.price < 0:
                raise GraphQLError(
                    "Price cannot be negative.",
                    extensions={
                        "code": "INVALID_PRICE",
                        "status": 400
                    }
                )
            variant.price_amount = variant_inputs.price

        # Validate and update stock
        if variant_inputs.stock is not None:
            if variant_inputs.stock < 0:
                raise GraphQLError(
                    "Stock cannot be negative.",
                    extensions={
                        "code": "INVALID_STOCK",
                        "status": 400
                    }
                )
            variant.stock = variant_inputs.stock

        # Update compare at price if provided
        if variant_inputs.compare_at_price is not None:
            variant.compare_at_price = variant_inputs.compare_at_price

        # Save changes to product variant
        variant.save()

        # Add values to the variant
        add_values_to_variant(variant, variant_inputs.option_values)

        return UpdateProductVariant(product_variant=variant)