from product.models import Collection,Product
from stores.enums import StorePermissions
from graphql import GraphQLError
from core.mutations import BaseMutation
import graphene
class DeleteProductsFromCollection(BaseMutation):
    """
    GraphQL mutation for removing products from a collection.
    
    Handles removing multiple products from a collection at once.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the removal was successful.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to remove products from.
        product_ids (graphene.List): IDs of the products to remove.
        default_domain (str): Domain of the store where the collection exists.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids, default_domain):
        """
        Mutation method to remove products from a collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            product_ids (list): IDs of the products to remove.
            default_domain (str): Domain of the store.
        
        Returns:
            DeleteProductsFromCollection: A mutation result indicating the success of the removal.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authenticate user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member and check permissions
        staff_member = cls.get_staff_member(user, store)
        cls.check_permission(staff_member, StorePermissions.COLLECTIONS_UPDATE)

        # Validate collection existence
        try:
            collection = Collection.objects.get(id=collection_id, store=store)
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate products
        if product_ids:
            products = Product.objects.filter(id__in=product_ids, store=store)
            
            # Check if all requested products exist in the store
            if products.count() != len(product_ids):
                raise GraphQLError(
                    "One or more products not found or do not belong to this store.",
                    extensions={
                        "code": "INVALID_PRODUCTS",
                        "status": 400
                    }
                )

            # Remove products from collection
            collection.products.remove(*products)

        return DeleteProductsFromCollection(success=True)