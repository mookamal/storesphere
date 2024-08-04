from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.template.defaultfilters import slugify
from django_ckeditor_5.fields import CKEditor5Field

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(default='assets/images/blog.jpg',upload_to='blog/categories/%y/%m/%d')
    slug = models.CharField(max_length=200 , blank=True, null=True,unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    def __str__(self):
        return self.name

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    image = models.ImageField(default='assets/images/blog.jpg',upload_to='blog/posts/%y/%m/%d')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    content = CKEditor5Field('Content', config_name='extends')
    category = models.ForeignKey(Category, related_name="posts", on_delete=models.SET_NULL, null=True, blank=True)
    created_date = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(blank=True, null=True)
    slug = models.CharField(max_length=200 , blank=True, null=True,unique=True)

    def save(self, *args, **kwargs):
        if self.is_published:
            self.published_date = timezone.now()
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    
    def __str__(self):
        return self.title