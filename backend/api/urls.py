from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from core.views import InfoViewSet
from blog.views import PostViewSet,CategoryViewSet
router = DefaultRouter()

# router.register(r'info', InfoViewSet)
router.register(r'blog/posts', PostViewSet)
router.register(r'blog/categories', CategoryViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('accounts/', include('allauth.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
]