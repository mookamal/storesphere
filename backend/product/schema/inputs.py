import graphene


class OptionValueInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String(required=True)


class ProductOptionInput(graphene.InputObjectType):
    id = graphene.ID()
    name = graphene.String(required=True)
    values = graphene.List(OptionValueInput)

    def resolve_values(self, info):
        # Resolving the related OptionValues for this ProductOption
        return self.values.all()


class SEOInput(graphene.InputObjectType):
    title = graphene.String()
    description = graphene.String()


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


class CollectionInputs(graphene.InputObjectType):
    title = graphene.String(required=True)
    description = graphene.String()
    handle = graphene.String()
    image_id = graphene.ID()
    seo = SEOInput()
