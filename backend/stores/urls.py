from django.urls import path
from . import views

urlpatterns = [
    path('stores/', views.StoreListView.as_view(), name='store-list'),
    path('stores/detail/<str:domain>/', views.StoreDetailView.as_view(), name='store-detail'),
    path('stores/create/', views.StoreCreateView.as_view(), name='store-create'),
    path('stores/first-store/', views.FirstStoreDetailView.as_view(), name='first-store'),
]
