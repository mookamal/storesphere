from rest_framework.routers import DefaultRouter
from .views import PostViewSet,CategoryViewSet

blog_router = DefaultRouter()
blog_router.register(r'posts', PostViewSet, basename='post')
blog_router.register(r'categories', CategoryViewSet, basename='category')