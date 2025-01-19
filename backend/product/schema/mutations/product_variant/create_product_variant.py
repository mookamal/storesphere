import graphene
from product.models import Product, ProductVariant
from product.utils import add_values_to_variant
from stores.enums import StorePermissions
from ...types import ProductVariantNode
from ...inputs import ProductVariantInput
from graphql import GraphQLError
from core.mutations import BaseMutation

class CreateProductVariant(BaseMutation):
    """
    GraphQL mutation for creating a new product variant.
    
    Handles the process of adding a new variant to an existing product.
    Performs authentication and authorization checks.
    
    Attributes:
        product_variant (graphene.Field): The newly created product variant.
    
    Arguments:
        product_id (graphene.ID): ID of the product to add the variant to.
        variant_inputs (ProductVariantInput): Input data for creating the variant.
        default_domain (str): Domain of the store where the variant is being created.
    """
    product_variant = graphene.Field(ProductVariantNode)

    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, product_id, variant_inputs, default_domain):
        """
        Mutation method to create a new product variant.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            product_id (int): Unique identifier of the product.
            variant_inputs (ProductVariantInput): Detailed input for creating the variant.
            default_domain (str): Domain of the store.
        
        Returns:
            CreateProductVariant: A mutation result containing the created product variant.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        try:
            # 1. Authentication Check
            user = cls.check_authentication(info)

            # 2. Store Verification
            store = cls.get_store(default_domain)

            # 3. Staff Membership Check
            staff_member = cls.get_staff_member(user, store)

            # 4. Permission Verification
            cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

            # 5. Product Existence Validation
            try:
                product = Product.objects.get(pk=product_id, store=store)
            except Product.DoesNotExist:
                raise GraphQLError(
                    f"Product with ID {product_id} not found in the store.",
                    extensions={
                        "code": "PRODUCT_NOT_FOUND",
                        "status": 404
                    }
                )

            # 6. Input Validation
            if variant_inputs.price is not None:
                if variant_inputs.price < 0:
                    raise GraphQLError(
                        "Price cannot be negative.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

            if variant_inputs.stock is not None:
                if variant_inputs.stock < 0:
                    raise GraphQLError(
                        "Stock cannot be negative.",
                        extensions={
                            "code": "INVALID_STOCK",
                            "status": 400
                        }
                    )

            # 7. Variant Creation
            variant = ProductVariant(
                product=product,
                price_amount=variant_inputs.price,
                stock=variant_inputs.stock,
                compare_at_price=variant_inputs.compare_at_price
            )
            variant.save()

            # 8. Option Values Handling
            if variant_inputs.option_values:
                try:
                    add_values_to_variant(
                        variant, variant_inputs.option_values)
                except Exception as option_error:
                    # Rollback variant creation if option values fail
                    variant.delete()
                    raise GraphQLError(
                        f"Error adding option values: {str(option_error)}",
                        extensions={
                            "code": "OPTION_VALUE_ERROR",
                            "status": 400
                        }
                    )

            return CreateProductVariant(product_variant=variant)

        except GraphQLError as gql_error:
            # Re-raise GraphQL-specific errors
            raise gql_error
        except Exception as unexpected_error:
            # Catch and log any unexpected errors
            raise GraphQLError(
                f"An unexpected error occurred: {str(unexpected_error)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )