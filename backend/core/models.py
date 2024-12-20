from django.db import models

# Create your models here.


class Info(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    desc = models.TextField()
    logo = models.ImageField(upload_to='logo', default='logo.png')
    # social media links
    facebook = models.URLField(max_length=200, null=True, blank=True)
    instagram = models.URLField(max_length=200, null=True, blank=True)
    twitter = models.URLField(max_length=200, null=True, blank=True)
    linkedin = models.URLField(max_length=200, null=True, blank=True)
    pinterest = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name


class SEO(models.Model):
    title = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title


class ModelWithExternalReference(models.Model):
    external_reference = models.CharField(
        max_length=250,
        unique=True,
        blank=True,
        null=True,
        db_index=True,
    )

    class Meta:
        abstract = True
