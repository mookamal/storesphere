import graphene
from core.models import SEO
from product.models import Product
from product.utils import update_product_options_and_values, update_product_collections
from stores.enums import StorePermissions
from ...types import ProductNode   
from ...inputs import ProductInput
from graphql import GraphQLError
from decimal import Decimal
from core.mutations import BaseMutation

class UpdateProduct(BaseMutation):
    """
    GraphQL mutation for updating an existing product.
    
    Handles updating product details, variants, options, and metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The updated product.
    
    Arguments:
        id (graphene.ID): ID of the product to update.
        product (ProductInput): Input data for updating the product.
        default_domain (str): Domain of the store where the product exists.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, id, product, default_domain):
        """
        Mutation method to update an existing product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            id (int): Unique identifier of the product to update.
            product (ProductInput): Detailed input for updating the product.
            default_domain (str): Domain of the store.
        
        Returns:
            UpdateProduct: A mutation result containing the updated product.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        try:
            # Check user authentication
            user = cls.check_authentication(info)

            # Verify store existence
            store = cls.get_store(default_domain)

            # Check staff membership
            staff_member = cls.get_staff_member(user, store)

            # Verify specific permission
            cls.check_permission(
                staff_member, StorePermissions.PRODUCTS_UPDATE)

            # Validate product existence
            try:
                product_instance = Product.objects.get(pk=id, store=store)
            except Product.DoesNotExist:
                raise GraphQLError(
                    "Product not found or you do not have access to this product.",
                    extensions={
                        "code": "NOT_FOUND",
                        "status": 404
                    }
                )

            # Validate title length
            if not product.title or len(product.title.strip()) == 0:
                raise GraphQLError(
                    "Product title cannot be empty.",
                    extensions={
                        "code": "INVALID_INPUT",
                        "status": 400
                    }
                )

            if len(product.title) > 255:
                raise GraphQLError(
                    "Title length cannot exceed 255 characters.",
                    extensions={
                        "code": "INVALID_INPUT",
                        "status": 400
                    }
                )

            # Update product details
            product_instance.title = product.title
            product_instance.description = product.description or {}
            product_instance.status = product.status if product.status in dict(
                Product.STATUS) else "DRAFT"
            product_instance.handle = product.handle

            # Handle SEO data
            try:
                if product.seo and isinstance(product.seo, dict):
                    if product_instance.seo:
                        seo = product_instance.seo
                        seo.title = product.seo.get('title', seo.title)
                        seo.description = product.seo.get(
                            'description', seo.description)
                    else:
                        seo = SEO.objects.create(**product.seo)
                        product_instance.seo = seo
                    seo.save()
                elif not product_instance.seo:
                    seo = SEO.objects.create(title=product.title)
                    product_instance.seo = seo
            except Exception as seo_error:
                raise GraphQLError(
                    f"Error updating SEO data: {str(seo_error)}",
                    extensions={
                        "code": "SEO_ERROR",
                        "status": 400
                    }
                )

            # Handle first variant
            try:
                first_variant = product_instance.first_variant
                first_variant_data = product.first_variant

                # Flexible price input
                price_amount = getattr(first_variant_data, 'price_amount', None) or getattr(
                    first_variant_data, 'price', first_variant.price_amount)
                compare_at_price = getattr(first_variant_data, 'compare_at_price', None) or getattr(
                    first_variant_data, 'compareAtPrice', first_variant.compare_at_price)
                stock = getattr(first_variant_data, 'stock',
                                first_variant.stock)

                # Validate price
                if price_amount < 0:
                    raise GraphQLError(
                        "Price cannot be negative.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

                # Validate compare at price
                if compare_at_price is not None and compare_at_price < price_amount:
                    raise GraphQLError(
                        "Compare at price cannot be less than price.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

                first_variant.price_amount = Decimal(str(price_amount))
                first_variant.compare_at_price = Decimal(
                    str(compare_at_price)) if compare_at_price is not None else None
                first_variant.stock = stock
                first_variant.save()
            except Exception as variant_error:
                raise GraphQLError(
                    f"Error updating product variant: {str(variant_error)}",
                    extensions={
                        "code": "VARIANT_ERROR",
                        "status": 400
                    }
                )

            # Handle collections
            try:
                collection_ids = getattr(product, 'collection_ids', None) or getattr(
                    product, 'collectionIds', None)
                if collection_ids is not None:
                    update_product_collections(
                        product_instance, collection_ids)
            except Exception as collection_error:
                raise GraphQLError(
                    f"Error updating collections: {str(collection_error)}",
                    extensions={
                        "code": "COLLECTION_ERROR",
                        "status": 400
                    }
                )

            # Handle product options
            if product.options:
                try:
                    update_product_options_and_values(
                        product_instance, product.options)
                except Exception as options_error:
                    raise GraphQLError(
                        f"Error updating product options: {
                            str(options_error)}",
                        extensions={
                            "code": "OPTIONS_ERROR",
                            "status": 400
                        }
                    )

            product_instance.save()
            return UpdateProduct(product=product_instance)

        except GraphQLError as gql_error:
            # Re-raise GraphQL errors as-is
            raise gql_error
        except Exception as e:
            # Handle unexpected errors
            raise GraphQLError(
                f"Unexpected error: {str(e)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )
