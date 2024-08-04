from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.views import LoginView,LogoutView
from .views import GoogleLogin
from dj_rest_auth.registration.views import (
    ResendEmailVerificationView,
    VerifyEmailView,
)
from dj_rest_auth.views import (
    PasswordResetConfirmView,
    PasswordResetView,
)
from .views import email_confirm_redirect, password_reset_confirm_redirect


urlpatterns = [
    path("register/", include("dj_rest_auth.registration.urls"), name="rest_register"),
    path('login/', LoginView.as_view(), name='rest_login'),
    path("logout/", LogoutView.as_view(), name="rest_logout"), 
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),

    path("register/verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path("register/resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"),
    path("account-confirm-email/<str:key>/", email_confirm_redirect, name="account_confirm_email"),
 
    path("password/reset/", PasswordResetView.as_view(), name="rest_password_reset"),
    path("password/reset/confirm/<str:uidb64>/<str:token>/",password_reset_confirm_redirect,name="password_reset_confirm",),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    path("google/", GoogleLogin.as_view(), name="google_login"),

]