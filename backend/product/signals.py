from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Product, Collection


@receiver(post_delete, sender=Product)
def delete_seo_related_to_product(sender, instance, **kwargs):
    if instance.seo:
        instance.seo.delete()


@receiver(post_delete, sender=Collection)
def delete_seo_related_to_collection(sender, instance, **kwargs):
    if instance.seo:
        instance.seo.delete()
