import graphene
from core.models import SEO
from product.models import Collection, Image, OptionValue, Product, ProductOption, ProductVariant
from product.utils import add_values_to_variant, update_product_options_and_values, update_product_collections
from stores.models import StaffMember, Store
from .types import CollectionNode, ProductNode, ProductVariantNode
from .inputs import CollectionInputs, ProductInput, ProductVariantInput
from graphql import GraphQLError
from decimal import Decimal


class CreateProduct(graphene.Mutation):
    product = graphene.Field(ProductNode)

    class Arguments:
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    def mutate(root, info, product, default_domain):
        try:
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():

                product_obj = Product(
                    store=store,
                    title=product.title,
                    description=product.description or {},
                    status=product.status if product.status in dict(
                        Product.STATUS) else "DRAFT"
                )

                if product.seo and isinstance(product.seo, dict):
                    seo = SEO.objects.create(**product.seo)
                else:
                    seo = SEO.objects.create(title=product.title)
                product_obj.seo = seo
                product_obj.save()

                first_variant_data = product.first_variant
                # Add flexibility for price input
                price_amount = getattr(first_variant_data, 'price_amount', None) or getattr(first_variant_data, 'price', 0.0)
                compare_at_price = getattr(first_variant_data, 'compare_at_price', None) or getattr(first_variant_data, 'compareAtPrice', None)
                stock = getattr(first_variant_data, 'stock', 0)

                first_variant = ProductVariant(
                    product=product_obj,
                    price_amount=Decimal(str(price_amount)),
                    compare_at_price=Decimal(str(compare_at_price)) if compare_at_price is not None else None,
                    stock=stock,
                )

                first_variant.save()
                product_obj.first_variant = first_variant
                product_obj.save()

                # Handle collection IDs with more flexibility
                collection_ids = getattr(product, 'collection_ids', None) or getattr(product, 'collectionIds', None)
                if collection_ids is not None:
                    update_product_collections(product_obj, collection_ids)

                if product.options:
                    update_product_options_and_values(product_obj, product.options)

                if first_variant_data.option_values:
                    add_values_to_variant(first_variant, first_variant_data.option_values)

                return CreateProduct(product=product_obj)
            raise GraphQLError(
                "You do not have permission to create products.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )
        except Exception as e:
            raise GraphQLError(str(e))


class UpdateProduct(graphene.Mutation):
    product = graphene.Field(ProductNode)

    class Arguments:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    def mutate(self, info, id, product, default_domain):
        user = info.context.user

        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise GraphQLError(
                "Store with the provided domain does not exist.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise GraphQLError(
                "You are not authorized to update products for this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )

        try:
            product_instance = Product.objects.get(pk=id, store=store)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        if len(product.title) > 255:
            raise GraphQLError(
                "Title length cannot exceed 255 characters.",
                extensions={
                    "code": "INVALID_INPUT",
                    "status": 400
                }
            )

        if product.seo and product.seo.title and len(product.seo.title) > 255:
            raise GraphQLError(
                "SEO title length cannot exceed 255 characters.",
                extensions={
                    "code": "INVALID_INPUT",
                    "status": 400
                }
            )

        product_instance.title = product.title
        product_instance.description = product.description
        product_instance.status = product.status
        product_instance.handle = product.handle
        
        # Handle SEO fields safely
        if product.seo:
            seo = product_instance.seo
            seo.title = product.seo.title or seo.title
            seo.description = product.seo.description or seo.description
            seo.save()
        
        first_variant = product_instance.first_variant
        if product.first_variant.price < 0:
            raise GraphQLError(
                "Price cannot be negative.",
                extensions={
                    "code": "INVALID_PRICE",
                    "status": 400
                }
            )
        if product.first_variant.compare_at_price and product.first_variant.compare_at_price < product.first_variant.price:
            raise GraphQLError(
                "Compare at price cannot be less than price.",
                extensions={
                    "code": "INVALID_PRICE",
                    "status": 400
                }
            )
        first_variant.price_amount = product.first_variant.price
        first_variant.compare_at_price = product.first_variant.compare_at_price
        first_variant.stock = product.first_variant.stock
        first_variant.save()
        product_instance.save()
        
        # update options if provided
        if hasattr(product, 'options'):
            update_product_options_and_values(product_instance, product.options)
        
        # Handle collection IDs safely
        collection_ids = getattr(product, 'collection_ids', None) or getattr(product, 'collectionIds', None)
        if collection_ids is not None:
            update_product_collections(product_instance, collection_ids)
        
        return UpdateProduct(product=product_instance)


class VariantActions(graphene.Enum):
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE"


class CreateProductVariant(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)

    product_variant = graphene.Field(ProductVariantNode)

    @classmethod
    def mutate(cls, root, info, product_id, variant_inputs):
        user = info.context.user
        # Verify that the user has permission to add product variant
        try:
            product = Product.objects.get(pk=product_id)
            if not StaffMember.objects.filter(user=user, store=product.store).exists():
                raise GraphQLError(
                    "You are not authorized to add product variants for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        variant = ProductVariant.objects.create(
            product=product,
            price_amount=variant_inputs.price_amount,
            stock=variant_inputs.stock,
        )
        add_values_to_variant(variant, variant_inputs.option_values)
        return CreateProductVariant(product_variant=variant)


class UpdateProductVariant(graphene.Mutation):
    class Arguments:
        variant_inputs = ProductVariantInput(required=True)
    product_variant = graphene.Field(ProductVariantNode)

    @classmethod
    def mutate(cls, root, info, variant_inputs):
        user = info.context.user
        # get variant object and Verify that the user has permission to update product variant
        try:
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)
            if not StaffMember.objects.filter(user=user, store=variant.product.store).exists():
                raise GraphQLError(
                    "You are not authorized to update product variants for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except ProductVariant.DoesNotExist:
            raise GraphQLError(
                "Product variant not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        variant.price_amount = variant_inputs.price_amount
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

    @classmethod
    def mutate(cls, root, info, action, variant_ids):
        user = info.context.user
        # get variant objects and Verify that the user has permission to perform action on product variants
        try:
            variants = ProductVariant.objects.filter(id__in=variant_ids)
            if not StaffMember.objects.filter(user=user, store=variants.first().product.store).exists():
                raise GraphQLError(
                    "You are not authorized to perform action on product variants for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except ProductVariant.DoesNotExist:
            raise GraphQLError(
                "Product variant not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        if action == VariantActions.DELETE:
            variants.delete()
            return PerformActionOnVariants(success=True, message="Product variants deleted successfully.")


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
            raise GraphQLError(
                "Store with the provided domain does not exist.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise GraphQLError(
                "You are not authorized to update products for this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )
        try:
            product = Product.objects.get(pk=product_id, store=store)
            images = Image.objects.filter(pk__in=image_ids)
            product.first_variant.images.add(*images)
            return AddImagesProduct(product=product)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )


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
                raise GraphQLError(
                    "You are not authorized to update products for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
            product = Product.objects.get(pk=product_id, store=store)
            images = Image.objects.filter(pk__in=image_ids)
            product.first_variant.images.remove(*images)
            return RemoveImagesProduct(product=product)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        except Exception as e:
            raise GraphQLError(str(e))


class CreateCollection(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        collection_inputs = CollectionInputs(required=True)

    collection = graphene.Field(CollectionNode)

    @classmethod
    def mutate(cls, root, info, default_domain, collection_inputs):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise GraphQLError(
                "Store with the provided domain does not exist.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise GraphQLError(
                "You are not authorized to create collections for this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )
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
        return CreateCollection(collection=collection)


class UpdateCollection(graphene.Mutation):
    class Arguments:
        collection_id = graphene.ID(required=True)
        collection_inputs = CollectionInputs(required=True)

    collection = graphene.Field(CollectionNode)

    @classmethod
    def mutate(cls, root, info, collection_id, collection_inputs):
        user = info.context.user
        try:
            collection = Collection.objects.get(id=collection_id)
            if not StaffMember.objects.filter(user=user, store=collection.store).exists():
                raise GraphQLError(
                    "You are not authorized to update collections for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        collection.title = collection_inputs.title if collection_inputs.title is not None else collection.title
        collection.description = collection_inputs.description if collection_inputs.description is not None else collection.description

        collection.handle = collection_inputs.handle
        seo_data = collection_inputs.seo if isinstance(collection_inputs.seo, dict) else {
            "title": collection.title, "description": ""}
        if collection.seo:
            collection.seo.title = seo_data.get("title", collection.title)
            collection.seo.description = seo_data.get("description", "")
        else:
            seo = SEO.objects.create(**seo_data)
            collection.seo = seo
        collection.seo.save()
        if collection_inputs.image_id:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id)
                if not collection.image or collection.image.id != image.id:
                    collection.image = image
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image with the given ID not found.",
                    extensions={
                        "code": "NOT_FOUND",
                        "status": 404
                    }
                )
        else:
            collection.image = None

        collection.save()
        return UpdateCollection(collection=collection)


class DeleteCollections(graphene.Mutation):
    class Arguments:
        collection_ids = graphene.List(graphene.ID)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, collection_ids):
        user = info.context.user
        try:
            collections = Collection.objects.filter(id__in=collection_ids)
            if not StaffMember.objects.filter(user=user, store=collections.first().store).exists():
                raise GraphQLError(
                    "You are not authorized to delete collections for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        collections.delete()
        return DeleteCollections(success=True)


class AddProductsToCollection(graphene.Mutation):
    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids):
        user = info.context.user
        try:
            collection = Collection.objects.get(id=collection_id)
            if not StaffMember.objects.filter(user=user, store=collection.store).exists():
                raise GraphQLError(
                    "You are not authorized to update collections for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        try:
            products = Product.objects.filter(id__in=product_ids)
            collection.products.add(*products)
            return AddProductsToCollection(success=True)
        except Exception as e:
            raise GraphQLError(str(e))


class DeleteProductsFromCollection(graphene.Mutation):
    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID)

    success = graphene.Boolean()

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids):
        user = info.context.user
        try:
            collection = Collection.objects.get(id=collection_id)
            if not StaffMember.objects.filter(user=user, store=collection.store).exists():
                raise GraphQLError(
                    "You are not authorized to update collections for this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )
        try:
            products = Product.objects.filter(id__in=product_ids)
            collection.products.remove(*products)
            return DeleteProductsFromCollection(success=True)
        except Exception as e:
            raise GraphQLError(str(e))


class Mutation(graphene.ObjectType):
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
