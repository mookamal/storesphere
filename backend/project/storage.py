import os
from django.conf import settings
from django.core.files.storage import FileSystemStorage

class CustomStorage(FileSystemStorage):
    """
    Custom storage for storing CKEditor5 files in a specific folder.
    """
    def __init__(self, *args, **kwargs):
        kwargs['location'] = os.path.join(settings.MEDIA_ROOT, 'ckeditor5')
        kwargs['base_url'] = os.path.join(settings.MEDIA_URL, 'ckeditor5/')
        super().__init__(*args, **kwargs)