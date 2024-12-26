from django.db import models
from accounts.models import User
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from .utils import generate_unique_subdomain
# Create your models here.


class StoreAddress(models.Model):
    store = models.OneToOneField(
        'Store', on_delete=models.CASCADE, related_name="billing_address")
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = CountryField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    phone = PhoneNumberField(blank=True, null=True)
    province_code = models.CharField(max_length=10, null=True, blank=True)
    zip = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.store.primary_domain.host


class Domain(models.Model):
    host = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.host


class StaffMember(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='staff_members')
    store = models.ForeignKey(
        'Store', on_delete=models.CASCADE, related_name='staff_members')
    locale = models.CharField(max_length=50, blank=True, null=True)
    account_access = models.CharField(max_length=100, blank=True, null=True)
    is_store_owner = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    permissions = models.JSONField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Staff Members"
        unique_together = ['user', 'store']

    def __str__(self):
        return str(self.user)


class Store(models.Model):
    owner = models.OneToOneField(
        StaffMember, on_delete=models.CASCADE, related_name='owned_store', null=True, blank=True)
    name = models.CharField(max_length=255, default='My Store')
    email = models.EmailField(null=True, blank=True)
    default_domain = models.CharField(
        max_length=255, default=generate_unique_subdomain, unique=True, editable=False)
    primary_domain = models.OneToOneField(
        Domain, on_delete=models.CASCADE, null=True, blank=True)
    currency_code = models.CharField(max_length=5, default='USD')
    enabled_presentment_currencies = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.primary_domain_id:
            default_domain_obj, _ = Domain.objects.get_or_create(
                host=self.default_domain
            )
            self.primary_domain = default_domain_obj
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
