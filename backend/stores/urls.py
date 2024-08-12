from django.urls import path
from .views import StoreListView , StoreDetailView , StoreCreateView

urlpatterns = [
    path('stores/', StoreListView.as_view(), name='store-list'),
    path('stores/detail/<str:domain>/', StoreDetailView.as_view(), name='store-detail'),
    path('stores/create/', StoreCreateView.as_view(), name='store-create'),
]
