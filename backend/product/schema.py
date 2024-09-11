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
    status = django_filters.ChoiceFilter(choices=Product.STATUS)
    class Meta:
        model = Product
        fields = ['status', 'title']



class ProductNode(DjangoObjectType):
    class Meta:
        model = Product
        filter_fields = {"status": ['exact'],"title":['exact', 'icontains', 'istartswith']}
        interfaces = (graphene.relay.Node, )

class Query(graphene.ObjectType):
    all_products = DjangoFilterConnectionField(ProductNode, default_domain=graphene.String(required=True))
    product = graphene.relay.Node.Field(ProductNode)

    def resolve_all_products(self, info, default_domain, **kwargs):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():
                filtered_products = ProductFilter(data=kwargs, queryset=store.products.all()).qs
                return filtered_products
            else:
                raise PermissionDenied("You are not authorized to access this store.")
        except Store.DoesNotExist:
            raise PermissionDenied("Store not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")
    
    # resolve product with check StaffMember
    def resolve_product(self, info, id, **kwargs):
        try:
            user = info.context.user
            product = Product.objects.get(pk=id)
            store = product.store
            if StaffMember.objects.filter(user=user, store=store).exists():
                return product
            else:
                raise PermissionDenied("You are not authorized to access this product.")
        except Product.DoesNotExist:
            raise PermissionDenied("Product not found.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")

class CreateProduct(graphene.relay.ClientIDMutation):
    product = graphene.Field(ProductNode)        
    class Input:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        status = graphene.String(required=True)
        default_domain = graphene.String(required=True)
    
    def mutate_and_get_payload(root, info ,**input):
        user = info.context.user
        store = Store.objects.get(default_domain=input.get('default_domain'))
        if StaffMember.objects.filter(user=user, store=store).exists():
            product = Product(store=store,title=input.get('title'), description=input.get('description'), status=input.get('status'))
            product.save()
            return CreateProduct(product=product)
        else:
            raise PermissionDenied("You are not authorized to access this store.")

class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()