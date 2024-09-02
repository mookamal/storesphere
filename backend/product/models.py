from django.db import models
from stores.models import Store
from django.template.defaultfilters import slugify
from django_ckeditor_5.fields import CKEditor5Field
# Create your models here.

class Product(models.Model):
    STATUS = (
        ('ACTIVE', 'Active'),
        ('DRAFT', 'Draft'),
    )
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = CKEditor5Field('Description', config_name='extends')
    handle = models.CharField(max_length=255,null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS , default="DRAFT")
    media_count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        if not self.handle:
            self.handle = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Store {self.store.default_domain} | {self.title}"