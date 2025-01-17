import graphene
from core.models import SEO
from product.models import Collection, Image, Product, ProductVariant
from product.utils import add_values_to_variant, update_product_options_and_values, update_product_collections
from stores.models import StaffMember, Store
from stores.enums import StorePermissions
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
            # Check user authentication
            user = info.context.user
            if not user or not user.is_authenticated:
                raise GraphQLError(
                    "Authentication required.",
                    extensions={
                        "code": "UNAUTHENTICATED",
                        "status": 401
                    }
                )

            # Verify store existence
            try:
                store = Store.objects.get(default_domain=default_domain)
            except Store.DoesNotExist:
                raise GraphQLError(
                    "Store not found.",
                    extensions={
                        "code": "NOT_FOUND",
                        "status": 404
                    }
                )

            # Check staff membership
            try:
                staff_member = StaffMember.objects.get(user=user, store=store)
            except StaffMember.DoesNotExist:
                raise GraphQLError(
                    "You are not a staff member of this store.",
                    extensions={
                        "code": "NOT_AUTHORIZED",
                        "status": 403
                    }
                )

            # Verify specific permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_CREATE):
                raise GraphQLError(
                    "You do not have permission to create products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )

            # Validate input
            if not product.title or len(product.title.strip()) == 0:
                raise GraphQLError(
                    "Product title cannot be empty.",
                    extensions={
                        "code": "INVALID_INPUT",
                        "status": 400
                    }
                )

            # Create product object
            product_obj = Product(
                store=store,
                title=product.title,
                description=product.description or {},
                status=product.status if product.status in dict(
                    Product.STATUS) else "DRAFT"
            )

            # Handle SEO data
            try:
                if product.seo and isinstance(product.seo, dict):
                    seo = SEO.objects.create(**product.seo)
                else:
                    seo = SEO.objects.create(title=product.title)
                product_obj.seo = seo
            except Exception as seo_error:
                raise GraphQLError(
                    f"Error creating SEO data: {str(seo_error)}",
                    extensions={
                        "code": "SEO_ERROR",
                        "status": 400
                    }
                )

            # Save product
            product_obj.save()

            # Handle first variant
            try:
                first_variant_data = product.first_variant
                # Flexible price input
                price_amount = getattr(first_variant_data, 'price_amount', None) or getattr(
                    first_variant_data, 'price', 0.0)
                compare_at_price = getattr(first_variant_data, 'compare_at_price', None) or getattr(
                    first_variant_data, 'compareAtPrice', None)
                stock = getattr(first_variant_data, 'stock', 0)

                # Validate price
                if price_amount < 0:
                    raise GraphQLError(
                        "Price cannot be negative.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

                first_variant = ProductVariant(
                    product=product_obj,
                    price_amount=Decimal(str(price_amount)),
                    compare_at_price=Decimal(
                        str(compare_at_price)) if compare_at_price is not None else None,
                    stock=stock,
                )

                first_variant.save()
                product_obj.first_variant = first_variant
                product_obj.save()
            except Exception as variant_error:
                # Rollback product creation if variant fails
                product_obj.delete()
                raise GraphQLError(
                    f"Error creating product variant: {str(variant_error)}",
                    extensions={
                        "code": "VARIANT_ERROR",
                        "status": 400
                    }
                )

            # Handle collections
            try:
                collection_ids = getattr(product, 'collection_ids', None) or getattr(
                    product, 'collectionIds', None)
                if collection_ids is not None:
                    update_product_collections(product_obj, collection_ids)
            except Exception as collection_error:
                raise GraphQLError(
                    f"Error updating collections: {str(collection_error)}",
                    extensions={
                        "code": "COLLECTION_ERROR",
                        "status": 400
                    }
                )

            # Handle product options
            if product.options:
                try:
                    update_product_options_and_values(
                        product_obj, product.options)
                except Exception as options_error:
                    raise GraphQLError(
                        f"Error updating product options: {
                            str(options_error)}",
                        extensions={
                            "code": "OPTIONS_ERROR",
                            "status": 400
                        }
                    )

            return CreateProduct(product=product_obj)

        except GraphQLError as gql_error:
            # Re-raise GraphQL errors as-is
            raise gql_error
        except Exception as e:
            # Handle unexpected errors
            raise GraphQLError(
                f"Unexpected error: {str(e)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )


class UpdateProduct(graphene.Mutation):
    product = graphene.Field(ProductNode)

    class Arguments:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    def mutate(self, info, id, product, default_domain):
        try:
            # Check user authentication
            user = info.context.user
            if not user or not user.is_authenticated:
                raise GraphQLError(
                    "Authentication required.",
                    extensions={
                        "code": "UNAUTHENTICATED",
                        "status": 401
                    }
                )

            # Verify store existence
            try:
                store = Store.objects.get(default_domain=default_domain)
            except Store.DoesNotExist:
                raise GraphQLError(
                    "Store not found.",
                    extensions={
                        "code": "NOT_FOUND",
                        "status": 404
                    }
                )

            # Check staff membership
            try:
                staff_member = StaffMember.objects.get(user=user, store=store)
            except StaffMember.DoesNotExist:
                raise GraphQLError(
                    "You are not a staff member of this store.",
                    extensions={
                        "code": "NOT_AUTHORIZED",
                        "status": 403
                    }
                )

            # Verify specific permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
                raise GraphQLError(
                    "You do not have permission to update products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )

            # Validate product existence
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

            # Validate title length
            if not product.title or len(product.title.strip()) == 0:
                raise GraphQLError(
                    "Product title cannot be empty.",
                    extensions={
                        "code": "INVALID_INPUT",
                        "status": 400
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

            # Update product details
            product_instance.title = product.title
            product_instance.description = product.description or {}
            product_instance.status = product.status if product.status in dict(
                Product.STATUS) else product_instance.status
            product_instance.handle = product.handle

            # Handle SEO data
            try:
                if product.seo and isinstance(product.seo, dict):
                    if product_instance.seo:
                        seo = product_instance.seo
                        seo.title = product.seo.get('title', seo.title)
                        seo.description = product.seo.get(
                            'description', seo.description)
                    else:
                        seo = SEO.objects.create(**product.seo)
                        product_instance.seo = seo
                    seo.save()
                elif not product_instance.seo:
                    seo = SEO.objects.create(title=product.title)
                    product_instance.seo = seo
            except Exception as seo_error:
                raise GraphQLError(
                    f"Error updating SEO data: {str(seo_error)}",
                    extensions={
                        "code": "SEO_ERROR",
                        "status": 400
                    }
                )

            # Handle first variant
            try:
                first_variant = product_instance.first_variant
                first_variant_data = product.first_variant

                # Flexible price input
                price_amount = getattr(first_variant_data, 'price_amount', None) or getattr(
                    first_variant_data, 'price', first_variant.price_amount)
                compare_at_price = getattr(first_variant_data, 'compare_at_price', None) or getattr(
                    first_variant_data, 'compareAtPrice', first_variant.compare_at_price)
                stock = getattr(first_variant_data, 'stock',
                                first_variant.stock)

                # Validate price
                if price_amount < 0:
                    raise GraphQLError(
                        "Price cannot be negative.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

                # Validate compare at price
                if compare_at_price is not None and compare_at_price < price_amount:
                    raise GraphQLError(
                        "Compare at price cannot be less than price.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

                first_variant.price_amount = Decimal(str(price_amount))
                first_variant.compare_at_price = Decimal(
                    str(compare_at_price)) if compare_at_price is not None else None
                first_variant.stock = stock
                first_variant.save()
            except Exception as variant_error:
                raise GraphQLError(
                    f"Error updating product variant: {str(variant_error)}",
                    extensions={
                        "code": "VARIANT_ERROR",
                        "status": 400
                    }
                )

            # Handle collections
            try:
                collection_ids = getattr(product, 'collection_ids', None) or getattr(
                    product, 'collectionIds', None)
                if collection_ids is not None:
                    update_product_collections(
                        product_instance, collection_ids)
            except Exception as collection_error:
                raise GraphQLError(
                    f"Error updating collections: {str(collection_error)}",
                    extensions={
                        "code": "COLLECTION_ERROR",
                        "status": 400
                    }
                )

            # Handle product options
            if product.options:
                try:
                    update_product_options_and_values(
                        product_instance, product.options)
                except Exception as options_error:
                    raise GraphQLError(
                        f"Error updating product options: {
                            str(options_error)}",
                        extensions={
                            "code": "OPTIONS_ERROR",
                            "status": 400
                        }
                    )

            product_instance.save()
            return UpdateProduct(product=product_instance)

        except GraphQLError as gql_error:
            # Re-raise GraphQL errors as-is
            raise gql_error
        except Exception as e:
            # Handle unexpected errors
            raise GraphQLError(
                f"Unexpected error: {str(e)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )


class VariantActions(graphene.Enum):
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE"


class CreateProductVariant(graphene.Mutation):
    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)
        default_domain = graphene.String(required=True)

    product_variant = graphene.Field(ProductVariantNode)

    @classmethod
    def mutate(cls, root, info, product_id, variant_inputs, default_domain):
        try:
            # 1. Authentication Check
            user = info.context.user
            if not user or not user.is_authenticated:
                raise GraphQLError(
                    "Authentication is required to create a product variant.",
                    extensions={
                        "code": "UNAUTHENTICATED",
                        "status": 401
                    }
                )

            # 2. Store Verification
            try:
                store = Store.objects.get(default_domain=default_domain)
            except Store.DoesNotExist:
                raise GraphQLError(
                    f"Store with domain '{default_domain}' not found.",
                    extensions={
                        "code": "STORE_NOT_FOUND",
                        "status": 404
                    }
                )

            # 3. Staff Membership Check
            try:
                staff_member = StaffMember.objects.get(user=user, store=store)
            except StaffMember.DoesNotExist:
                raise GraphQLError(
                    "You are not a staff member of this store.",
                    extensions={
                        "code": "NOT_STAFF_MEMBER",
                        "status": 403
                    }
                )

            # 4. Permission Verification
            if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
                raise GraphQLError(
                    "You do not have permission to create product variants.",
                    extensions={
                        "code": "INSUFFICIENT_PERMISSIONS",
                        "status": 403
                    }
                )

            # 5. Product Existence Validation
            try:
                product = Product.objects.get(pk=product_id, store=store)
            except Product.DoesNotExist:
                raise GraphQLError(
                    f"Product with ID {product_id} not found in the store.",
                    extensions={
                        "code": "PRODUCT_NOT_FOUND",
                        "status": 404
                    }
                )

            # 6. Input Validation
            if variant_inputs.price is not None:
                if variant_inputs.price < 0:
                    raise GraphQLError(
                        "Price cannot be negative.",
                        extensions={
                            "code": "INVALID_PRICE",
                            "status": 400
                        }
                    )

            if variant_inputs.stock is not None:
                if variant_inputs.stock < 0:
                    raise GraphQLError(
                        "Stock cannot be negative.",
                        extensions={
                            "code": "INVALID_STOCK",
                            "status": 400
                        }
                    )

            # 7. Variant Creation
            variant = ProductVariant(
                product=product,
                price_amount=variant_inputs.price,
                stock=variant_inputs.stock,
                compare_at_price=variant_inputs.compare_at_price
            )
            variant.save()

            # 8. Option Values Handling
            if variant_inputs.option_values:
                try:
                    add_values_to_variant(
                        variant, variant_inputs.option_values)
                except Exception as option_error:
                    # Rollback variant creation if option values fail
                    variant.delete()
                    raise GraphQLError(
                        f"Error adding option values: {str(option_error)}",
                        extensions={
                            "code": "OPTION_VALUE_ERROR",
                            "status": 400
                        }
                    )

            return CreateProductVariant(product_variant=variant)

        except GraphQLError as gql_error:
            # Re-raise GraphQL-specific errors
            raise gql_error
        except Exception as unexpected_error:
            # Catch and log any unexpected errors
            raise GraphQLError(
                f"An unexpected error occurred: {str(unexpected_error)}",
                extensions={
                    "code": "INTERNAL_SERVER_ERROR",
                    "status": 500
                }
            )


class UpdateProductVariant(graphene.Mutation):
    class Arguments:
        variant_inputs = ProductVariantInput(required=True)

    product_variant = graphene.Field(ProductVariantNode)

    @classmethod
    def mutate(cls, root, info, variant_inputs):
        user = info.context.user

        try:
            # Find product variant by ID
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)

            # Extract store from product
            store = variant.product.store

            # Check user permissions for the store
            try:
                staff_member = StaffMember.objects.get(user=user, store=store)
            except StaffMember.DoesNotExist:
                raise GraphQLError(
                    "You are not a staff member of this store.",
                    extensions={
                        "code": "NOT_AUTHORIZED",
                        "status": 403
                    }
                )

            # Verify specific permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
                raise GraphQLError(
                    "You do not have permission to update product variants.",
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

        # Validate and update price
        if variant_inputs.price is not None:
            if variant_inputs.price < 0:
                raise GraphQLError(
                    "Price cannot be negative.",
                    extensions={
                        "code": "INVALID_PRICE",
                        "status": 400
                    }
                )
            variant.price_amount = variant_inputs.price

        # Validate and update stock
        if variant_inputs.stock is not None:
            if variant_inputs.stock < 0:
                raise GraphQLError(
                    "Stock cannot be negative.",
                    extensions={
                        "code": "INVALID_STOCK",
                        "status": 400
                    }
                )
            variant.stock = variant_inputs.stock

        # Update compare at price if provided
        if variant_inputs.compare_at_price is not None:
            variant.compare_at_price = variant_inputs.compare_at_price

        # Save changes to product variant
        variant.save()

        # Add values to the variant
        add_values_to_variant(variant, variant_inputs.option_values)

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

        # Check variant existence in a single query
        variants = ProductVariant.objects.filter(id__in=variant_ids)

        # Verify all requested variants exist
        if variants.count() != len(variant_ids):
            raise GraphQLError(
                "Product variant not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Extract store from the first variant
        store = variants.first().product.store

        # Check user permissions for the store
        try:
            staff_member = StaffMember.objects.get(user=user, store=store)
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "NOT_AUTHORIZED",
                    "status": 403
                }
            )

        # Verify specific permission
        if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
            raise GraphQLError(
                "You do not have permission to perform actions on product variants.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )

        if action == VariantActions.DELETE:
            variants.delete()
            return PerformActionOnVariants(success=True, message="Product variants deleted successfully.")

        # Handle other actions if needed
        # ...

        return PerformActionOnVariants(success=False, message="Action not performed.")


class AddImagesProduct(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID)

    product = graphene.Field(ProductNode)

    def mutate(self, info, default_domain, product_id, image_ids):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError(
                "Authentication required.",
                extensions={
                    "code": "UNAUTHENTICATED",
                    "status": 401
                }
            )

        # Verify store existence
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

        # Check staff membership
        try:
            staff_member = StaffMember.objects.get(user=user, store=store)
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "NOT_AUTHORIZED",
                    "status": 403
                }
            )

        # Verify specific permission
        if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
            raise GraphQLError(
                "You do not have permission to update products.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )

        # Validate product existence
        try:
            product = Product.objects.get(pk=product_id, store=store)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate images
        images = Image.objects.filter(pk__in=image_ids, store=store)
        if not images.exists():
            raise GraphQLError(
                "No valid images found for addition.",
                extensions={
                    "code": "INVALID_IMAGES",
                    "status": 400
                }
            )

        # Add images to the first variant
        if product.first_variant:
            product.first_variant.images.add(*images)
        else:
            raise GraphQLError(
                "Product does not have a first variant.",
                extensions={
                    "code": "NO_FIRST_VARIANT",
                    "status": 400
                }
            )

        return AddImagesProduct(product=product)


class RemoveImagesProduct(graphene.Mutation):
    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID, required=True)

    product = graphene.Field(ProductNode)

    def mutate(self, info, default_domain, product_id, image_ids):
        # Check user authentication
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError(
                "Authentication required.",
                extensions={
                    "code": "UNAUTHENTICATED",
                    "status": 401
                }
            )

        # Validate store existence
        try:
            store = Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise GraphQLError(
                "Store not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Check staff membership and permissions
        try:
            staff_member = StaffMember.objects.get(user=user, store=store)
            
            # Check for product update permission
            if not staff_member.has_permission(StorePermissions.PRODUCTS_UPDATE):
                raise GraphQLError(
                    "You do not have permission to update products.",
                    extensions={
                        "code": "PERMISSION_DENIED",
                        "status": 403
                    }
                )
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "PERMISSION_DENIED",
                    "status": 403
                }
            )

        # Validate product existence and ownership
        try:
            product = Product.objects.get(pk=product_id, store=store)
        except Product.DoesNotExist:
            raise GraphQLError(
                "Product not found or you do not have access to this product.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Ensure product has a first variant
        if not product.first_variant:
            raise GraphQLError(
                "Product does not have a first variant.",
                extensions={
                    "code": "NO_FIRST_VARIANT",
                    "status": 400
                }
            )

        # Validate images
        images = Image.objects.filter(pk__in=image_ids, store=store)
        if not images.exists():
            raise GraphQLError(
                "No valid images found for removal.",
                extensions={
                    "code": "INVALID_IMAGES",
                    "status": 400
                }
            )

        # Remove images from the first variant
        product.first_variant.images.remove(*images)

        return RemoveImagesProduct(product=product)


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

        # Validate title length
        if len(collection_inputs.title) > 255:
            raise GraphQLError(
                "Collection title is too long. Maximum 255 characters allowed.",
                extensions={
                    "code": "TITLE_TOO_LONG",
                    "status": 400
                }
            )

        # Check for unique handle within the store
        if Collection.objects.filter(store=store, handle=collection_inputs.handle).exists():
            raise GraphQLError(
                "A collection with this handle already exists in the store.",
                extensions={
                    "code": "DUPLICATE_HANDLE",
                    "status": 400
                }
            )

        # Validate and limit SEO data
        def validate_seo_data(seo_data):
            MAX_TITLE_LENGTH = 70
            MAX_DESCRIPTION_LENGTH = 160

            seo_data = seo_data if isinstance(seo_data, dict) else {}
            seo_data['title'] = (seo_data.get('title', '') or collection_inputs.title)[
                :MAX_TITLE_LENGTH]
            seo_data['description'] = (seo_data.get('description', '') or '')[
                :MAX_DESCRIPTION_LENGTH]

            return seo_data

        seo_data = validate_seo_data(collection_inputs.seo)

        # Create collection
        collection = Collection.objects.create(
            store=store,
            title=collection_inputs.title,
            description=collection_inputs.description or "",
            handle=collection_inputs.handle,
            image_id=None,  # Will be set after validation
        )

        # Validate and set image if provided
        if collection_inputs.image_id:
            try:
                image = Image.objects.get(
                    pk=collection_inputs.image_id, store=store)
                collection.image = image
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image not found or does not belong to this store.",
                    extensions={
                        "code": "INVALID_IMAGE",
                        "status": 404
                    }
                )

        # Create SEO
        seo = SEO.objects.create(**seo_data)
        collection.seo = seo
        collection.save()

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

        # Validate unique handle within the store
        if collection_inputs.handle:
            existing_collection = Collection.objects.filter(
                handle=collection_inputs.handle,
                store=collection.store
            ).exclude(pk=collection.pk).exists()
            if existing_collection:
                raise GraphQLError(
                    "A collection with this handle already exists in the store.",
                    extensions={
                        "code": "DUPLICATE_HANDLE",
                        "status": 400
                    }
                )

        # Validate title length
        if collection_inputs.title and len(collection_inputs.title) > 255:
            raise GraphQLError(
                "Collection title cannot exceed 255 characters.",
                extensions={
                    "code": "TITLE_TOO_LONG",
                    "status": 400
                }
            )

        if collection_inputs.description and len(collection_inputs.description) > 1000:
            raise GraphQLError(
                "Collection description cannot exceed 1000 characters.",
                extensions={
                    "code": "DESCRIPTION_TOO_LONG",
                    "status": 400
                }
            )

        # Update title and description
        collection.title = collection_inputs.title if collection_inputs.title is not None else collection.title
        collection.description = collection_inputs.description if collection_inputs.description is not None else collection.description
        collection.handle = collection_inputs.handle if collection_inputs.handle is not None else collection.handle

        # Handle SEO data
        seo_data = collection_inputs.seo if isinstance(collection_inputs.seo, dict) else {
            "title": collection.title, "description": ""}

        # Truncate SEO data
        seo_title = seo_data.get("title", collection.title)
        if len(seo_title) > 70:
            seo_title = seo_title[:67] + "..."

        seo_description = seo_data.get("description", "")
        if len(seo_description) > 160:
            seo_description = seo_description[:157] + "..."

        # Update or create SEO
        if collection.seo:
            collection.seo.title = seo_title
            collection.seo.description = seo_description
        else:
            seo = SEO.objects.create(
                title=seo_title, description=seo_description)
            collection.seo = seo
        collection.seo.save()

        # Validate and update image
        if collection_inputs.image_id is None:
            collection.image = None
        elif collection_inputs.image_id is not None:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id)
                if image.store != collection.store:
                    raise GraphQLError(
                        "Image with the given ID not found.",
                        extensions={
                            "code": "IMAGE_NOT_FOUND",
                            "status": 404
                        }
                    )
                collection.image = image
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image with the given ID not found.",
                    extensions={
                        "code": "IMAGE_NOT_FOUND",
                        "status": 404
                    }
                )

        # Save changes to the collection
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
