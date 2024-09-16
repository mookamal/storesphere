from django.http import HttpResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

def jwt_authentication_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        try:
            user, token = JWTAuthentication().authenticate(request)
            if not user or not user.is_authenticated:
                return HttpResponse("Authentication credentials were not provided or are invalid.", status=401)
        except Exception as e:
            return HttpResponse(f"Authentication failed: {str(e)}", status=401)
        
        request.user = user
        return view_func(request, *args, **kwargs)
    
    return _wrapped_view