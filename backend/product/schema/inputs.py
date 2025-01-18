import graphene
from core.fields import JSONString


class OptionValueInput(graphene.InputObjectType):
    """
    Input type for creating or updating option values.
    
    Represents a single option value for a product, such as color or size.
    Used in product variant and option configurations.
    
    Attributes:
        id (graphene.ID): Optional unique identifier for the option value.
        name (graphene.String): Required name of the option value.
    """
    id = graphene.ID()
    name = graphene.String(required=True)


class ProductOptionInput(graphene.InputObjectType):
    """
    Input type for creating or updating product options.
    
    Represents a product option with its associated values, like 'Color' or 'Size'.
    
    Attributes:
        id (graphene.ID): Optional unique identifier for the product option.
        name (graphene.String): Required name of the product option.
        values (graphene.List): List of option values associated with this option.
    """
    id = graphene.ID()
    name = graphene.String(required=True)
    values = graphene.List(OptionValueInput)

    def resolve_values(self, info):
        """
        Resolves the related OptionValues for this ProductOption.
        
        Args:
            info: GraphQL resolver info.
        
        Returns:
            List of option values associated with this product option.
        """
        return self.values.all()


class SEOInput(graphene.InputObjectType):
    """
    Input type for Search Engine Optimization (SEO) metadata.
    
    Used to provide SEO-related information for products and collections.
    
    Attributes:
        title (graphene.String): Optional SEO title.
        description (graphene.String): Optional SEO description.
    """
    title = graphene.String()
    description = graphene.String()


class ProductVariantInput(graphene.InputObjectType):
    """
    Input type for creating or updating product variants.
    
    Represents a specific variant of a product with its pricing and stock details.
    
    Attributes:
        variant_id (graphene.ID): Optional unique identifier for the variant.
        price (graphene.Decimal): Price of the product variant.
        compare_at_price (graphene.Decimal): Comparative price for marketing purposes.
        stock (graphene.Int): Available stock quantity.
        option_values (graphene.List): List of option value IDs for this variant.
    """
    variant_id = graphene.ID()
    price = graphene.Decimal()
    compare_at_price = graphene.Decimal()
    stock = graphene.Int()
    option_values = graphene.List(graphene.ID)


class CollectionInputs(graphene.InputObjectType):
    """
    Input type for creating or updating product collections.
    
    Represents a collection of products with metadata and SEO information.
    
    Attributes:
        title (graphene.String): Required title of the collection.
        description (graphene.String): Optional description of the collection.
        handle (graphene.String): Optional URL-friendly identifier.
        image_id (graphene.ID): Optional ID of the collection's representative image.
        seo (SEOInput): Optional SEO metadata for the collection.
    """
    title = graphene.String(required=True)
    description = graphene.String()
    handle = graphene.String()
    image_id = graphene.ID()
    seo = SEOInput()


class ProductInput(graphene.InputObjectType):
    """
    Input type for creating or updating products.
    
    Comprehensive input for product details, including variants, options, and metadata.
    
    Attributes:
        title (graphene.String): Required title of the product.
        description (JSONString): Product description with support for rich text.
        status (graphene.String): Product status (e.g., draft, active).
        handle (graphene.String): URL-friendly product identifier.
        seo (SEOInput): Optional SEO metadata for the product.
        first_variant (ProductVariantInput): Required first product variant.
        options (graphene.List): Optional list of product options.
        collection_ids (graphene.List): Optional list of collection IDs the product belongs to.
    """
    title = graphene.String(required=True)
    description = JSONString(description="Product description.")
    status = graphene.String()
    handle = graphene.String()
    seo = SEOInput()
    first_variant = ProductVariantInput(required=True)
    options = graphene.List(ProductOptionInput)
    collection_ids = graphene.List(graphene.ID)
