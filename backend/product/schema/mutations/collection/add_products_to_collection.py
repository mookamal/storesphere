import graphene
from product.models import Collection,Product
from stores.enums import StorePermissions
from graphql import GraphQLError
from core.mutations import BaseMutation

class AddProductsToCollection(BaseMutation):
    """
    GraphQL mutation for adding products to a collection.
    
    Handles the process of adding multiple products to a collection 
    with authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Indicates whether the products were added successfully.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to add products to.
        product_ids (list): IDs of the products to add.
        default_domain (str): Domain of the store.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID, required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids, default_domain):
        """
        Mutation method to add products to a collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            product_ids (list): IDs of the products to add.
            default_domain (str): Domain of the store.
        
        Returns:
            AddProductsToCollection: A mutation result indicating the success of the addition.
        
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

            # Add products to collection
            collection.products.add(*products)

        return AddProductsToCollection(success=True)