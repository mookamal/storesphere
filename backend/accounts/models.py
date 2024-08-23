from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
# Create your models here.


class User(AbstractUser):
    pass

class StoreOwner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store_owner')
    phone = PhoneNumberField(blank=True, null=True)
    
    def __str__(self):
        return self.user.username