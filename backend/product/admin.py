from django.contrib import admin
from . import models


@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Video)
class VideoAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    pass


@admin.register(models.ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    pass


@admin.register(models.ProductOption)
class ProductOptionAdmin(admin.ModelAdmin):
    pass


@admin.register(models.OptionValue)
class OptionValueAdmin(admin.ModelAdmin):
    pass
