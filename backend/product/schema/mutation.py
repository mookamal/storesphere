import graphene

from .mutations import (
    AddImagesProduct,
    CreateCollection,
    UpdateCollection,
    DeleteCollections,
    AddProductsToCollection,
    CreateProduct,
    CreateProductVariant,
    PerformActionOnVariants,
    RemoveImagesProduct,
    UpdateProduct,
    UpdateProductVariant,
    DeleteProductsFromCollection,
)


class Mutation(graphene.ObjectType):
    """
    GraphQL mutation type for product-related mutations.
    """
    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    create_product_variant = CreateProductVariant.Field()
    update_product_variant = UpdateProductVariant.Field()
    perform_action_on_variants = PerformActionOnVariants.Field()
    add_images_product = AddImagesProduct.Field()
    remove_images_product = RemoveImagesProduct.Field()
    create_collection = CreateCollection.Field()
    add_products_to_collection = AddProductsToCollection.Field()
    delete_products_from_collection = DeleteProductsFromCollection.Field()
    update_collection = UpdateCollection.Field()
    delete_collections = DeleteCollections.Field()
