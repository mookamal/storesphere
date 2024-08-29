from rest_framework.views import APIView
from rest_framework import permissions,generics
from rest_framework.response import Response
from .models import Store , StaffMember
from .serializer import StoreSerializer
from django.shortcuts import get_object_or_404

class StoreListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        stores = Store.objects.filter(staff_members__user=request.user)
        if stores.exists():
            serializer = StoreSerializer(stores, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'No stores found.'}, status=404)

class StoreDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request, domain):
        try:
            store = get_object_or_404(Store , default_domain=domain)
            serializer = StoreSerializer(store)
            if StaffMember.objects.filter(store=store,user=request.user).exists():
                return Response(serializer.data)
            else:
                return Response({'message': 'Unauthorized.'}, status=403)
        except Store.DoesNotExist:
            return Response({'message': 'Store not found.'}, status=404)
    
class FirstStoreDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        try:
            first_store = Store.objects.filter(staff_members__user=request.user).first()
            serializer = StoreSerializer(first_store)
            return Response(serializer.data)
        except Store.DoesNotExist:
            return Response({'message': 'No stores found.'}, status=404)

class StoreCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def perform_create(self, serializer):
        user = self.request.user
        store = serializer.save()
        owner = StaffMember.objects.create(user=user,store=store,is_store_owner=True)
        store.owner = owner
        store.save()