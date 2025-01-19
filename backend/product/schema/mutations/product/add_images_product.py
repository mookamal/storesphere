import graphene
from product.models import Image, Product
from stores.enums import StorePermissions
from ...types import ProductNode
from graphql import GraphQLError
from core.mutations import BaseMutation

class AddImagesProduct(BaseMutation):
    """
    GraphQL mutation for adding images to a product.
    
    Handles adding images to a product's first variant.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The product with the added images.
    
    Arguments:
        default_domain (str): Domain of the store where the product exists.
        product_id (graphene.ID): ID of the product to add images to.
        image_ids (graphene.List): IDs of the images to add.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID)

    @classmethod
    def mutate(cls, root, info, default_domain, product_id, image_ids):
        """
        Mutation method to add images to a product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            product_id (int): Unique identifier of the product.
            image_ids (list): IDs of the images to add.
        
        Returns:
            AddImagesProduct: A mutation result containing the product with the added images.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
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
            product = Product.objects.get(pk=product_id, store=store)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate images
        images = Image.objects.filter(pk__in=image_ids, store=store)
        if not images.exists():
            raise GraphQLError(
                "No valid images found for addition.",
                extensions={
                    "code": "INVALID_IMAGES",
                    "status": 400
                }
            )

        # Add images to the first variant
        if product.first_variant:
            product.first_variant.images.add(*images)
        else:
            raise GraphQLError(
                "Product does not have a first variant.",
                extensions={
                    "code": "NO_FIRST_VARIANT",
                    "status": 400
                }
            )

        return AddImagesProduct(product=product)