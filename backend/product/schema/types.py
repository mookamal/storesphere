import graphene
from graphene_django import DjangoObjectType
from core.models import SEO
from product.models import Collection, Image, OptionValue, Product, ProductOption, ProductVariant
from core.schema.types.money import Money
from core.fields import JSONString


class OptionValueType(DjangoObjectType):
    """
    GraphQL object type representing an option value for a product.
    
    Converts the OptionValue Django model to a GraphQL type.
    Used to represent specific values for product options like color or size.
    
    Attributes:
        id (graphene.ID): Unique identifier for the option value.
        name (graphene.String): Name of the option value.
    """
    class Meta:
        model = OptionValue
        fields = ["id", "name"]


class ProductOptionType(DjangoObjectType):
    """
    GraphQL object type representing a product option.
    
    Converts the ProductOption Django model to a GraphQL type.
    Allows retrieving option details and associated values.
    
    Attributes:
        id (graphene.ID): Unique identifier for the product option.
        name (graphene.String): Name of the product option.
        values (graphene.List): List of option values associated with this option.
    """
    values = graphene.List(OptionValueType)

    class Meta:
        model = ProductOption
        fields = ["id", "name", "values"]

    def resolve_values(self, info):
        """
        Resolves and returns all option values associated with this product option.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            QuerySet of OptionValue instances related to this ProductOption.
        """
        return self.values.all()


class SEOType(DjangoObjectType):
    """
    GraphQL object type representing Search Engine Optimization (SEO) metadata.
    
    Converts the SEO Django model to a GraphQL type.
    Used to provide SEO-related information for products and collections.
    
    Attributes:
        title (graphene.String): SEO title.
        description (graphene.String): SEO description.
    """
    class Meta:
        model = SEO
        fields = ["title", "description",]


class ProductVariantNode(DjangoObjectType):
    """
    GraphQL node type representing a product variant.
    
    Converts the ProductVariant Django model to a GraphQL node type.
    Provides detailed information about a specific product variant.
    
    Attributes:
        variant_id (graphene.Int): Unique identifier for the product variant.
        selected_options (graphene.List): List of selected option values for this variant.
        pricing (graphene.Field): Pricing information for the product variant.
    """
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
        """
        Resolves the variant ID for the product variant.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            int: The unique identifier of the product variant.
        """
        return self.id

    def resolve_selected_options(self, info):
        """
        Resolves and returns the selected options for this product variant.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            QuerySet of OptionValue instances selected for this variant.
        """
        return self.selected_options.all()


class ImageNode(DjangoObjectType):
    """
    GraphQL node type representing an image.
    
    Converts the Image Django model to a GraphQL node type.
    Provides information about images associated with products or collections.
    
    Attributes:
        image_id (graphene.Int): Unique identifier for the image.
    """
    image_id = graphene.Int()

    class Meta:
        model = Image
        interfaces = (graphene.relay.Node, )
        exclude = ('store',)
        filter_fields = ["created_at",]

    def resolve_image_id(self, info):
        """
        Resolves the image ID for the image.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            int: The unique identifier of the image.
        """
        return self.id


class CollectionNode(DjangoObjectType):
    """
    GraphQL node type representing a product collection.
    
    Converts the Collection Django model to a GraphQL node type.
    Provides comprehensive information about product collections.
    
    Attributes:
        collection_id (graphene.Int): Unique identifier for the collection.
        seo (graphene.Field): SEO metadata for the collection.
        image (graphene.Field): Representative image for the collection.
        products_count (graphene.Int): Total number of products in the collection.
    """
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
        """
        Resolves the collection ID for the collection.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            int: The unique identifier of the collection.
        """
        return self.id

    def resolve_products_count(self, info):
        """
        Calculates and returns the total number of products in the collection.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            int: The count of products in the collection.
        """
        return self.products.count()


class ProductNode(DjangoObjectType):
    """
    GraphQL node type representing a product.
    
    Converts the Product Django model to a GraphQL node type.
    Provides comprehensive information about a product.
    
    Attributes:
        in_collection (graphene.Boolean): Indicates if the product is in a collection.
        product_id (graphene.Int): Unique identifier for the product.
        seo (graphene.Field): SEO metadata for the product.
        image (graphene.Field): Primary image for the product.
        first_variant (graphene.Field): First product variant.
        options (graphene.List): Product options.
        collections (graphene.List): Collections the product belongs to.
        description (JSONString): Detailed product description.
    """
    in_collection = graphene.Boolean()
    product_id = graphene.Int()
    seo = graphene.Field(SEOType)
    image = graphene.Field(ImageNode)
    first_variant = graphene.Field(ProductVariantNode)
    options = graphene.List(ProductOptionType)
    collections = graphene.List(CollectionNode)
    description = JSONString(description="Description of the product.")

    class Meta:
        model = Product
        filter_fields = {"status": ['exact'], "title": [
                    'exact', 'icontains', 'istartswith']}
        interfaces = (graphene.relay.Node, )
        exclude = ('store',)

    def resolve_options(self, info):
        """
        Resolves and returns product options.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            QuerySet of ProductOption instances for this product.
        """
        return self.options.all()

    def resolve_product_id(self, info):
        """
        Resolves the product ID for the product.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            int: The unique identifier of the product.
        """
        return self.id

    def resolve_image(self, info):
        """
        Resolves the primary image for the product.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            Image: The primary image of the product.
        """
        try:
            return self.first_variant.images.first()
        except AttributeError:
            return None

    def resolve_in_collection(self, info):
        """
        Checks if the product is part of any collection.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            bool: True if the product is in at least one collection, False otherwise.
        """
        collection_id = info.variable_values.get("collectionId")
        if not collection_id:
            return False
        return self.collections.filter(pk=collection_id).exists()

    def resolve_collections(self, info):
        """
        Resolves and returns collections the product belongs to.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            QuerySet of Collection instances this product is part of.
        """
        return self.collections.all()
