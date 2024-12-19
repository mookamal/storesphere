from django.db import models
from stores.models import Store
from customer.models import Customer
# Create your models here.


class OrderStatus(models.Model):
    ORDER_STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('ARCHIVED', 'Archived'),
        ('CANCELED', 'Canceled'),
    ]
    status = models.CharField(
        max_length=20, choices=ORDER_STATUS_CHOICES, default='OPEN')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.status


class PaymentStatus(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('AUTHORIZED', 'Authorized'),
        ('DUE', 'Due'),
        ('EXPIRING', 'Expiring'),
        ('EXPIRED', 'Expired'),
        ('PAID', 'Paid'),
        ('REFUNDED', 'Refunded'),
        ('PARTIALLY_REFUNDED', 'Partially refunded'),
        ('PARTIALLY_PAID', 'Partially paid'),
        ('VOIDED', 'Voided'),
        ('UNPAID', 'Unpaid'),
    ]
    status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='PENDING')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.status


class FulfillmentStatus(models.Model):
    FULFILLMENT_STATUS_CHOICES = [
        ('FULFILLED', 'Fulfilled'),
        ('UNFULFILLED', 'Unfulfilled'),
        ('PARTIALLY_FULFILLED', 'Partially fulfilled'),
        ('SCHEDULED', 'Scheduled'),
        ('ON_HOLD', 'On hold'),
    ]

    status = models.CharField(
        max_length=20, choices=FULFILLMENT_STATUS_CHOICES, default='UNFULFILLED')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.status


class ReturnStatus(models.Model):
    RETURN_STATUS_CHOICES = [
        ('RETURN_REQUESTED', 'Return requested'),
        ('RETURN_IN_PROGRESS', 'Return in progress'),
        ('RETURNED', 'Returned'),
        ('INSPECTION_COMPLETE', 'Inspection complete'),
    ]
    status = models.CharField(
        max_length=20, choices=RETURN_STATUS_CHOICES, default='RETURN_REQUESTED')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.status


class Order(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="orders")
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=False, blank=False)
    status = models.ForeignKey(
        OrderStatus, on_delete=models.CASCADE, related_name="orders")
    payment_status = models.ForeignKey(
        PaymentStatus, on_delete=models.CASCADE, related_name="orders")
    fulfillment_status = models.ForeignKey(
        FulfillmentStatus, on_delete=models.CASCADE, related_name="orders")
    return_status = models.ForeignKey(
        ReturnStatus, on_delete=models.CASCADE, related_name="orders", null=True, blank=True)
