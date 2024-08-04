from django.db import models
from django.contrib.auth.models import User
from django_ckeditor_5.fields import CKEditor5Field
# Create your models here.

class Store(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name="store")
    name = models.CharField(max_length=100)
    domain = models.CharField(max_length=255, unique=True)
    description = CKEditor5Field('Content', config_name='extends', blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()

    def __str__(self):
        return self.name