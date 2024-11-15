import graphene
from stores.models import Store, StaffMember
from core.models import SEO
from .models import Product, Image, ProductVariant, ProductOption, OptionValue
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


class ProductVariantInput(graphene.InputObjectType):
    price = graphene.Decimal()
    compare_at_price = graphene.Decimal()


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


class ProductInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String(required=True)
    status = graphene.String(required=True)
    handle = graphene.String(required=True)
    seo = SEOInput(required=True)
    first_variant = ProductVariantInput()
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
            product = Product(store=store, title=product_data.title,
                              description=product_data.description, status=product_data.status)
            seo = SEO.objects.create(**product_data.seo)
            product.seo = seo
            product.save()
            first_variant_data = product_data.first_variant
            first_variant = ProductVariant(
                product=product,
                price=first_variant_data.price,
                compare_at_price=first_variant_data.compare_at_price,
            )
            first_variant.save()
            product.first_variant = first_variant
            product.save()
            # to create options and values
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

    @classmethod
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
        first_variant.save()
        product_instance.save()
        # update options
        update_product_options_and_values(product_instance, product.options)
        return UpdateProduct(product=product_instance)

# product variant


class CreateProductVariant(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        price = graphene.Decimal()
        option_values = graphene.List(graphene.ID)

    product_variant = graphene.Field(ProductVariantNode)

    @classmethod
    def mutate(cls, root, info, product_id, price, option_values):
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
            price=price,
        )
        add_values_to_variant(variant, option_values)
        return CreateProductVariant(product_variant=variant)

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


class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    create_product_variant = CreateProductVariant.Field()
    add_images_product = AddImagesProduct.Field()
    remove_images_product = RemoveImagesProduct.Field()
