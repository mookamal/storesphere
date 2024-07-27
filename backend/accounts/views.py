# views.py
from allauth.account.utils import send_email_confirmation
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class ResendConfirmationEmail(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email address is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(User, email=email)
        if user.emailaddress_set.filter(email=email, verified=False).exists():
            site = get_current_site(request)
            send_email_confirmation(request, user)
            return Response({"message": "Confirmation email sent."}, status=status.HTTP_200_OK)
        
        return Response({"message": "User not found or email already verified."}, status=status.HTTP_400_BAD_REQUEST)
