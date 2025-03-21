from django.db import models
from accounts.models import User
from django_countries.fields import CountryField
from phonenumber_field.modelfields import PhoneNumberField
from .utils import generate_unique_subdomain
from .enums import StorePermissions
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _
# Create your models here.

class StorePermission(models.Model):
    """
    Store Permission Model
    """
    name = models.CharField(
        max_length=255, 
        verbose_name=_('Permission Name')
    )
    codename = models.CharField(
        max_length=100, 
        verbose_name=_('Codename')
    )
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE,
        verbose_name=_('Content Type')
    )

    class Meta:
        verbose_name = _('Store Permission')
        verbose_name_plural = _('Store Permissions')
        unique_together = ['codename', 'content_type']

    def __str__(self):
        return f"{self.name} ({self.codename})"

    @classmethod
    def sync_permissions(cls):
        """
        Sync permissions with Enum
        """
        from django.apps import apps

        for perm in StorePermissions:
            app_label, action = perm.value.split('.')
            
            # Try to find the model
            try:
                model = apps.get_model('stores', app_label)
                content_type = ContentType.objects.get_for_model(model)
            except (LookupError, ValueError):
                # If the model is not found, use the Store model as default
                content_type = ContentType.objects.get_for_model(Store)

            # Create or update the permission
            cls.objects.update_or_create(
                codename=perm.codename,
                content_type=content_type,
                defaults={
                    'name': f"Can {action} {content_type.model}"
                }
            )

class StoreAddress(models.Model):
    store = models.ForeignKey(
        'Store', on_delete=models.CASCADE, related_name="billing_address")
    address1 = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = CountryField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    phone = PhoneNumberField(blank=True, null=True)
    province_code = models.CharField(max_length=10, null=True, blank=True)
    zip = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.store.primary_domain.host


class Domain(models.Model):
    host = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.host


class StaffMember(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='staff_members')
    store = models.ForeignKey(
        'Store', on_delete=models.CASCADE, related_name='staff_members')
    locale = models.CharField(max_length=50, blank=True, null=True)
    account_access = models.CharField(max_length=100, blank=True, null=True)
    is_store_owner = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    permissions = models.ManyToManyField(
        StorePermission, 
        blank=True,
        related_name='staff_members'
    )

    class Meta:
        verbose_name_plural = "Staff Members"
        unique_together = ['user', 'store']
    def has_permission(self, permission: StorePermissions):
        """
        Check permissions
        """
        # Owner has all permissions
        if self.is_store_owner:
            return True
        
        # Check permissions
        return self.permissions.filter(
            codename=permission.codename
        ).exists()
    def __str__(self):
        return str(self.user)


class Store(models.Model):
    owner = models.OneToOneField(
        StaffMember, on_delete=models.CASCADE, related_name='owned_store', null=True, blank=True)
    name = models.CharField(max_length=255, default='My Store')
    email = models.EmailField(null=True, blank=True, unique=True)
    default_domain = models.CharField(
        max_length=255, default=generate_unique_subdomain, unique=True, editable=False)
    primary_domain = models.OneToOneField(
        Domain, on_delete=models.SET_NULL, null=True, blank=True, related_name='store')
    currency_code = models.CharField(max_length=5, default='USD')
    enabled_presentment_currencies = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.primary_domain_id:
            default_domain_obj, _ = Domain.objects.get_or_create(
                host=self.default_domain
            )
            self.primary_domain = default_domain_obj
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
