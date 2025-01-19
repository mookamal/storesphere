import graphene
from product.models import Collection
from stores.enums import StorePermissions
from graphql import GraphQLError
from core.mutations import BaseMutation

class DeleteCollections(BaseMutation):
    """
    GraphQL mutation for deleting multiple collections.
    
    Handles the process of deleting collections with authentication 
    and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Indicates whether the deletion was successful.
    
    Arguments:
        collection_ids (list): IDs of the collections to delete.
        default_domain (str): Domain of the store.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_ids = graphene.List(graphene.ID, required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_ids, default_domain):
        """
        Mutation method to delete collections.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_ids (list): IDs of the collections to delete.
            default_domain (str): Domain of the store.
        
        Returns:
            DeleteCollections: A mutation result indicating the success of the deletion.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authenticate user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member and check permissions
        staff_member = cls.get_staff_member(user, store)
        cls.check_permission(staff_member, StorePermissions.COLLECTIONS_DELETE)

        # Validate collection existence and ownership
        collections = Collection.objects.filter(
            id__in=collection_ids, 
            store=store
        )

        # Check if all requested collections exist in the store
        if collections.count() != len(collection_ids):
            raise GraphQLError(
                "One or more collections not found or do not belong to this store.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Delete collections
        collections.delete()

        return DeleteCollections(success=True)