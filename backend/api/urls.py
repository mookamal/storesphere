from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import InfoViewSet
from blog.views import PostViewSet,CategoryViewSet
router = DefaultRouter()

router.register(r'info', InfoViewSet)
router.register(r'blog/posts', PostViewSet)
router.register(r'blog/categories', CategoryViewSet)


urlpatterns = [
    path('', include(router.urls)),
]