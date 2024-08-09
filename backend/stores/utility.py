import string
import random

def generate_unique_subdomain():
    from .models import Store
    while True:
        subdomain = ''.join(random.choices(string.ascii_lowercase + string.digits, k=5))
        if not Store.objects.get(domain=subdomain).exists():
            return subdomain