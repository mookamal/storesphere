
import graphene
from core.models import SEO
from product.models import Product, ProductVariant
from product.utils import update_product_options_and_values, update_product_collections
from stores.enums import StorePermissions
from ...types import ProductNode   
from ...inputs import ProductInput
from graphql import GraphQLError
from decimal import Decimal
from core.mutations import BaseMutation
class CreateProduct(BaseMutation):
    """
    GraphQL mutation for creating a new product.
    
    Handles the process of creating a product with its first variant, 
    options, and associated metadata. Performs authentication and 
    authorization checks.
    
    Attributes:
        product (graphene.Field): The newly created product.
    
    Arguments:
        product (ProductInput): Input data for creating the product.
        default_domain (str): Domain of the store where the product is being created.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, product, default_domain):
        """
        Mutation method to create a new product.
        """
        # Authenticate and get user
        user = cls.check_authentication(info)
        
        # Get store
        store = cls.get_store(default_domain)
        
        # Get staff member
        staff_member = cls.get_staff_member(user, store)
        
        # Check permission
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_CREATE)
        
        # Validate input
        if not product.title or len(product.title.strip()) == 0:
            raise GraphQLError(
                "Product title cannot be empty.",
                extensions={
                    "code": "INVALID_INPUT",
                    "status": 400
                }
            )

        # Create product object
        product_obj = Product(
            store=store,
            title=product.title,
            description=product.description or {},
            status=product.status if product.status in dict(Product.STATUS) else "DRAFT"
        )

        # Handle SEO data
        try:
            if product.seo and isinstance(product.seo, dict):
                seo = SEO.objects.create(**product.seo)
            else:
                seo = SEO.objects.create(title=product.title)
            product_obj.seo = seo
        except Exception as seo_error:
            raise GraphQLError(
                f"Error creating SEO data: {str(seo_error)}",
                extensions={
                    "code": "SEO_ERROR",
                    "status": 400
                }
            )

        # Save product
        product_obj.save()

        # Handle first variant
        try:
            first_variant_data = product.first_variant
            # Flexible price input
            price_amount = getattr(first_variant_data, 'price_amount', None) or getattr(
                first_variant_data, 'price', 0.0)
            compare_at_price = getattr(first_variant_data, 'compare_at_price', None) or getattr(
                first_variant_data, 'compareAtPrice', None)
            stock = getattr(first_variant_data, 'stock', 0)

            # Validate price
            if price_amount < 0:
                raise GraphQLError(
                    "Price cannot be negative.",
                    extensions={
                        "code": "INVALID_PRICE",
                        "status": 400
                    }
                )

            first_variant = ProductVariant(
                product=product_obj,
                price_amount=Decimal(str(price_amount)),
                compare_at_price=Decimal(
                    str(compare_at_price)) if compare_at_price is not None else None,
                stock=stock,
            )

            first_variant.save()
            product_obj.first_variant = first_variant
            product_obj.save()
        except Exception as variant_error:
            # Rollback product creation if variant fails
            product_obj.delete()
            raise GraphQLError(
                f"Error creating product variant: {str(variant_error)}",
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
                update_product_collections(product_obj, collection_ids)
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
                    product_obj, product.options)
            except Exception as options_error:
                raise GraphQLError(
                    f"Error updating product options: {str(options_error)}",
                    extensions={
                        "code": "OPTIONS_ERROR",
                        "status": 400
                    }
                )

        return CreateProduct(product=product_obj)