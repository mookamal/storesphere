from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.


class User(AbstractUser):
    ROLE_CHOICES = (
        ('store_owner', 'store_owner'),
        ('customer', 'customer'),
        ('platform_admin', 'Platform Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES,default='customer')