import graphene
from stores.models import Store , StaffMember
from .models import Product
import django_filters
from graphene_django import DjangoObjectType
from graphene import Scalar
from graphql.language import ast
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.converter import convert_django_field
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import PermissionDenied

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
    all_products = DjangoFilterConnectionField(ProductNode, filterset_class=ProductFilter , default_domain=graphene.String(required=True))
    product = graphene.relay.Node.Field(ProductNode)


    def resolve_all_products(self,info, default_domain):
        try:
            user = info.context.user
            print("user",user)
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                return store.products.all()
            else:
                raise PermissionDenied("You are not authorized to access this store.")
        except:
            raise PermissionDenied("Authentication failed.")