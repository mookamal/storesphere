
import graphene
from graphene_django import DjangoObjectType
from core.models import SEO
from product.models import Collection, Image, OptionValue, Product, ProductOption, ProductVariant

from graphene import Scalar
from graphql.language import ast
from graphene_django.converter import convert_django_field
from django_ckeditor_5.fields import CKEditor5Field
from core.schema.types.money import Money


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


class OptionValueType(DjangoObjectType):
    class Meta:
        model = OptionValue
        fields = ["id", "name"]


class ProductOptionType(DjangoObjectType):
    # Define a custom field to get the related values
    values = graphene.List(OptionValueType)

    class Meta:
        model = ProductOption
        fields = ["id", "name", "values"]

    def resolve_values(self, info):
        # Resolving the related OptionValues for this ProductOption
        return self.values.all()


class SEOType(DjangoObjectType):
    class Meta:
        model = SEO
        fields = ["title", "description",]


class ProductVariantNode(DjangoObjectType):
    variant_id = graphene.Int()
    selected_options = graphene.List(OptionValueType)
    pricing = graphene.Field(
        Money, description="Price of the product variant.")

    class Meta:
        model = ProductVariant
        interfaces = (graphene.relay.Node,)
        exclude = ("price",)
        filter_fields = ["created_at",]

    def resolve_variant_id(self, info):
        return self.id

    def resolve_selected_options(self, info):
        return self.selected_options.all()

    def resolve_pricing(self, info):
        return Money(currency=self.price.currency, amount=self.price.amount)


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
        filter_fields = {"title": ["exact", "istartswith", "icontains"]}
        interfaces = (graphene.relay.Node,)
        exclude = ('store',)

    def resolve_collection_id(self, info):
        return self.id

    def resolve_products_count(self, info):
        return self.products.all().count()


class ProductNode(DjangoObjectType):
    in_collection = graphene.Boolean()
    product_id = graphene.Int()
    seo = graphene.Field(SEOType)
    image = graphene.Field(ImageNode)
    first_variant = graphene.Field(ProductVariantNode)
    options = graphene.List(ProductOptionType)
    collections = graphene.List(CollectionNode)

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
        try:
            return self.first_variant.images.first()
        except AttributeError:
            return None

    def resolve_in_collection(self, info):
        collection_id = info.variable_values.get("collectionId")
        if not collection_id:
            return False
        return self.collections.filter(pk=collection_id).exists()

    def resolve_collections(self, info):
        return self.collections.all()
