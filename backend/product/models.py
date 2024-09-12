from django.db import models
from stores.models import Store
from django.template.defaultfilters import slugify
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError
from core.models import SEO

class Product(models.Model):
    STATUS = (
        ('ACTIVE', 'ACTIVE'),
        ('DRAFT', 'DRAFT'),
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="products")
    title = models.CharField(max_length=255)
    description = CKEditor5Field('Description', config_name='extends')
    handle = models.CharField(max_length=255, null=True, blank=True)
    seo = models.OneToOneField(SEO, on_delete=models.CASCADE, related_name="product", null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default="DRAFT")
    media_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.handle:
            base_handle = slugify(self.title)
            unique_handle = base_handle
            num = 1
            while Product.objects.filter(store=self.store, handle=unique_handle).exists():
                unique_handle = f"{base_handle}-{num}"
                num += 1
            self.handle = unique_handle
        try:
            super().save(*args, **kwargs)
        except ValidationError as e:
            raise ValidationError(f"Error saving product: {e}")

    def __str__(self):
        return f"Store {self.store.default_domain} | {self.title}"

    class Meta:
        unique_together = ["handle", "store"]
