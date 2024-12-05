
import django_filters
import graphene
from graphql import GraphQLError
from product.models import Collection, Image, Product
from graphene_django.filter import DjangoFilterConnectionField
from django.core.exceptions import PermissionDenied
from stores.models import Store, StaffMember
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
    collection_find = DjangoFilterConnectionField(
        CollectionNode, default_domain=graphene.String(required=True))

    def resolve_all_products(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                filtered_products = ProductFilter(
                    data=kwargs, queryset=store.products.all()).qs
                return filtered_products
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_product(self, info, id, **kwargs):
        try:
            user = info.context.user
            product = Product.objects.get(pk=id)
            store = product.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                return product
            else:
                raise PermissionDenied(
                    "You are not authorized to access this product.")
        except Product.DoesNotExist:
            raise PermissionDenied("Product not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_product_details_variants(self, info, product_id, **kwargs):
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)
            store = product.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                variants = product.variants.all().order_by('-created_at')
                if product.first_variant:
                    variants = variants.exclude(id=product.first_variant.id)
                return variants
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Product.DoesNotExist:
            raise PermissionDenied("Product not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_all_media_images(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                images = Image.objects.filter(
                    store=store).order_by('-created_at')
                return images
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_get_images_product(self, info, product_id, **kwargs):
        try:
            user = info.context.user
            product = Product.objects.get(pk=product_id)
            store = product.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                images = product.images.all().order_by('-created_at')
                return images
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Product.DoesNotExist:
            raise PermissionDenied("Product not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_all_collections(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                collections = Collection.objects.filter(
                    store=store).order_by('-created_at')
                return collections
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

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
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Collection.DoesNotExist:
            raise PermissionDenied("Collection not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_product_resource_collection(self, info, collection_id, **kwargs):
        try:
            user = info.context.user
            collection = Collection.objects.get(pk=collection_id)
            store = collection.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                return ProductFilter(data=kwargs, queryset=store.products.all().order_by('-created_at')).qs
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Collection.DoesNotExist:
            raise PermissionDenied("Collection not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

    def resolve_collection_find(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                filter_collections = CollectionFilter(
                    data=kwargs, queryset=store.collections.all()).qs
                return filter_collections
            else:
                raise PermissionDenied(
                    "You are not authorized to access this store.")
        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")
