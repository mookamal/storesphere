import django_filters
import graphene
from graphql import GraphQLError
from product.models import Collection, Image, Product
from graphene_django.filter import DjangoFilterConnectionField
from stores.models import Store, StaffMember
from stores.enums import StorePermissions
from .types import ProductNode, ImageNode, CollectionNode, ProductVariantNode


class ProductFilter(django_filters.FilterSet):
    """
    Django filter for filtering Product queryset.
    
    Provides filtering capabilities for products based on specific attributes.
    
    Attributes:
        status (django_filters.ChoiceFilter): Filter products by their status.
    
    Meta:
        model (Product): The Django model to apply filters on.
        fields (list): List of fields that can be used for filtering.
    """
    status = django_filters.ChoiceFilter(choices=Product.STATUS)

    class Meta:
        model = Product
        fields = ['status', 'title']


class CollectionFilter(django_filters.FilterSet):
    """
    Django filter for filtering Collection queryset.
    
    Provides filtering capabilities for collections based on specific attributes.
    
    Meta:
        model (Collection): The Django model to apply filters on.
        fields (list): List of fields that can be used for filtering.
    """
    class Meta:
        model = Collection
        fields = ['title']


class Query(graphene.ObjectType):
    """
    GraphQL Query type for Product, Image, and Collection-related queries.
    
    Defines all available GraphQL queries for retrieving product, image, 
    and collection information with advanced filtering and authentication.
    
    Queries include:
    - all_products: Retrieve all products for a store
    - product: Retrieve a specific product by ID
    - all_media_images: Retrieve all media images for a store
    - get_images_product: Retrieve images for a specific product
    - product_details_variants: Retrieve variants for a specific product
    - all_collections: Retrieve all collections for a store
    - collection_by_id: Retrieve a specific collection by ID
    - product_resource_collection: Retrieve products in a specific collection
    - products_by_collection: Retrieve products in a specific collection
    - collections_find: Find collections for a store
    """
    # Product-related queries
    all_products = DjangoFilterConnectionField(
        ProductNode, default_domain=graphene.String(required=True))
    product = graphene.Field(ProductNode, id=graphene.ID(required=True))
    
    # Image-related queries
    all_media_images = DjangoFilterConnectionField(
        ImageNode, default_domain=graphene.String(required=True))
    get_images_product = DjangoFilterConnectionField(
        ImageNode, product_id=graphene.ID(required=True))
    
    # Product Variant queries
    product_details_variants = DjangoFilterConnectionField(
        ProductVariantNode, product_id=graphene.ID(required=True))
    
    # Collection-related queries
    all_collections = DjangoFilterConnectionField(
        CollectionNode, default_domain=graphene.String(required=True))
    collection_by_id = graphene.Field(
        CollectionNode, id=graphene.ID(required=True))
    product_resource_collection = DjangoFilterConnectionField(
        ProductNode, collection_id=graphene.ID(required=True))
    products_by_collection = DjangoFilterConnectionField(
        ProductNode, collection_id=graphene.ID(required=True))
    collections_find = DjangoFilterConnectionField(
        CollectionNode, default_domain=graphene.String(required=True))

    def resolve_all_products(self, info, default_domain, **kwargs):
        """
        Resolve query to retrieve all products for a specific store.
        
        Performs authentication and authorization checks before returning products.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store to retrieve products from.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Product instances for the specified store.
        
        Raises:
            GraphQLError: If user is not authenticated or lacks permissions.
        """
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check if user has permission to view products
            if staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                filtered_products = ProductFilter(
                    data=kwargs, queryset=store.products.all()).qs
                return filtered_products
            else:
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "NOT_AUTHORIZED",
                    "status": 401
                }
            )
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_product(self, info, id, **kwargs):
        """
        Resolve query to retrieve a specific product by its ID.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            id (int): Unique identifier of the product.
            **kwargs: Additional filtering arguments.
        
        Returns:
            Product instance matching the given ID.
        
        Raises:
            GraphQLError: If product is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            product = Product.objects.get(pk=id)
            store = product.store
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                return product
            else:
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "NOT_AUTHORIZED",
                    "status": 401
                }
            )
        except Product.DoesNotExist:
            raise GraphQLError("Product not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_product_details_variants(self, info, product_id, **kwargs):
        """
        Resolve query to retrieve product variants for a specific product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            product_id (int): Unique identifier of the product.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of ProductVariant instances for the specified product.
        
        Raises:
            GraphQLError: If product is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)
            store = product.store
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Exclude the first variant and order by created_at in descending order
            variants = product.variants.all().order_by('-created_at')
            if product.first_variant:
                variants = variants.exclude(id=product.first_variant.id)
            
            return variants
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 401
                }
            )
        except Product.DoesNotExist:
            raise GraphQLError("Product not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "PERMISSION_DENIED",
                "status": 401
            })

    def resolve_all_media_images(self, info, default_domain, **kwargs):
        """
        Resolve query to retrieve all media images for a specific store.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store to retrieve images from.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Image instances for the specified store.
        
        Raises:
            GraphQLError: If store is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Retrieve images for the store, ordered by creation time
            images = Image.objects.filter(store=store).order_by('-created_at')
            return images
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )

    def resolve_get_images_product(self, info, product_id, **kwargs):
        """
        Resolve query to retrieve images for a specific product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            product_id (int): Unique identifier of the product.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Image instances associated with the product.
        
        Raises:
            GraphQLError: If product is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)
            store = product.store
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Retrieve images for the product, ordered by creation time
            images = product.first_variant.images.all().order_by('-created_at')
            return images
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Product.DoesNotExist:
            raise GraphQLError("Product not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )

    def resolve_all_collections(self, info, default_domain, **kwargs):
        """
        Resolve query to retrieve all collections for a specific store.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store to retrieve collections from.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Collection instances for the specified store.
        
        Raises:
            GraphQLError: If store is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Retrieve collections for the store, ordered by creation time
            collections = Collection.objects.filter(store=store).order_by('-created_at')
            return collections
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )

    def resolve_collection_by_id(self, info, id, **kwargs):
        """
        Resolve query to retrieve a specific collection by its ID.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            id (int): Unique identifier of the collection.
            **kwargs: Additional filtering arguments.
        
        Returns:
            Collection instance matching the given ID.
        
        Raises:
            GraphQLError: If collection is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=id)
            store = collection.store
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Return the collection
            return collection
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Collection.DoesNotExist:
            raise GraphQLError("Collection not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )

    def resolve_products_by_collection(self, info, collection_id, **kwargs):
        """
        Resolve query to retrieve products in a specific collection.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Product instances in the specified collection.
        
        Raises:
            GraphQLError: If collection is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=collection_id)
            store = collection.store
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Retrieve products for the collection, ordered by creation time
            products = collection.products.all().order_by('-created_at')
            return products
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Collection.DoesNotExist:
            raise GraphQLError("Collection not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )

    def resolve_product_resource_collection(self, info, collection_id, **kwargs):
        """
        Resolve query to retrieve products in a specific collection.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Product instances in the specified collection.
        
        Raises:
            GraphQLError: If collection is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=collection_id)
            store = collection.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                return ProductFilter(data=kwargs, queryset=store.products.all().order_by('-created_at')).qs
            else:
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Collection.DoesNotExist:
            raise GraphQLError("Collection not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_collections_find(self, info, default_domain, **kwargs):
        """
        Resolve query to find collections for a specific store.
        
        Provides flexible searching and filtering of collections.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store to retrieve collections from.
            **kwargs: Additional filtering arguments.
        
        Returns:
            QuerySet of Collection instances matching the search criteria.
        
        Raises:
            GraphQLError: If store is not found or user lacks permissions.
        """
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_VIEW):
                raise GraphQLError(
                    "You do not have permission to view products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            
            # Apply collection filter for the store
            filter_collections = CollectionFilter(
                data=kwargs, queryset=store.collections.all()).qs
            return filter_collections
        
        except GraphQLError as gql_error:
            # Handle GraphQL-specific errors
            raise gql_error
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
                               extensions={
                                   "code": "NOT_FOUND",
                                   "status": 404
                               })
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "UNAUTHORIZED",
                    "status": 401
                }
            )
