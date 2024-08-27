from django.db import models
from accounts.models import User
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from .utility import generate_unique_subdomain
# Create your models here.

class StoreAddress(models.Model):
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country_code_v2 = CountryField(blank=True, null=True)
    company = models.CharField(max_length=255,blank=True, null=True)
    phone = PhoneNumberField(blank=True, null=True)
    province_code = models.CharField(max_length=10, null=True, blank=True)
    zip = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.store.primary_domain.host

class Domain(models.Model):
    host = models.CharField(max_length=255,blank=True, null=True,unique=True)

    def __str__(self):
        return self.host

class StaffMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='staff_members')
    store = models.ForeignKey('Store', on_delete=models.CASCADE, related_name='staff_members')
    locale = models.CharField(max_length=50)
    account_access = models.CharField(max_length=100)
    is_store_owner = models.BooleanField()
    name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    email = models.EmailField()
    permissions = models.JSONField()

    class Meta:
        verbose_name_plural = "Staff Members"
        unique_together = ['user','store']

    def __str__(self):
        return self.name

class Store(models.Model):
    owner = models.OneToOneField(StaffMember,blank=True, null=True, on_delete=models.CASCADE,related_name='owned_store')
    name = models.CharField(max_length=255,default='My Store')
    email = models.EmailField(blank=True, null=True)
    default_domain = models.CharField(max_length=255,blank=True, null=True,unique=True)
    primary_domain = models.OneToOneField(Domain, on_delete=models.CASCADE,blank=True, null=True)
    billing_address = models.OneToOneField(StoreAddress, on_delete=models.CASCADE,blank=True, null=True, related_name='store')


    def save(self, *args, **kwargs):
        if not self.default_domain:
            self.default_domain = generate_unique_subdomain()
            if not self.primary_domain:
                self.primary_domain = Domain.objects.create(host=self.default_domain)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name