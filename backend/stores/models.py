from django.db import models
from accounts.models import User
from django_countries.fields import CountryField
from simple_history.models import HistoricalRecords
from phonenumber_field.modelfields import PhoneNumberField
from .utility import generate_unique_subdomain
# Create your models here.

class Store(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE,related_name='stores')
    name = models.CharField(max_length=255,default='My Store')
    phone = PhoneNumberField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    domain = models.CharField(max_length=255,blank=True, null=True,unique=True)

    def save(self, *args, **kwargs):
        if not self.domain:
            self.domain = generate_unique_subdomain()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name