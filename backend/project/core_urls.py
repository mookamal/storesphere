from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from core.views import custom_upload_file
urlpatterns = [
    path("ckeditor5/", include('django_ckeditor_5.urls')),
    path('upload/', custom_upload_file, name='custom_upload_file'),
    path('', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

