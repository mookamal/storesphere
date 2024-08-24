from django.db import models
from accounts.models import StoreOwner
from django_countries.fields import CountryField
from simple_history.models import HistoricalRecords
from phonenumber_field.modelfields import PhoneNumberField
from .utility import generate_unique_subdomain
# Create your models here.

class Store(models.Model):
    owner = models.ForeignKey(StoreOwner, on_delete=models.CASCADE,related_name='stores')
    name = models.CharField(max_length=255,default='My Store')
    email = models.EmailField(blank=True, null=True)
    domain = models.CharField(max_length=255,blank=True, null=True,unique=True)

    def save(self, *args, **kwargs):
        if not self.domain:
            self.domain = generate_unique_subdomain()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class StoreAddress(models.Model):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='addresses')
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country_code_v2 = models.CharField(max_length=10,blank=True, null=True)
    company = models.CharField(max_length=255,blank=True, null=True)
    phone = PhoneNumberField(blank=True, null=True)
    province_code = models.CharField(max_length=10, null=True, blank=True)
    zip = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.store.domain