from decimal import Decimal
from uuid import uuid4

from django.conf import settings
from django.contrib.postgres.indexes import BTreeIndex
from django.db import models
from django.utils import timezone
from django_countries.fields import CountryField
from django_prices.models import Money, MoneyField

# pylint: disable=wildcard-import
from . import *


class Voucher(models.Model):
    store = models.ForeignKey(
        "stores.Store", on_delete=models.CASCADE, related_name="vouchers"
    )
    type = models.CharField(
        max_length=20, choices=VoucherType.CHOICES, default=VoucherType.ENTIRE_ORDER
    )
    name = models.CharField(max_length=255, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    # this field indicates if discount should be applied per order or
    # individually to every item
    apply_once_per_order = models.BooleanField(default=False)
    apply_once_per_customer = models.BooleanField(default=False)
    single_use = models.BooleanField(default=False)

    only_for_staff = models.BooleanField(default=False)

    discount_value_type = models.CharField(
        max_length=10,
        choices=DiscountValueType.CHOICES,
        default=DiscountValueType.FIXED,
    )
    discount_value = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
    )
    discount = MoneyField(amount_field="discount_value", currency_field="get_currency")
    min_spent_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        blank=True,
        null=True,
    )
    min_spent = MoneyField(
        amount_field="min_spent_amount", currency_field="get_currency"
    )
    # not mandatory fields, usage depends on type
    countries = CountryField(multiple=True, blank=True)
    min_checkout_items_quantity = models.PositiveIntegerField(null=True, blank=True)
    products = models.ManyToManyField("product.Product", blank=True)
    variants = models.ManyToManyField("product.ProductVariant", blank=True)
    collections = models.ManyToManyField("product.Collection", blank=True)

    class Meta:
        ordering = ("name", "pk")

    @property
    def code(self):
        # this function should be removed after field `code` will be deprecated
        # pylint: disable=no-member
        code_instance = self.codes.last()
        return code_instance.code if code_instance else None

    @property
    def get_currency(self):
        # pylint: disable=no-member
        return self.store.currency_code

    def get_discount(self):
        if self.discount_value_type == DiscountValueType.FIXED:
            return Money(self.discount_value, self.get_currency)


class VoucherCode(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, unique=True, default=uuid4)
    code = models.CharField(max_length=255, unique=True, db_index=True)
    used = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    voucher = models.ForeignKey(
        Voucher, related_name="codes", on_delete=models.CASCADE, db_index=False
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [BTreeIndex(fields=["voucher"], name="vouchercode_voucher_idx")]
        ordering = ("-created_at", "code")


class BaseDiscount(models.Model):
    id = models.UUIDField(primary_key=True, editable=False, unique=True, default=uuid4)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    type = models.CharField(
        max_length=64,
        choices=DiscountType.CHOICES,
        default=DiscountType.MANUAL,
    )
    value_type = models.CharField(
        max_length=10,
        choices=DiscountValueType.CHOICES,
        default=DiscountValueType.FIXED,
    )
    value = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    amount_value = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    amount = MoneyField(amount_field="amount_value", currency_field="get_currency")
    name = models.CharField(max_length=255, null=True, blank=True)
    reason = models.TextField(blank=True, null=True)
    voucher = models.ForeignKey(
        Voucher, related_name="+", blank=True, null=True, on_delete=models.SET_NULL
    )
    voucher_code = models.CharField(
        max_length=255, null=True, blank=True, db_index=False
    )
    historical_currency = models.CharField(max_length=3, blank=True)
    historical_value = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        blank=True,
        null=True,
    )

    def save(self, *args, **kwargs):
        # handle historical values
        if self.historical_value is not None:
            self.historical_currency = self.get_currency
        if not self.historical_value:
            self.historical_value = self.value
        return super().save(*args, **kwargs)

    class Meta:
        abstract = True

    @property
    def get_currency(self):
        if hasattr(self, "order"):
            return self.order.store.currency_code
        elif hasattr(self, "line"):
            return self.line.order.store.currency_code
        else:
            return None


class OrderDiscount(BaseDiscount):
    order = models.ForeignKey(
        "order.Order",
        related_name="discounts",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ("created_at",)


class OrderLineDiscount(BaseDiscount):
    line = models.ForeignKey(
        "order.OrderLine",
        related_name="discounts",
        blank=True,
        null=True,
        on_delete=models.CASCADE,
    )
    # This will ensure that we always apply a single specific discount type.
    unique_type = models.CharField(
        max_length=64, null=True, blank=True, choices=DiscountType.CHOICES
    )

    class Meta:
        ordering = ("created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=["line_id", "unique_type"],
                name="unique_orderline_discount_type",
            ),
        ]
