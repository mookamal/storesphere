from django.db import models
from stores.models import Store
from django.template.defaultfilters import slugify
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError
from core.models import SEO
from django.core.exceptions import ValidationError
from django.db.models.functions import Now


class Image(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="product_images")
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Video(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="product_videos")
    youtube_url = models.URLField()


class ProductOption(models.Model):
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="options")
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class OptionValue(models.Model):
    option = models.ForeignKey(
        ProductOption, on_delete=models.CASCADE, related_name="values")
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.option.name} - {self.name}"


class ProductVariant(models.Model):
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="variants")
    price = models.DecimalField(default=0.00, max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(
        default=0.00, max_digits=10, decimal_places=2)
    selected_options = models.ManyToManyField(
        OptionValue, related_name="variants", blank=True)
    stock = models.PositiveIntegerField(default=0, help_text="Available stock")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """
        This method is used for validation before saving the model.
        """
        if self.compare_at_price != 0.00 and self.compare_at_price < self.price:
            raise ValidationError(
                "Compare at price must be greater than or equal to price.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.title} | {self.price}"


class Product(models.Model):
    STATUS = (
        ('ACTIVE', 'ACTIVE'),
        ('DRAFT', 'DRAFT'),
    )
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="products")
    title = models.CharField(max_length=255)
    description = CKEditor5Field('Description', config_name='extends')
    handle = models.CharField(max_length=255, null=True, blank=True)
    seo = models.OneToOneField(
        SEO, on_delete=models.CASCADE, related_name="product", null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default="DRAFT")
    images = models.ManyToManyField(
        Image, related_name="products", blank=True)
    collections = models.ManyToManyField(
        "Collection", related_name="products", blank=True)
    videos = models.ManyToManyField(
        Video, related_name="products", blank=True)
    first_variant = models.OneToOneField(
        'ProductVariant',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="first_variant",
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

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
        constraints = [
            models.UniqueConstraint(
                fields=['store', 'handle'], name='unique_store_handle'
            ),
        ]


class Collection(models.Model):
    store = models.ForeignKey(
        Store, on_delete=models.CASCADE, related_name="collections")
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    image = models.ForeignKey(
        Image, on_delete=models.SET_NULL, blank=True, null=True)
    handle = models.CharField(max_length=255, null=True, blank=True)
    seo = models.OneToOneField(
        SEO, on_delete=models.CASCADE, related_name="collection", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_unique_handle(self, base_handle):
        """ Helper function to generate unique handle. """
        unique_handle = base_handle
        num = 1
        while Collection.objects.filter(store=self.store, handle=unique_handle).exclude(pk=self.pk).exists():
            unique_handle = f"{base_handle}-{num}"
            num += 1
        return unique_handle

    def clean(self):
        """
        This method is used for validation before saving the model.
        """
        if not self.handle:
            base_handle = slugify(self.title)
            self.handle = self.generate_unique_handle(base_handle)
        else:
            self.handle = self.generate_unique_handle(slugify(self.handle))

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
