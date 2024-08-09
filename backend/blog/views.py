from rest_framework import viewsets
from .models import Post,Category
from .serializer import PostListSerializer,PostDetailSerializer,CategoryListSerializer,CategoryDetailSerializer
from rest_framework.response import Response

class PostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.filter(is_published=True).order_by('published_date')
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        if self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategoryListSerializer