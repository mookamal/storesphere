from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.views import LoginView,LogoutView
from accounts.views import ResendConfirmationEmail
# from core.views import InfoViewSet
from blog.views import PostViewSet,CategoryViewSet
router = DefaultRouter()

# router.register(r'info', InfoViewSet)
router.register(r'blog/posts', PostViewSet)
router.register(r'blog/categories', CategoryViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('accounts/', include('allauth.urls')),
    path("auth/register/", include("dj_rest_auth.registration.urls"), name="rest_register"),
    path('auth/login/', LoginView.as_view(), name='rest_login'),
    path("auth/logout/", LogoutView.as_view(), name="rest_logout"), 
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("auth/token/refresh/", get_refresh_view().as_view(), name="token_refresh"),
    path('auth/resend-confirmation/', ResendConfirmationEmail.as_view(), name='resend-confirmation-email'),

]