import pytest
from ...models import Product, ProductVariant, ProductOption, OptionValue
from decimal import Decimal


@pytest.fixture
def product(db, store, seo):
    product = Product.objects.create(
        title="Test product", store=store, seo=seo)
    first_variant = ProductVariant.objects.create(
        product=product, sku="123", price_amount=Decimal(10), stock=10)
    product.first_variant = first_variant
    product.save()
    return product


@pytest.fixture
def variant_with_options(product, red_option_value):
    variant = ProductVariant.objects.create(
        product=product, sku="123", price_amount=Decimal(10), stock=10)
    variant.selected_options.add(red_option_value)
    return variant


@pytest.fixture
def draft_product(db, store):
    return Product.objects.create(
        store=store,
        title="Draft Product",
        status="DRAFT"
    )


@pytest.fixture
def active_product(db, store):
    return Product.objects.create(
        store=store,
        title="Active Product",
        status="ACTIVE"
    )


@pytest.fixture
def size_option(product):
    return ProductOption.objects.create(
        product=product,
        name="Size"
    )


@pytest.fixture
def size_values(size_option):
    small = OptionValue.objects.create(option=size_option, name="Small")
    medium = OptionValue.objects.create(option=size_option, name="Medium")
    large = OptionValue.objects.create(option=size_option, name="Large")
    return [small, medium, large]


@pytest.fixture
def discounted_variant(product):
    return ProductVariant.objects.create(
        product=product,
        sku="DISC-123",
        price_amount=Decimal("50.00"),
        compare_at_price=Decimal("100.00"),
        stock=5
    )


@pytest.fixture
def multi_variant_product(db, store, product_image):
    product = Product.objects.create(
        store=store,
        title="Multi-Variant Product"
    )
    variant1 = ProductVariant.objects.create(
        product=product,
        sku="MV-1",
        price_amount=Decimal("10.00"),
        stock=10
    )
    variant2 = ProductVariant.objects.create(
        product=product,
        sku="MV-2",
        price_amount=Decimal("15.00"),
        stock=5
    )
    product.first_variant = variant1
    product.save()
    return product

@pytest.fixture
def product_variant(product):
    """
    Fixture to create a standard product variant for testing
    """
    return ProductVariant.objects.create(
        product=product,
        price_amount=19.99,
        stock=100
    )