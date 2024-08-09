from rest_framework.views import APIView
from rest_framework import authentication, permissions
from rest_framework.response import Response
from .models import Store
from .serializer import StoreSerializer

class StoreListView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        stores = Store.objects.filter(owner=request.user)
        if stores.exists():
            serializer = StoreSerializer(stores, many=True)
            return Response(serializer.data)
        else:
            return Response({'message': 'No stores found.'}, status=404)