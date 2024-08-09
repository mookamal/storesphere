from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
# Create your models here.

class Store(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    domain = models.CharField(max_length=255, unique=True)
    country = CountryField()
