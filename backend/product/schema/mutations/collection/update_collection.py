import graphene
from core.models import SEO
from product.models import Collection, Image
from stores.enums import StorePermissions
from ...types import CollectionNode
from ...inputs import CollectionInputs
from graphql import GraphQLError
from core.mutations import BaseMutation

class UpdateCollection(BaseMutation):
    """
    GraphQL mutation for updating an existing collection.
    
    Handles updating collection details and associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        collection (graphene.Field): The updated collection.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to update.
        collection_inputs (CollectionInputs): Input data for updating the collection.
        default_domain (str): Domain of the store where the collection exists.
    """
    collection = graphene.Field(CollectionNode)

    class Arguments:
        collection_id = graphene.ID(required=True)
        collection_inputs = CollectionInputs(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, collection_inputs, default_domain):
        """
        Mutation method to update an existing collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            collection_inputs (CollectionInputs): Detailed input for updating the collection.
            default_domain (str): Domain of the store.
        
        Returns:
            UpdateCollection: A mutation result containing the updated collection.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authenticate user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Validate collection existence within the store
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

        # Get staff member and check permissions
        staff_member = cls.get_staff_member(user, store)
        cls.check_permission(staff_member, StorePermissions.COLLECTIONS_UPDATE)

        # Validate unique handle within the store
        handle = collection_inputs.handle
        if handle:
            existing_collection = Collection.objects.filter(
                handle=handle,
                store=store
            ).exclude(pk=collection.pk).exists()
            if existing_collection:
                raise GraphQLError(
                    "A collection with this handle already exists in the store.",
                    extensions={
                        "code": "DUPLICATE_HANDLE",
                        "status": 400
                    }
                )

        # Validate title length
        if collection_inputs.title and len(collection_inputs.title) > 255:
            raise GraphQLError(
                "Collection title cannot exceed 255 characters.",
                extensions={
                    "code": "TITLE_TOO_LONG",
                    "status": 400
                }
            )

        if collection_inputs.description and len(collection_inputs.description) > 1000:
            raise GraphQLError(
                "Collection description cannot exceed 1000 characters.",
                extensions={
                    "code": "DESCRIPTION_TOO_LONG",
                    "status": 400
                }
            )

        # Validate and update image if provided
        if collection_inputs.image_id is not None:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id, store=store)
                collection.image = image
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image with the given ID not found.",
                    extensions={
                        "code": "IMAGE_NOT_FOUND",
                        "status": 404
                    }
                )
        elif collection_inputs.image_id is None:
            # Explicitly remove image
            collection.image = None

        # Update title and description
        if collection_inputs.title is not None:
            collection.title = collection_inputs.title
        if collection_inputs.description is not None:
            collection.description = collection_inputs.description
        if collection_inputs.handle is not None:
            collection.handle = collection_inputs.handle

        # Handle SEO data
        seo_data = collection_inputs.seo if isinstance(collection_inputs.seo, dict) else {}

        # Validate and truncate SEO data
        seo_title = (seo_data.get("title", collection.title) or collection.title)[:255]
        seo_description = (seo_data.get("description", "") or "")[:500]

        # Update or create SEO
        if collection.seo:
            collection.seo.title = seo_title
            collection.seo.description = seo_description
            collection.seo.save()
        else:
            seo = SEO.objects.create(
                title=seo_title, 
                description=seo_description
            )
            collection.seo = seo

        # Save changes to the collection
        collection.save()
        return UpdateCollection(collection=collection)