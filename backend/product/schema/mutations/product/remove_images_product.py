import graphene
from product.models import Image, Product
from stores.enums import StorePermissions
from ...types import ProductNode
from graphql import GraphQLError
from core.mutations import BaseMutation

class RemoveImagesProduct(BaseMutation):
    """
    GraphQL mutation for removing images from a product.
    
    Handles removing images from a product's first variant.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The product with the removed images.
    
    Arguments:
        default_domain (str): Domain of the store where the product exists.
        product_id (graphene.ID): ID of the product to remove images from.
        image_ids (graphene.List): IDs of the images to remove.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID, required=True)

    @classmethod
    def mutate(cls, root, info, default_domain, product_id, image_ids):
        """
        Mutation method to remove images from a product.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            product_id (int): Unique identifier of the product.
            image_ids (list): IDs of the images to remove.
        
        Returns:
            RemoveImagesProduct: A mutation result containing the product with the removed images.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authenticate user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member and check permissions
        staff_member = cls.get_staff_member(user, store)
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

        # Validate product existence and ownership
        try:
            product = Product.objects.get(pk=product_id, store=store)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Ensure product has a first variant
        if not product.first_variant:
            raise GraphQLError(
                "Product does not have a first variant.",
                extensions={
                    "code": "NO_FIRST_VARIANT",
                    "status": 400
                }
            )

        # Validate images
        images = Image.objects.filter(pk__in=image_ids, store=store)
        if not images.exists():
            raise GraphQLError(
                "No valid images found for removal.",
                extensions={
                    "code": "INVALID_IMAGES",
                    "status": 400
                }
            )

        # Remove images from the first variant
        product.first_variant.images.remove(*images)

        return RemoveImagesProduct(product=product)