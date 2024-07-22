from rest_framework import serializers
from .models import Post,Category

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name','slug', )

class CategoryDetailSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ('name', 'description', 'posts','slug')
    
    def get_posts(self,obj):
        posts = obj.posts.filter(is_published=True)
        return PostListSerializer(posts,many=True).data
    
class PostDetailSerializer(serializers.ModelSerializer):
    category = CategoryListSerializer()
    class Meta:
        model = Post
        fields = ('image', 'title', 'description','content', 'published_date', 'slug', 'category')

class PostListSerializer(serializers.ModelSerializer):
    category = CategoryListSerializer()
    class Meta:
        model = Post
        fields = ('image','title', 'published_date', 'category','slug', )