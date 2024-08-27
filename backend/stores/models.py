from django.db import models
from accounts.models import StoreOwner
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
        return self.store.domain


class Store(models.Model):
    owner = models.ForeignKey(StoreOwner, on_delete=models.CASCADE,related_name='stores')
    name = models.CharField(max_length=255,default='My Store')
    email = models.EmailField(blank=True, null=True)
    default_domain = models.CharField(max_length=255,blank=True, null=True,unique=True)
    billing_address = models.OneToOneField(StoreAddress, on_delete=models.SET_NULL, null=True, related_name='store')


    def save(self, *args, **kwargs):
        if not self.default_domain:
            self.default_domain = generate_unique_subdomain()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name