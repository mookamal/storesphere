from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Store , StoreAddress

@receiver(post_save, sender=Store)
def set_default_store_address(sender, instance,created, **kwargs):
    if created:
        address = StoreAddress.objects.create(country_code_v2="EG")
        instance.billing_address = address
        instance.save()