from rest_framework import serializers
from .models import User , StoreOwner
from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress
from dj_rest_auth.registration.serializers import RegisterSerializer

class CustomRegisterSerializer(RegisterSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, required=True)

    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'email': self.validated_data.get('email', ''),
            'role': self.validated_data.get('role', ''),
        }

class StoreOwnerSerializer(serializers.ModelSerializer):
    user = CustomRegisterSerializer()

    class Meta:
        model = StoreOwner
        fields = '__all__'
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomRegisterSerializer().create(user_data)
        store_owner = StoreOwner.objects.create(user=user, **validated_data)
        return store_owner