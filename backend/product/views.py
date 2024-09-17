from .models import Image
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from stores.models import Store,StaffMember
from project.decorators import jwt_authentication_required
# Create your views here.

@csrf_exempt
@jwt_authentication_required
def image_upload(request):
    if request.method == 'POST':
        user = request.user
        image = request.FILES['file']
        domain = request.POST.get('domain')
        store = Store.objects.get(default_domain=domain)
        if StaffMember.objects.filter(user=user, store=store).exists():
            image_obj = Image(image=image, store=store)
            image_obj.save()
            data = {
                'id': str(image_obj.id),
                'image':image_obj.image.url,
            }
            return JsonResponse(data, status=200)
        else:
            return HttpResponse('You are not authorized to access this store.', status=403)
    return HttpResponse('Invalid request method', status=400)