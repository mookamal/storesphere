from django.db import models
from core.models import ModelWithExternalReference
from uuid import uuid4
from django.utils.timezone import now
from django.conf import settings
from . import (
    PaymentStatus,
    FulfillmentStatus,
    ReturnStatus,
    OrderStatus,
)
# Create your models here.


# class Order(ModelWithExternalReference):
#     store = models.ForeignKey('stores.Store', blank=True, null=True,
#                               related_name="orders", on_delete=models.SET_NULL)
#     id = models.UUIDField(primary_key=True, editable=False,
#                           unique=True, default=uuid4)
#     created_at = models.DateTimeField(default=now, editable=False)
#     updated_at = models.DateTimeField(
#         auto_now=True, editable=False, db_index=True)
#     status = models.CharField(
#         max_length=32, default=OrderStatus.OPEN, choices=OrderStatus.CHOICES
#     )
#     payment_status = models.CharField(
#         max_length=32, default=PaymentStatus.PENDING, choices=PaymentStatus.CHOICES
#     )
#     fulfillment_status = models.CharField(
#         max_length=32, default=FulfillmentStatus.UNFULFILLED, choices=FulfillmentStatus.CHOICES
#     )
#     return_status = models.CharField(
#         max_length=32, blank=True, null=True, choices=ReturnStatus.CHOICES
#     )
#     customer = models.ForeignKey(
#         'customer.Customer', blank=True, null=True, related_name="orders", on_delete=models.SET_NULL)
#     billing_address = models.ForeignKey(
#         "customer.MailingAddress",
#         related_name="+",
#         editable=False,
#         null=True,
#         on_delete=models.SET_NULL,
#     )
#     currency = models.CharField(
#         max_length=settings.DEFAULT_CURRENCY_CODE_LENGTH,
#     )
