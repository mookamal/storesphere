from django.shortcuts import render
from .models import Image
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def image_upload(request):
    if request.method == 'POST':
        image = request.FILES['image']
        new_image = Image(image=image)
        new_image.save()
        return HttpResponse('Image uploaded successfully')
    return HttpResponse('Invalid request method', status=400)