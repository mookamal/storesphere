import graphene
from core.models import SEO
from product.models import Collection, Image, OptionValue, Product, ProductOption, ProductVariant
from product.utils import add_values_to_variant, update_product_options_and_values, update_product_collections
from stores.models import StaffMember, Store
from .types import CollectionNode, ProductNode, ProductVariantNode
from .inputs import CollectionInputs, ProductInput, ProductVariantInput
from django.core.exceptions import PermissionDenied
from graphql import GraphQLError


class CreateProduct(graphene.relay.ClientIDMutation):
    product = graphene.Field(ProductNode)

    class Input:
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    def mutate_and_get_payload(root, info, **input):
        try:
            product_data = input.get("product")
            default_domain = input.get("default_domain")
            user = info.context.user
            store = Store.objects.get(default_domain=default_domain)
            if StaffMember.objects.filter(user=user, store=store).exists():

                product = Product(
                    store=store,
                    title=product_data.title,
                    description=product_data.description or None,
                    status=product_data.status if product_data.status in dict(
                        Product.STATUS) else "DRAFT"
                )

                if product_data.seo and isinstance(product_data.seo, dict):
                    seo = SEO.objects.create(**product_data.seo)
                else:
                    seo = SEO.objects.create(title=product_data.title)
                product.seo = seo
                product.save()

                first_variant_data = product_data.first_variant
                first_variant = ProductVariant(
                    product=product,
                    price_amount=first_variant_data.price if first_variant_data.price != None else 0.0,
                    compare_at_price=first_variant_data.compare_at_price if first_variant_data.compare_at_price != None else 0.0,
                    stock=first_variant_data.stock if first_variant_data.stock != None else 0,
                )

                first_variant.save()
                product.first_variant = first_variant
                product.save()
                # to create options and values
                if product_data.options:
                    for option_data in product_data.options:
                        option = ProductOption.objects.create(
                            product=product, name=option_data.name)
                        for value_data in option_data.values:
                            OptionValue.objects.create(
                                option=option, name=value_data.name)
                if product_data.collection_ids:
                    product.collections.add(
                        *Collection.objects.filter(pk__in=product_data.collection_ids))
                    product.save()

                return CreateProduct(product=product)
            else:
                raise GraphQLError(
                    "You are not authorized to access this store.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except Exception as e:
            raise GraphQLError(str(e))


class UpdateProduct(graphene.relay.ClientIDMutation):
    product = graphene.Field(ProductNode)

    class Input:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @ classmethod
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
        first_variant.price_amount = product.first_variant.price
        first_variant.compare_at_price = product.first_variant.compare_at_price
        first_variant.stock = product.first_variant.stock
        first_variant.save()
        product_instance.save()
        # update options
        update_product_options_and_values(product_instance, product.options)
        update_product_collections(product_instance, product.collection_ids)
        return UpdateProduct(product=product_instance)


class VariantActions(graphene.Enum):
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE "


class CreateProductVariant(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)

    product_variant = graphene.Field(ProductVariantNode)

    @ classmethod
    def mutate(cls, root, info, product_id, variant_inputs):
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
            price_amount=variant_inputs.price,
            stock=variant_inputs.stock,
        )
        add_values_to_variant(variant, variant_inputs.option_values)
        return CreateProductVariant(product_variant=variant)


class UpdateProductVariant(graphene.Mutation):
    class Arguments:
        variant_inputs = ProductVariantInput(required=True)
    product_variant = graphene.Field(ProductVariantNode)

    @ classmethod
    def mutate(cls, root, info, variant_inputs):
        user = info.context.user
        # get variant object and Verify that the user has permission to update product variant
        try:
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)
            if not StaffMember.objects.filter(user=user, store=variant.product.store).exists():
                raise PermissionDenied(
                    "You are not authorized to update product variants for this store.")
        except ProductVariant.DoesNotExist:
            raise Exception("Product variant not found.")
        variant.price_amount = variant_inputs.price
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

    @ classmethod
    def mutate(cls, root, info, action, variant_ids):
        user = info.context.user
        # get variant objects and Verify that the user has permission to perform action on product variants
        try:
            variants = ProductVariant.objects.filter(id__in=variant_ids)
            if not StaffMember.objects.filter(user=user, store=variants.first().product.store).exists():
                raise PermissionDenied(
                    "You are not authorized to perform action on product variants for this store.")
        except ProductVariant.DoesNotExist:
            raise Exception("Product variant not found.")
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
            raise Exception("Store with the provided domain does not exist.")

        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise PermissionDenied(
                "You are not authorized to update products for this store.")
        try:
            product = Product.objects.get(pk=product_id, store=store)
            images = Image.objects.filter(pk__in=image_ids)
            product.first_variant.images.add(*images)
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
            product.first_variant.images.remove(*images)
            return RemoveImagesProduct(product=product)
        except Product.DoesNotExist:
            raise Exception(
                "Product not found or you do not have access to this product.")
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")


class CreateCollection(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        collection_inputs = CollectionInputs(required=True)

    collection = graphene.Field(CollectionNode)

    @ classmethod
    def mutate(cls, root, info, default_domain, collection_inputs):
        user = info.context.user
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise Exception("Store with the provided domain does not exist.")
        if not StaffMember.objects.filter(user=user, store=store).exists():
            raise PermissionDenied(
                "You are not authorized to create collections for this store.")
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
                raise PermissionDenied(
                    "You are not authorized to update collections for this store.")
        except Collection.DoesNotExist:
            raise Exception("Collection not found.")
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
                raise Exception("Image with the given ID not found.")
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
                raise PermissionDenied(
                    "You are not authorized to delete collections for this store.")
        except Collection.DoesNotExist:
            raise Exception("Collection not found.")
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
                raise PermissionDenied(
                    "You are not authorized to update collections for this store.")
        except Collection.DoesNotExist:
            raise Exception("Collection not found.")
        try:
            products = Product.objects.filter(id__in=product_ids)
            collection.products.add(*products)
            return AddProductsToCollection(success=True)
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")


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
                raise PermissionDenied(
                    "You are not authorized to update collections for this store.")
        except Collection.DoesNotExist:
            raise Exception("Collection not found.")
        try:
            products = Product.objects.filter(id__in=product_ids)
            collection.products.remove(*products)
            return DeleteProductsFromCollection(success=True)
        except Exception as e:
            raise PermissionDenied(f"Authentication failed: {str(e)}")


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
