from rest_framework import serializers
from .models import MovieNews

class MovieNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieNews
        fields = ['id', 'title', 'content', 'image_url', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']