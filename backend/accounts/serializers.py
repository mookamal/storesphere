from rest_framework import serializers
from .models import User , StoreOwner
from dj_rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import complete_signup
from allauth.account import app_settings as allauth_account_settings

class CustomRegisterSerializer(RegisterSerializer):
    def get_cleaned_data(self):
        super(CustomRegisterSerializer, self).get_cleaned_data()
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'password2': self.validated_data.get('password2', ''),
            'email': self.validated_data.get('email', ''),
        }
    
class StoreOwnerSerializer(serializers.ModelSerializer):
    user = CustomRegisterSerializer()

    class Meta:
        model = StoreOwner
        fields = '__all__'
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_serializer = CustomRegisterSerializer(data=user_data, context=self.context)

        if user_serializer.is_valid():
            user = user_serializer.save(request=self.context.get('request'))
        else:
            raise serializers.ValidationError(user_serializer.errors)

        store_owner = StoreOwner.objects.create(user=user, **validated_data)

        # Call complete_signup after creating the user
        if allauth_account_settings.EMAIL_VERIFICATION != 'none':  # Check email verification settings
            request = self.context.get('request')
            if request:
                complete_signup(
                    request._request, user,
                    allauth_account_settings.EMAIL_VERIFICATION,
                    None,
                )

        return store_owner