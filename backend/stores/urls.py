from django.urls import path
from .views import StoreListView , StoreDetailView

urlpatterns = [
    path('stores/', StoreListView.as_view(), name='store-list'),
    path('stores/<str:domain>/', StoreDetailView.as_view(), name='store-detail'),
]
