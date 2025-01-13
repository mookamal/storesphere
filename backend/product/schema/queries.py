import django_filters
import graphene
from graphql import GraphQLError
from product.models import Collection, Image, Product
from graphene_django.filter import DjangoFilterConnectionField
from stores.models import Store, StaffMember
from stores.enums import StorePermissions
from .types import ProductNode, ImageNode, CollectionNode, ProductVariantNode


class ProductFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Product.STATUS)

    class Meta:
        model = Product
        fields = ['status', 'title']


class CollectionFilter(django_filters.FilterSet):
    class Meta:
        model = Collection
        fields = ['title']


class Query(graphene.ObjectType):
    all_products = DjangoFilterConnectionField(
        ProductNode, default_domain=graphene.String(required=True))
    product = graphene.Field(ProductNode, id=graphene.ID(required=True))
    all_media_images = DjangoFilterConnectionField(
        ImageNode, default_domain=graphene.String(required=True))
    get_images_product = DjangoFilterConnectionField(
        ImageNode, product_id=graphene.ID(required=True))
    product_details_variants = DjangoFilterConnectionField(
        ProductVariantNode, product_id=graphene.ID(required=True))
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
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for products view permission
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
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_product(self, info, id, **kwargs):
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
        except Exception as e:
            raise GraphQLError(f"Authentication failed: {str(e)}",
                               extensions={
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_product_details_variants(self, info, product_id, **kwargs):
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
            images = Image.objects.filter(
                store=store).order_by('-created_at')
            return images
        
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 401
                }
            )
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
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

    def resolve_get_images_product(self, info, product_id, **kwargs):
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)
            store = product.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                images = product.first_variant.images.all().order_by('-created_at')
                return images
            else:
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
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
                "code": "AUTHENTICATION_ERROR",
                "status": 401
            })

    def resolve_all_collections(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                collections = Collection.objects.filter(
                    store=store).order_by('-created_at')
                return collections
            else:
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
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

    def resolve_collection_by_id(self, info, id, **kwargs):
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=id)
            store = collection.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                return collection
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

    def resolve_products_by_collection(self, info, collection_id, **kwargs):
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=collection_id)
            store = collection.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                products = collection.products.all().order_by('-created_at')
                return products
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

    def resolve_product_resource_collection(self, info, collection_id, **kwargs):
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
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                filter_collections = CollectionFilter(
                    data=kwargs, queryset=store.collections.all()).qs
                return filter_collections
            else:
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Store.DoesNotExist:
            raise GraphQLError("Store not found.",
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
