import graphene
from .models import Product
import django_filters
from graphene_django import DjangoObjectType
from graphene import Scalar
from graphql.language import ast
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.converter import convert_django_field
from django_ckeditor_5.fields import CKEditor5Field

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

class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = ["status","title"]

class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        interfaces = (graphene.relay.Node, )

class Query(graphene.ObjectType):
    all_products = DjangoFilterConnectionField(ProductNode, filterset_class=ProductFilter)
    product = graphene.relay.Node.Field(ProductNode)