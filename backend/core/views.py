from rest_framework import viewsets
from .models import Info
from .serializer import InfoSerializer

class InfoViewSet(viewsets.ModelViewSet):
    queryset = Info.objects.all()
    serializer_class = InfoSerializer