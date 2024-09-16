from django.urls import path, include
from blog.urls import blog_router
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from project.schema import AuthenticationMiddleware

urlpatterns = [
    path('blog/', include(blog_router.urls)),
    path('accounts/', include('allauth.urls')),
    path('auth/', include('accounts.urls')),
    path('s/', include('stores.urls')),
    path('p/', include('product.urls')),
    path("graphql", csrf_exempt(GraphQLView.as_view(graphiql=True,middleware=[AuthenticationMiddleware()]))),
]


