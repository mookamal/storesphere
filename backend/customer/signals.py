from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Customer


@receiver(post_delete, sender=Customer)
def delete_related_objects(sender, instance, **kwargs):
    if instance.default_address:
        instance.default_address.delete()
