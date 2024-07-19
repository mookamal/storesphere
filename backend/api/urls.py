from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import InfoViewSet

router = DefaultRouter()
router.register(r'info', InfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]