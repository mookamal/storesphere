from rest_framework import viewsets
from .models import Info
from .serializer import InfoSerializer

class InfoViewSet(viewsets.ModelViewSet):
    queryset = Info.objects.all()
    serializer_class = InfoSerializer



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import os

@csrf_exempt
def custom_upload_file(request):
    if request.method == 'POST' and request.FILES.get('upload'):
        print("request", request)
        file = request.FILES['upload']
        subfolder = 'blog/posts/%y/%m/%d'
        file_name = default_storage.save(os.path.join(subfolder, file.name), file)
        file_url = default_storage.url(file_name)
        return JsonResponse({'url': file_url})
    return JsonResponse({'error': 'Invalid request'}, status=400)
