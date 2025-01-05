import pytest
from ...models import Product, ProductVariant
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
