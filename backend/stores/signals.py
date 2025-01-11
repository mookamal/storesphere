from django.db.models.signals import post_save,post_migrate
from django.dispatch import receiver
from .models import Store, StoreAddress, StaffMember, StorePermission


@receiver(post_save, sender=Store)
def set_default_store_address(sender, instance, created, **kwargs):
    if created:
        StoreAddress.objects.create(country="EG", store=instance)


@receiver(post_save, sender=StaffMember)
def assign_owner_to_store(sender, instance, created, **kwargs):
    if created:
        store = instance.store
        if store and store.owner is None:
            store.owner = instance
            store.save()

@receiver(post_migrate)
def create_permissions(sender, **kwargs):
    """
    Automatically create permissions after migration
    """
    from django.apps import apps
    
    # Ensure migration is for stores app
    if sender.name == 'stores':
        StorePermission.sync_permissions()