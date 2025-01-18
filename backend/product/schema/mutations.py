import graphene
from core.models import SEO
from product.models import Collection, Image, Product, ProductVariant
from product.utils import add_values_to_variant, update_product_options_and_values, update_product_collections
from stores.models import StaffMember, Store
from stores.enums import StorePermissions
from core.utils.constants import StorePermissionErrors
from .types import CollectionNode, ProductNode, ProductVariantNode
from .inputs import CollectionInputs, ProductInput, ProductVariantInput
from graphql import GraphQLError
from decimal import Decimal
from django.utils.text import slugify
from core.mutations import BaseMutation


class CreateProduct(BaseMutation):
    """
    GraphQL mutation for creating a new product.
    
    Handles the process of creating a product with its first variant, 
    options, and associated metadata. Performs authentication and 
    authorization checks.
    
    Attributes:
        product (graphene.Field): The newly created product.
    
    Arguments:
        product (ProductInput): Input data for creating the product.
        default_domain (str): Domain of the store where the product is being created.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, product, default_domain):
        """
        Mutation method to create a new product.
        """
        # Authenticate and get user
        user = cls.check_authentication(info)
        
        # Get store
        store = cls.get_store(default_domain)
        
        # Get staff member
        staff_member = cls.get_staff_member(user, store)
        
        # Check permission
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_CREATE)
        
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
            status=product.status if product.status in dict(Product.STATUS) else "DRAFT"
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
                    f"Error updating product options: {str(options_error)}",
                    extensions={
                        "code": "OPTIONS_ERROR",
                        "status": 400
                    }
                )

        return CreateProduct(product=product_obj)


class UpdateProduct(BaseMutation):
    """
    GraphQL mutation for updating an existing product.
    
    Handles updating product details, variants, options, and metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The updated product.
    
    Arguments:
        id (graphene.ID): ID of the product to update.
        product (ProductInput): Input data for updating the product.
        default_domain (str): Domain of the store where the product exists.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        id = graphene.ID(required=True)
        product = ProductInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, id, product, default_domain):
        """
        Mutation method to update an existing product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            id (int): Unique identifier of the product to update.
            product (ProductInput): Detailed input for updating the product.
            default_domain (str): Domain of the store.
        
        Returns:
            UpdateProduct: A mutation result containing the updated product.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        try:
            # Check user authentication
            user = cls.check_authentication(info)

            # Verify store existence
            store = cls.get_store(default_domain)

            # Check staff membership
            staff_member = cls.get_staff_member(user, store)

            # Verify specific permission
            cls.check_permission(
                staff_member, StorePermissions.PRODUCTS_UPDATE)

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
                Product.STATUS) else "DRAFT"
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
    """
    Enum for actions that can be performed on product variants.
    """
    DELETE = "DELETE"
    UPDATE_PRICE = "UPDATE_PRICE"


class CreateProductVariant(BaseMutation):
    """
    GraphQL mutation for creating a new product variant.
    
    Handles the process of adding a new variant to an existing product.
    Performs authentication and authorization checks.
    
    Attributes:
        product_variant (graphene.Field): The newly created product variant.
    
    Arguments:
        product_id (graphene.ID): ID of the product to add the variant to.
        variant_inputs (ProductVariantInput): Input data for creating the variant.
        default_domain (str): Domain of the store where the variant is being created.
    """
    product_variant = graphene.Field(ProductVariantNode)

    class Arguments:
        product_id = graphene.ID(required=True)
        variant_inputs = ProductVariantInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, product_id, variant_inputs, default_domain):
        """
        Mutation method to create a new product variant.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            product_id (int): Unique identifier of the product.
            variant_inputs (ProductVariantInput): Detailed input for creating the variant.
            default_domain (str): Domain of the store.
        
        Returns:
            CreateProductVariant: A mutation result containing the created product variant.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        try:
            # 1. Authentication Check
            user = cls.check_authentication(info)

            # 2. Store Verification
            store = cls.get_store(default_domain)

            # 3. Staff Membership Check
            staff_member = cls.get_staff_member(user, store)

            # 4. Permission Verification
            cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

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


class UpdateProductVariant(BaseMutation):
    """
    GraphQL mutation for updating an existing product variant.
    
    Handles updating variant details and associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        product_variant (graphene.Field): The updated product variant.
    
    Arguments:
        variant_inputs (ProductVariantInput): Input data for updating the variant.
        default_domain (str): Domain of the store.
    """
    product_variant = graphene.Field(ProductVariantNode)

    class Arguments:
        variant_inputs = ProductVariantInput(required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, variant_inputs, default_domain):
        """
        Mutation method to update an existing product variant.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            variant_inputs (ProductVariantInput): Detailed input for updating the variant.
            default_domain (str): Domain of the store.
        
        Returns:
            UpdateProductVariant: A mutation result containing the updated product variant.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Get user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member
        staff_member = cls.get_staff_member(user, store)

        # Check permission
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

        # Get product variant
        try:
            # Find product variant by ID
            variant = ProductVariant.objects.get(id=variant_inputs.variant_id)
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


class PerformActionOnVariants(BaseMutation):
    """
    GraphQL mutation for performing actions on product variants.
    
    Handles actions such as deleting variants.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the action was successful.
        message (graphene.String): A message describing the result of the action.
        errors (graphene.List): A list of error messages if the action failed.
    
    Arguments:
        action (VariantActions): The action to perform.
        variant_ids (graphene.List): IDs of the variants to perform the action on.
        default_domain (graphene.String): The domain of the store.
    """
    success = graphene.Boolean()
    message = graphene.String()
    errors = graphene.List(graphene.String)

    class Arguments:
        action = VariantActions(required=True)
        variant_ids = graphene.List(graphene.ID, required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, action, variant_ids, default_domain):
        """
        Mutation method to perform an action on product variants.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            action (VariantActions): The action to perform.
            variant_ids (list): IDs of the variants to perform the action on.
            default_domain (str): Domain of the store.
        
        Returns:
            PerformActionOnVariants: A mutation result containing the outcome of the action.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Get user
        user = cls.check_authentication(info)

        # Get store
        store = cls.get_store(default_domain)

        # Get staff member
        staff_member = cls.get_staff_member(user, store)

        # Check permission
        cls.check_permission(staff_member, StorePermissions.PRODUCTS_UPDATE)

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

        if action == VariantActions.DELETE:
            variants.delete()
            return PerformActionOnVariants(success=True, message="Product variants deleted successfully.")

        # Handle other actions if needed
        # ...

        return PerformActionOnVariants(success=False, message="Action not performed.")


class AddImagesProduct(graphene.Mutation):
    """
    GraphQL mutation for adding images to a product.
    
    Handles adding images to a product's first variant.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The product with the added images.
    
    Arguments:
        default_domain (str): Domain of the store where the product exists.
        product_id (graphene.ID): ID of the product to add images to.
        image_ids (graphene.List): IDs of the images to add.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID)

    def mutate(self, info, default_domain, product_id, image_ids):
        """
        Mutation method to add images to a product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            product_id (int): Unique identifier of the product.
            image_ids (list): IDs of the images to add.
        
        Returns:
            AddImagesProduct: A mutation result containing the product with the added images.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
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
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
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
    """
    GraphQL mutation for removing images from a product.
    
    Handles removing images from a product's first variant.
    Performs authentication and authorization checks.
    
    Attributes:
        product (graphene.Field): The product with the removed images.
    
    Arguments:
        default_domain (str): Domain of the store where the product exists.
        product_id (graphene.ID): ID of the product to remove images from.
        image_ids (graphene.List): IDs of the images to remove.
    """
    product = graphene.Field(ProductNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        product_id = graphene.ID(required=True)
        image_ids = graphene.List(graphene.ID, required=True)

    def mutate(self, info, default_domain, product_id, image_ids):
        """
        Mutation method to remove images from a product.
        
        Args:
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            product_id (int): Unique identifier of the product.
            image_ids (list): IDs of the images to remove.
        
        Returns:
            RemoveImagesProduct: A mutation result containing the product with the removed images.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
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
                    StorePermissionErrors.PERMISSION_DENIED['message'],
                    extensions={
                        "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                        "status": StorePermissionErrors.PERMISSION_DENIED['status']
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
    """
    GraphQL mutation for creating a new collection.
    
    Handles the process of creating a collection with its associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        collection (graphene.Field): The newly created collection.
    
    Arguments:
        default_domain (str): Domain of the store where the collection is being created.
        collection_inputs (CollectionInputs): Input data for creating the collection.
    """
    collection = graphene.Field(CollectionNode)

    class Arguments:
        default_domain = graphene.String(required=True)
        collection_inputs = CollectionInputs(required=True)

    @classmethod
    def validate_seo_data(cls, seo_data, title):
        """
        Validate and truncate SEO data.
        
        Args:
            seo_data (dict): SEO data to validate.
            title (str): Title of the collection.
        
        Returns:
            dict: Validated and truncated SEO data.
        """
        MAX_TITLE_LENGTH = 70
        MAX_DESCRIPTION_LENGTH = 160

        # If no SEO data provided, use default from title
        if not seo_data:
            return {
                'title': title[:MAX_TITLE_LENGTH],
                'description': ''
            }

        # Ensure seo_data is a dictionary
        seo_data = seo_data if isinstance(seo_data, dict) else {}

        # Use title as fallback for SEO title
        seo_title = (seo_data.get('title', '') or title)[:MAX_TITLE_LENGTH]
        seo_description = (seo_data.get('description', '') or '')[:MAX_DESCRIPTION_LENGTH]

        return {
            'title': seo_title,
            'description': seo_description
        }

    @classmethod
    def mutate(cls, root, info, default_domain, collection_inputs):
        """
        Mutation method to create a new collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            default_domain (str): Domain of the store.
            collection_inputs (CollectionInputs): Detailed input for creating the collection.
        
        Returns:
            CreateCollection: A mutation result containing the created collection.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authentication check
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
                "Store not found",
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
        if not staff_member.has_permission(StorePermissions.COLLECTIONS_CREATE):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

        # Validate title length
        title = collection_inputs.title.strip()
        if len(title) > 255:
            raise GraphQLError(
                "Collection title is too long. Maximum 255 characters allowed.",
                extensions={
                    "code": "TITLE_TOO_LONG",
                    "status": 400
                }
            )

        # Check for duplicate handle
        handle = collection_inputs.handle
        if handle and Collection.objects.filter(store=store, handle=handle).exists():
            raise GraphQLError(
                "A collection with this handle already exists in the store.",
                extensions={
                    "code": "DUPLICATE_HANDLE",
                    "status": 400
                }
            )

        # Validate and handle image
        image = None
        if collection_inputs.image_id:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id)
                if image.store != store:
                    raise GraphQLError(
                        "Image not found or does not belong to this store",
                        extensions={
                            "code": "INVALID_IMAGE",
                            "status": 400
                        }
                    )
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image not found or does not belong to this store",
                    extensions={
                        "code": "INVALID_IMAGE",
                        "status": 400
                    }
                )

        # Validate SEO data
        seo_data = cls.validate_seo_data(collection_inputs.seo, title)

        # Create SEO object
        seo_obj = SEO.objects.create(
            title=seo_data['title'], 
            description=seo_data['description']
        )

        # Prepare collection data
        collection_data = {
            'store': store,
            'title': title,
            'description': collection_inputs.description or '',
            'handle': handle or slugify(title),
            'image': image,
            'seo': seo_obj
        }

        # Create collection
        collection = Collection.objects.create(**{k: v for k, v in collection_data.items() if v is not None})

        return CreateCollection(collection=collection)


class UpdateCollection(graphene.Mutation):
    """
    GraphQL mutation for updating an existing collection.
    
    Handles updating collection details and associated metadata.
    Performs authentication and authorization checks.
    
    Attributes:
        collection (graphene.Field): The updated collection.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to update.
        collection_inputs (CollectionInputs): Input data for updating the collection.
    """
    collection = graphene.Field(CollectionNode)

    class Arguments:
        collection_id = graphene.ID(required=True)
        collection_inputs = CollectionInputs(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, collection_inputs):
        """
        Mutation method to update an existing collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            collection_inputs (CollectionInputs): Detailed input for updating the collection.
        
        Returns:
            UpdateCollection: A mutation result containing the updated collection.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authentication check
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError(
                "Authentication required.",
                extensions={
                    "code": "UNAUTHENTICATED",
                    "status": 401
                }
            )

        # Validate collection existence
        try:
            collection = Collection.objects.get(id=collection_id)
            store = collection.store
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
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
        if not staff_member.has_permission(StorePermissions.COLLECTIONS_UPDATE):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

        # Validate unique handle within the store
        handle = collection_inputs.handle
        if handle:
            existing_collection = Collection.objects.filter(
                handle=handle,
                store=store
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

        # Validate and update image if provided
        if collection_inputs.image_id is not None:
            try:
                image = Image.objects.get(pk=collection_inputs.image_id,store=store)
                collection.image = image
            except Image.DoesNotExist:
                raise GraphQLError(
                    "Image with the given ID not found.",
                    extensions={
                        "code": "IMAGE_NOT_FOUND",
                        "status": 404
                    }
                )
        elif collection_inputs.image_id is None:
            # Explicitly remove image
            collection.image = None

        # Update title and description
        if collection_inputs.title is not None:
            collection.title = collection_inputs.title
        if collection_inputs.description is not None:
            collection.description = collection_inputs.description
        if collection_inputs.handle is not None:
            collection.handle = collection_inputs.handle

        # Handle SEO data
        seo_data = collection_inputs.seo if isinstance(collection_inputs.seo, dict) else {}

        # Truncate SEO data
        seo_title = (seo_data.get("title", collection.title) or collection.title)[:70]
        seo_description = (seo_data.get("description", "") or "")[:160]

        # Update or create SEO
        if collection.seo:
            collection.seo.title = seo_title
            collection.seo.description = seo_description
            collection.seo.save()
        else:
            seo = SEO.objects.create(
                title=seo_title, 
                description=seo_description
            )
            collection.seo = seo

        # Save changes to the collection
        collection.save()
        return UpdateCollection(collection=collection)


class DeleteCollections(graphene.Mutation):
    """
    GraphQL mutation for deleting collections.
    
    Handles deleting multiple collections at once.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the deletion was successful.
    
    Arguments:
        collection_ids (graphene.List): IDs of the collections to delete.
        default_domain (str): Domain of the store where the collections exist.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_ids = graphene.List(graphene.ID, required=True)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_ids, default_domain):
        """
        Mutation method to delete collections.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_ids (list): IDs of the collections to delete.
            default_domain (str): Domain of the store.
        
        Returns:
            DeleteCollections: A mutation result indicating the success of the deletion.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authentication check
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
        if not staff_member.has_permission(StorePermissions.COLLECTIONS_DELETE):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

        # Validate collection existence and ownership
        collections = Collection.objects.filter(
            id__in=collection_ids, 
            store=store
        )

        # Check if all requested collections exist in the store
        if collections.count() != len(collection_ids):
            raise GraphQLError(
                "One or more collections not found or do not belong to this store.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Delete collections
        collections.delete()

        return DeleteCollections(success=True)


class AddProductsToCollection(graphene.Mutation):
    """
    GraphQL mutation for adding products to a collection.
    
    Handles adding multiple products to a collection at once.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the addition was successful.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to add products to.
        product_ids (graphene.List): IDs of the products to add.
        default_domain (str): Domain of the store where the collection exists.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids, default_domain):
        """
        Mutation method to add products to a collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            product_ids (list): IDs of the products to add.
            default_domain (str): Domain of the store.
        
        Returns:
            AddProductsToCollection: A mutation result indicating the success of the addition.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authentication check
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
        if not staff_member.has_permission(StorePermissions.COLLECTIONS_UPDATE):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

        # Validate collection existence
        try:
            collection = Collection.objects.get(id=collection_id, store=store)
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate products
        if product_ids:
            products = Product.objects.filter(id__in=product_ids, store=store)
            
            # Check if all requested products exist in the store
            if products.count() != len(product_ids):
                raise GraphQLError(
                    "One or more products not found or do not belong to this store.",
                    extensions={
                        "code": "INVALID_PRODUCTS",
                        "status": 400
                    }
                )

            # Add products to collection
            collection.products.add(*products)

        return AddProductsToCollection(success=True)


class DeleteProductsFromCollection(graphene.Mutation):
    """
    GraphQL mutation for removing products from a collection.
    
    Handles removing multiple products from a collection at once.
    Performs authentication and authorization checks.
    
    Attributes:
        success (graphene.Boolean): Whether the removal was successful.
    
    Arguments:
        collection_id (graphene.ID): ID of the collection to remove products from.
        product_ids (graphene.List): IDs of the products to remove.
        default_domain (str): Domain of the store where the collection exists.
    """
    success = graphene.Boolean()

    class Arguments:
        collection_id = graphene.ID(required=True)
        product_ids = graphene.List(graphene.ID)
        default_domain = graphene.String(required=True)

    @classmethod
    def mutate(cls, root, info, collection_id, product_ids, default_domain):
        """
        Mutation method to remove products from a collection.
        
        Args:
            root: Root resolver.
            info (GraphQLResolveInfo): GraphQL resolver information.
            collection_id (int): Unique identifier of the collection.
            product_ids (list): IDs of the products to remove.
            default_domain (str): Domain of the store.
        
        Returns:
            DeleteProductsFromCollection: A mutation result indicating the success of the removal.
        
        Raises:
            GraphQLError: If authentication fails or store-related checks do not pass.
        """
        # Authentication check
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
        if not staff_member.has_permission(StorePermissions.COLLECTIONS_UPDATE):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

        # Validate collection existence
        try:
            collection = Collection.objects.get(id=collection_id, store=store)
        except Collection.DoesNotExist:
            raise GraphQLError(
                "Collection not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

        # Validate products
        if product_ids:
            products = Product.objects.filter(id__in=product_ids, store=store)
            
            # Check if all requested products exist in the store
            if products.count() != len(product_ids):
                raise GraphQLError(
                    "One or more products not found or do not belong to this store.",
                    extensions={
                        "code": "INVALID_PRODUCTS",
                        "status": 400
                    }
                )

            # Remove products from collection
            collection.products.remove(*products)

        return DeleteProductsFromCollection(success=True)


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
