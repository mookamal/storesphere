from rest_framework.views import APIView
from rest_framework import authentication, permissions , status , generics
from rest_framework.response import Response
from .models import Store
from .serializer import StoreSerializer
from django.shortcuts import get_object_or_404

class StoreListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        stores = Store.objects.filter(owner=request.user)
        if stores.exists():
            serializer = StoreSerializer(stores, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'No stores found.'}, status=404)

class StoreDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, domain):
        try:
            store = get_object_or_404(Store , domain=domain)
            serializer = StoreSerializer(store)
            return Response(serializer.data)
        except Store.DoesNotExist:
            return Response({'message': 'Store not found.'}, status=404)
    

class StoreCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)