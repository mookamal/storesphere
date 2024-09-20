from django.db import models
from stores.models import Store
from django.template.defaultfilters import slugify
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError
from core.models import SEO

class Image(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="product_images")
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True,null=True, blank=True)

class Video(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="product_videos")
    youtube_url = models.URLField()


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
    images = models.ManyToManyField(Image, related_name="products")
    videos = models.ManyToManyField(Video, related_name="products")

    def generate_unique_handle(self, base_handle):
        """ Helper function to generate unique handle. """
        unique_handle = base_handle
        num = 1
        while Product.objects.filter(store=self.store, handle=unique_handle).exclude(pk=self.pk).exists():
            unique_handle = f"{base_handle}-{num}"
            num += 1
        return unique_handle

    def clean(self):
        """
        This method is used for validation before saving the model.
        It ensures the 'handle' is unique within the same store.
        """
        if not self.handle:
            base_handle = slugify(self.title)
            self.handle = self.generate_unique_handle(base_handle)
        else:
            self.handle = self.generate_unique_handle(slugify(self.handle))

    def save(self, *args, **kwargs):
        self.clean()
        try:
            super().save(*args, **kwargs)
        except ValidationError as e:
            raise ValidationError(f"Error saving product: {e}")

    def __str__(self):
        return f"Store {self.store.default_domain} | {self.title}"

    class Meta:
        unique_together = ["handle", "store"]
