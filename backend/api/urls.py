from django.urls import path, include
from blog.urls import blog_router

urlpatterns = [
    path('blog/', include(blog_router.urls)),
    path('accounts/', include('allauth.urls')),
    path('auth/', include('accounts.urls')),
]


