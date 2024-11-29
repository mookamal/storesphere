from graphql import GraphQLError
import graphene
from stores.models import Store, StaffMember
from core.models import SEO
from .models import Product, Image, ProductVariant, ProductOption, OptionValue, Collection
import django_filters
from graphene_django import DjangoObjectType
from graphene import Scalar
from graphql.language import ast
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.converter import convert_django_field
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import PermissionDenied
from .utils import update_product_options_and_values, add_values_to_variant


class HTML(Scalar):
    """Scalar for HTML content."""
    @staticmethod
    def serialize(value):
        return str(value)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return str(node.value)
        return None

    @staticmethod
    def parse_value(value):
        return str(value)


@convert_django_field.register(CKEditor5Field)
def convert_ckeditor_field_to_html(field, registry=None):
    return HTML()

# GraphQL Type for OptionValue


class OptionValueType(DjangoObjectType):
    class Meta:
        model = OptionValue
        fields = ["id", "name"]


class OptionValueInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String(required=True)
# GraphQL Type for ProductOption


class ProductOptionType(DjangoObjectType):
    # Define a custom field to get the related values
    values = graphene.List(OptionValueType)

    class Meta:
        model = ProductOption
        fields = ["id", "name", "values"]

    def resolve_values(self, info):
        # Resolving the related OptionValues for this ProductOption
        return self.values.all()


class ProductOptionInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String(required=True)
    values = graphene.List(OptionValueInput)

    def resolve_values(self, info):
        # Resolving the related OptionValues for this ProductOption
        return self.values.all()


class SEOType(DjangoObjectType):
    class Meta:
        model = SEO
        fields = ["title", "description",]


class SEOInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()


class ProductVariantNode(DjangoObjectType):
    variant_id = graphene.Int()
    selected_options = graphene.List(OptionValueType)

    class Meta:
        model = ProductVariant
        interfaces = (graphene.relay.Node,)
        filter_fields = ["created_at",]

    def resolve_variant_id(self, info):
        return self.id

    def resolve_selected_options(self, info):
        return self.selected_options.all()


class ProductFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Product.STATUS)

    class Meta:
        model = Product
        fields = ['status', 'title']


class ImageNode(DjangoObjectType):
    image_id = graphene.Int()

    class Meta:
        model = Image
        interfaces = (graphene.relay.Node, )
        exclude = ('store',)
        filter_fields = ["created_at",]

    def resolve_image(self, info):
        return self.image.url if self.image.url else None

    def resolve_image_id(self, info):
        return self.id


class CollectionNode(DjangoObjectType):
    collection_id = graphene.Int()
    seo = graphene.Field(SEOType)
    image = graphene.Field(ImageNode)
    products_count = graphene.Int()

    class Meta:
        model = Collection
        filter_fields = ['created_at']
        interfaces = (graphene.relay.Node,)
        exclude = ('store',)

    def resolve_collection_id(self, info):
        return self.id

    def resolve_products_count(self, info):
        return self.products.all().count()


class ProductNode(DjangoObjectType):
    product_id = graphene.Int()
    seo = graphene.Field(SEOType)
    image = graphene.Field(ImageNode)
    first_variant = graphene.Field(ProductVariantNode)
    options = graphene.List(ProductOptionType)

    class Meta:
        model = Product
        filter_fields = {"status": ['exact'], "title": [
            'exact', 'icontains', 'istartswith']}
        interfaces = (graphene.relay.Node, )
        exclude = ('store',)

    def resolve_options(self, info):
        # Resolving the related ProductOptions for this Product
        return self.options.all()

    def resolve_product_id(self, info):
        return self.id

    def resolve_image(self, info):
        return self.images.first() if self.images.first() else None


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
    products_by_collection = DjangoFilterConnectionField(
        ProductNode, collection_id=graphene.ID(required=True))

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


class ProductVariantInput(graphene.InputObjectType):
    variant_id = graphene.ID()
    price = graphene.Decimal()
    compare_at_price = graphene.Decimal()
    stock = graphene.Int()
    option_values = graphene.List(graphene.ID)


class ProductInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    status = graphene.String()
    handle = graphene.String()
    seo = SEOInput()
    first_variant = ProductVariantInput(required=True)
    options = graphene.List(ProductOptionInput)


class CreateProduct(graphene.relay.ClientIDMutation):
    product = graphene.Field(ProductNode)

    class Input:
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    def mutate_and_get_payload(root, info, **input):
        product_data = input.get("product")
        default_domain = input.get("default_domain")
        user = info.context.user
        store = Store.objects.get(default_domain=default_domain)
        if StaffMember.objects.filter(user=user, store=store).exists():

            product = Product(
                store=store,
                title=product_data.title,
                description=product_data.description or "",
                status=product_data.status if product_data.status in dict(
                    Product.STATUS) else "DRAFT"
            )

            if product_data.seo and isinstance(product_data.seo, dict):
                seo = SEO.objects.create(**product_data.seo)
            else:
                seo = None
            product.seo = seo
            product.save()
            first_variant_data = product_data.first_variant
            first_variant = ProductVariant(
                product=product,
                price=first_variant_data.price if first_variant_data.price != None else 0.0,
                compare_at_price=first_variant_data.compare_at_price if first_variant_data.compare_at_price != None else 0.0,
                stock=first_variant_data.stock if first_variant_data.stock != None else 0,
            )
            first_variant.save()
            product.first_variant = first_variant
            product.save()
            # to create options and values
            if product_data.options:
                for option_data in product_data.options:
                    option = ProductOption.objects.create(
                        product=product, name=option_data.name)
                    for value_data in option_data.values:
                        OptionValue.objects.create(
                            option=option, name=value_data.name)

            return CreateProduct(product=product)
        else:
            raise PermissionDenied(
                "You are not authorized to access this store.")


class UpdateProduct(graphene.relay.ClientIDMutation):
    product = graphene.Field(ProductNode)

    class Input:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @ classmethod
    def mutate_and_get_payload(cls, root, info, id, product, default_domain):
        user = info.context.user

        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise Exception("Store with the provided domain does not exist.")

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise PermissionDenied(
                "You are not authorized to update products for this store.")

        try:
            product_instance = Product.objects.get(pk=id, store=store)
        except Product.DoesNotExist:
            raise Exception(
                "Product not found or you do not have access to this product.")

        product_instance.title = product.title
        product_instance.description = product.description
        product_instance.status = product.status
        product_instance.handle = product.handle
        seo = product_instance.seo
        seo.title = product.seo.title
        seo.description = product.seo.description
        seo.save()
        first_variant = product_instance.first_variant
        first_variant.price = product.first_variant.price
        first_variant.compare_at_price = product.first_variant.compare_at_price
        first_variant.stock = product.first_variant.stock
        first_variant.save()
        product_instance.save()
        # update options
        update_product_options_and_values(product_instance, product.options)
        return UpdateProduct(product=product_instance)

# product variant


class VariantActions(graphene.Enum):
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE "


class CreateProductVariant(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)

    product_variant = graphene.Field(ProductVariantNode)

    @ classmethod
    def mutate(cls, root, info, product_id, variant_inputs):
        user = info.context.user
        # Verify that the user has permission to add product variant
        try:
            product = Product.objects.get(pk=product_id)
            if not StaffMember.objects.filter(user=user, store=product.store).exists():
                raise PermissionDenied(
                    "You are not authorized to add product variants for this store.")
        except Product.DoesNotExist:
            raise Exception(
                "Product not found or you do not have access to this product.")

        variant = ProductVariant.objects.create(
            product=product,
            price=variant_inputs.price,
            stock=variant_inputs.stock,
        )
        add_values_to_variant(variant, variant_inputs.option_values)
        return CreateProductVariant(product_variant=variant)


class UpdateProductVariant(graphene.Mutation):
    class Arguments:
        variant_inputs = ProductVariantInput(required=True)
    product_variant = graphene.Field(ProductVariantNode)

    @ classmethod
    def mutate(cls, root, info, variant_inputs):
        user = info.context.user
        # get variant object and Verify that the user has permission to update product variant
        try:
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)
            if not StaffMember.objects.filter(user=user, store=variant.product.store).exists():
                raise PermissionDenied(
                    "You are not authorized to update product variants for this store.")
        except ProductVariant.DoesNotExist:
            raise Exception("Product variant not found.")
        variant.price = variant_inputs.price
        variant.stock = variant_inputs.stock
        variant.save()
        return UpdateProductVariant(product_variant=variant)


class PerformActionOnVariants(graphene.Mutation):
    class Arguments:
        action = VariantActions(required=True)
        variant_ids = graphene.List(graphene.ID, required=True)
    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    @ classmethod
    def mutate(cls, root, info, action, variant_ids):
        user = info.context.user
        # get variant objects and Verify that the user has permission to perform action on product variants
        try:
            variants = ProductVariant.objects.filter(id__in=variant_ids)
            if not StaffMember.objects.filter(user=user, store=variants.first().product.store).exists():
                raise PermissionDenied(
                    "You are not authorized to perform action on product variants for this store.")
        except ProductVariant.DoesNotExist:
            raise Exception("Product variant not found.")
        if action == VariantActions.DELETE:
            variants.delete()
            return PerformActionOnVariants(success=True, message="Product variants deleted successfully.")

# Media for product


class AddImagesProduct(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID)

    product = graphene.Field(ProductNode)

    def mutate(self, info, default_domain, product_id, image_ids):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise Exception("Store with the provided domain does not exist.")

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise PermissionDenied(
                "You are not authorized to update products for this store.")
        try:
            product = Product.objects.get(pk=product_id, store=store)
            images = Image.objects.filter(pk__in=image_ids)
            product.images.add(*images)
            return AddImagesProduct(product=product)
        except Product.DoesNotExist:
            raise Exception(
                "Product not found or you do not have access to this product.")


class RemoveImagesProduct(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID)

    product = graphene.Field(ProductNode)

    def mutate(self, info, default_domain, product_id, image_ids):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
            if not StaffMember.objects.filter(user=user, store=store).exists():
                raise PermissionDenied(
                    "You are not authorized to update products for this store.")
            product = Product.objects.get(pk=product_id, store=store)
            images = Image.objects.filter(pk__in=image_ids)
            product.images.remove(*images)
            return RemoveImagesProduct(product=product)
        except Product.DoesNotExist:
            raise Exception(
                "Product not found or you do not have access to this product.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

# Collection


class CollectionInputs(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    handle = graphene.String()
    image_id = graphene.ID()
    product_ids = graphene.List(graphene.ID)
    seo = SEOInput()


class CreateCollection(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        collection_inputs = CollectionInputs(required=True)

    collection = graphene.Field(CollectionNode)

    @ classmethod
    def mutate(cls, root, info, default_domain, collection_inputs):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise Exception("Store with the provided domain does not exist.")
        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise PermissionDenied(
                "You are not authorized to create collections for this store.")
        collection = Collection.objects.create(
            store=store,
            title=collection_inputs.title,
            description=collection_inputs.description or "",
            handle=collection_inputs.handle,
            image_id=collection_inputs.image_id or None,
        )
        seo_data = collection_inputs.seo if isinstance(collection_inputs.seo, dict) else {
            "title": collection.title, "description": ""}
        seo = SEO.objects.create(**seo_data)
        collection.seo = seo
        collection.save()
        if collection_inputs.image_id:
            image = Image.objects.get(pk=collection_inputs.image_id)
            collection.image = image
        if collection_inputs.product_ids:
            products = Product.objects.filter(
                pk__in=collection_inputs.product_ids)
            if not products.exists():
                raise ValueError("No valid products were found.")

            collection.products.add(*products)
        return CreateCollection(collection=collection)


class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    create_product_variant = CreateProductVariant.Field()
    update_product_variant = UpdateProductVariant.Field()
    perform_action_on_variants = PerformActionOnVariants.Field()
    add_images_product = AddImagesProduct.Field()
    remove_images_product = RemoveImagesProduct.Field()
    create_collection = CreateCollection.Field()
