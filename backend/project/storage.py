import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

class CustomStorage(FileSystemStorage):
    """
    Custom storage for storing CKEditor5 files in a specific folder.
    """
    def __init__(self, *args, **kwargs):
        kwargs['location'] = os.path.join(settings.MEDIA_ROOT, 'ckeditor5')
        kwargs['base_url'] = os.path.join(settings.MEDIA_URL, 'ckeditor5/')
        super().__init__(*args, **kwargs)

custom_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, 'uploads'),base_url=os.path.join(settings.MEDIA_URL, 'uploads/'))

@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        if 'upload' in request.FILES:
            image = request.FILES['upload']
            filename = custom_storage.save(image.name, image)
            file_url = custom_storage.url(filename)
            print("file_url",file_url)
            return JsonResponse({'url': file_url})
        return JsonResponse({'error': 'No file uploaded'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
