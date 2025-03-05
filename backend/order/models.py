from django.db import models
from core.models import ModelWithExternalReference
from uuid import uuid4
from django.utils.timezone import now
from django.conf import settings
from decimal import Decimal
from django.core.validators import MinValueValidator
from django_prices.models import MoneyField, TaxedMoneyField
from . import (
    PaymentStatus,
    FulfillmentStatus,
    ReturnStatus,
    OrderStatus,
)
# Create your models here.


class Order(ModelWithExternalReference):
    store = models.ForeignKey('stores.Store', blank=True, null=True,
                              related_name="orders", on_delete=models.SET_NULL)
    id = models.UUIDField(primary_key=True, editable=False,
                          unique=True, default=uuid4)
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(
        auto_now=True, editable=False, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=32, default=OrderStatus.OPEN, choices=OrderStatus.CHOICES
    )
    payment_status = models.CharField(
        max_length=32, default=PaymentStatus.PENDING, choices=PaymentStatus.CHOICES
    )
    fulfillment_status = models.CharField(
        max_length=32, default=FulfillmentStatus.UNFULFILLED, choices=FulfillmentStatus.CHOICES
    )
    return_status = models.CharField(
        max_length=32, blank=True, null=True, choices=ReturnStatus.CHOICES
    )
    customer = models.ForeignKey(
        'customer.Customer', blank=True, null=True, related_name="orders", on_delete=models.SET_NULL)
    billing_address = models.ForeignKey(
        "customer.Address",
        related_name="+",
        editable=False,
        null=True,
        on_delete=models.SET_NULL,
    )
    shipping_address = models.ForeignKey(
        "customer.Address",
        related_name="+",
        editable=False,
        null=True,
        on_delete=models.SET_NULL,
    )
    shipping_method = models.CharField(max_length=255, blank=True, null=True)
    currency = models.CharField(
        max_length=settings.DEFAULT_CURRENCY_CODE_LENGTH,
    )
    shipping_price_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
        editable=False,
    )
    shipping_price_net = MoneyField(
        amount_field="shipping_price_net_amount", currency_field="currency"
    )
    shipping_price_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
        editable=False,
    )
    shipping_price_gross = MoneyField(
        amount_field="shipping_price_gross_amount", currency_field="currency"
    )
    # Price with applied shipping voucher discount
    shipping_price = TaxedMoneyField(
        net_amount_field="shipping_price_net_amount",
        gross_amount_field="shipping_price_gross_amount",
        currency_field="currency",
    )
    base_shipping_price_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    # Shipping price with applied shipping voucher discount, without tax
    base_shipping_price = MoneyField(
        amount_field="base_shipping_price_amount", currency_field="currency"
    )
    undiscounted_base_shipping_price_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    # Shipping price before applying any discounts
    undiscounted_base_shipping_price = MoneyField(
        amount_field="undiscounted_base_shipping_price_amount",
        currency_field="currency",
    )
    total_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_total_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )

    total_net = MoneyField(amount_field="total_net_amount",
                           currency_field="currency")
    undiscounted_total_net = MoneyField(
        amount_field="undiscounted_total_net_amount", currency_field="currency"
    )
    total_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_total_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )

    total_gross = MoneyField(
        amount_field="total_gross_amount", currency_field="currency"
    )
    undiscounted_total_gross = MoneyField(
        amount_field="undiscounted_total_gross_amount", currency_field="currency"
    )
    total = TaxedMoneyField(
        net_amount_field="total_net_amount",
        gross_amount_field="total_gross_amount",
        currency_field="currency",
    )
    undiscounted_total = TaxedMoneyField(
        net_amount_field="undiscounted_total_net_amount",
        gross_amount_field="undiscounted_total_gross_amount",
        currency_field="currency",
    )
    total_charged_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    total_authorized_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    total_authorized = MoneyField(
        amount_field="total_authorized_amount", currency_field="currency"
    )
    total_charged = MoneyField(
        amount_field="total_charged_amount", currency_field="currency"
    )
    subtotal_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal(0),
    )
    subtotal_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal(0),
    )
    subtotal = TaxedMoneyField(
        net_amount_field="subtotal_net_amount",
        gross_amount_field="subtotal_gross_amount",
    )
    display_gross_prices = models.BooleanField(default=True)
    customer_note = models.TextField(blank=True, default="")

    def is_fully_paid(self):
        return self.total_charged >= self.total.gross

    def is_partly_paid(self):
        return self.total_charged_amount > 0

    def __repr__(self):
        return f"<Order #{self.id!r}>"

    def __str__(self):
        return f"#{self.id}"


class OrderLine(models.Model):
    id = models.UUIDField(primary_key=True, editable=False,
                          unique=True, default=uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.ForeignKey(
        Order,
        related_name="lines",
        editable=False,
        on_delete=models.CASCADE,
    )
    variant = models.ForeignKey(
        "product.ProductVariant",
        related_name="order_lines",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    product_title = models.CharField(max_length=255)
    variant_title = models.CharField(max_length=255, default="", blank=True)
    product_sku = models.CharField(max_length=255, null=True, blank=True)
    is_shipping_required = models.BooleanField()
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    quantity_fulfilled = models.IntegerField(
        validators=[MinValueValidator(0)], default=0
    )
    currency = models.CharField(
        max_length=settings.DEFAULT_CURRENCY_CODE_LENGTH,
    )
    unit_discount_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    unit_discount = MoneyField(
        amount_field="unit_discount_amount", currency_field="currency"
    )
    unit_price_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
    )
    # stores the value of the applied discount. Like 20 of %
    unit_discount_value = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    unit_price_net = MoneyField(
        amount_field="unit_price_net_amount", currency_field="currency"
    )
    unit_price_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
    )
    unit_price_gross = MoneyField(
        amount_field="unit_price_gross_amount", currency_field="currency"
    )
    unit_price = TaxedMoneyField(
        net_amount_field="unit_price_net_amount",
        gross_amount_field="unit_price_gross_amount",
        currency="get_currency",
    )
    total_price_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
    )
    total_price_net = MoneyField(
        amount_field="total_price_net_amount",
        currency_field="currency",
    )
    total_price_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
    )
    total_price_gross = MoneyField(
        amount_field="total_price_gross_amount",
        currency_field="currency",
    )
    total_price = TaxedMoneyField(
        net_amount_field="total_price_net_amount",
        gross_amount_field="total_price_gross_amount",
        currency="currency",
    )
    undiscounted_unit_price_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_unit_price_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_unit_price = TaxedMoneyField(
        net_amount_field="undiscounted_unit_price_net_amount",
        gross_amount_field="undiscounted_unit_price_gross_amount",
        currency="currency",
    )
    undiscounted_total_price_gross_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_total_price_net_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_total_price = TaxedMoneyField(
        net_amount_field="undiscounted_total_price_net_amount",
        gross_amount_field="undiscounted_total_price_gross_amount",
        currency="currency",
    )
    base_unit_price_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    base_unit_price = MoneyField(
        amount_field="base_unit_price_amount", currency_field="currency"
    )

    undiscounted_base_unit_price_amount = models.DecimalField(
        max_digits=settings.DEFAULT_MAX_DIGITS,
        decimal_places=settings.DEFAULT_DECIMAL_PLACES,
        default=Decimal("0.0"),
    )
    undiscounted_base_unit_price = MoneyField(
        amount_field="undiscounted_base_unit_price_amount", currency_field="currency"
    )

    def __str__(self):
        return f"OrderLine #{self.id} - {self.product_title}"
