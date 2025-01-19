import graphene
from core.models import SEO
from product.models import Collection, Image
from stores.enums import StorePermissions
from ...types import CollectionNode
from ...inputs import CollectionInputs
from graphql import GraphQLError
from django.utils.text import slugify
from core.mutations import BaseMutation

class CreateCollection(BaseMutation):
    """
    GraphQL mutation for creating a new collection.
    
    Handles the process of creating a collection with its associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        collection (graphene.Field): The newly created collection.
    
    Arguments:
        default_domain (str): Domain of the store where the collection is being created.
        collection_inputs (CollectionInputs): Input data for creating the collection.
    """
    collection = graphene.Field(CollectionNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        collection_inputs = CollectionInputs(required=True)

    @classmethod
    def mutate(cls, root, info, default_domain, collection_inputs):
        """
        Mutation method to create a new collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            collection_inputs (CollectionInputs): Detailed input for creating the collection.
        
        Returns:
            CreateCollection: A mutation result containing the created collection.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authenticate user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member and check permissions
        staff_member = cls.get_staff_member(user, store)
        cls.check_permission(staff_member, StorePermissions.COLLECTIONS_CREATE)

        # Validate title length
        title = collection_inputs.title.strip()
        if len(title) > 255:
            raise GraphQLError(
                "Collection title is too long. Maximum 255 characters allowed.",
                extensions={
                    "code": "TITLE_TOO_LONG",
                    "status": 400
                }
            )

        # Check for duplicate handle
        handle = collection_inputs.handle
        if handle and Collection.objects.filter(store=store, handle=handle).exists():
            raise GraphQLError(
                "A collection with this handle already exists in the store.",
                extensions={
                    "code": "DUPLICATE_HANDLE",
                    "status": 400
                }
            )

        # Validate and handle image
        image = None
        if collection_inputs.image_id:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id)
                if image.store != store:
                    raise GraphQLError(
                        "Image not found or does not belong to this store",
                        extensions={
                            "code": "INVALID_IMAGE",
                            "status": 400
                        }
                    )
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image not found or does not belong to this store",
                    extensions={
                        "code": "INVALID_IMAGE",
                        "status": 400
                    }
                )

        # Validate SEO data
        seo_data = cls.validate_seo_data(collection_inputs.seo, title)

        # Create SEO object
        seo_obj = SEO.objects.create(
            title=seo_data['title'], 
            description=seo_data['description']
        )

        # Prepare collection data
        collection_data = {
            'store': store,
            'title': title,
            'description': collection_inputs.description or '',
            'handle': handle or slugify(title),
            'image': image,
            'seo': seo_obj
        }

        # Create collection
        collection = Collection.objects.create(**{k: v for k, v in collection_data.items() if v is not None})

        return CreateCollection(collection=collection)

    @classmethod
    def validate_seo_data(cls, seo_data, title):
        """
        Validate and truncate SEO data.
        
        Args:
            seo_data (dict): SEO data to validate.
            title (str): Title of the collection.
        
        Returns:
            dict: Validated and truncated SEO data.
        """
        # Default SEO data if not provided
        if not seo_data:
            seo_data = {}

        # Use collection title if SEO title is not provided
        seo_title = (seo_data.get('title') or title)[:255]
        
        # Truncate description if provided
        seo_description = (seo_data.get('description') or '')[:500]

        return {
            'title': seo_title,
            'description': seo_description
        }