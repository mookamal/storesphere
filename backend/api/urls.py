from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.views import LoginView,LogoutView
from dj_rest_auth.registration.views import (
    ResendEmailVerificationView,
    VerifyEmailView,
)
from dj_rest_auth.views import (
    PasswordResetConfirmView,
    PasswordResetView,
)
from accounts.views import email_confirm_redirect, password_reset_confirm_redirect
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

    path("auth/register/verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path("auth/register/resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"),
    path("auth/account-confirm-email/<str:key>/", email_confirm_redirect, name="account_confirm_email"),
 
    path("auth/password/reset/", PasswordResetView.as_view(), name="rest_password_reset"),
    path("auth/password/reset/confirm/<str:uidb64>/<str:token>/",password_reset_confirm_redirect,name="password_reset_confirm",),
    path("auth/password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
]


