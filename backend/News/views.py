from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .models import MovieNews
from .serializers import MovieNewsSerializer
from .utils import setup_gemini, generate_fake_news, get_image_from_google

class MovieNewsViewSet(viewsets.ModelViewSet):
    queryset = MovieNews.objects.all()
    serializer_class = MovieNewsSerializer

@api_view(['POST'])
def generate_news(request):
    try:
        # Get number of news items from request or use default
        number_of_news = request.data.get('number_of_news', 20)
        
        # Setup Gemini model
        model = setup_gemini("AIzaSyBA-zK0b3kGlIxHgIxpIk7V184BCCgvDEw")
        
        # Generate fake news
        news_items = generate_fake_news(model, number_of_news)
        
        # Process each news item
        created_items = []
        for news_item in news_items:
            title = news_item.get('title', '')
            search_terms = ' '.join(title.split()[:4])
            
            # Get image URL
            image_url = get_image_from_google(
                "AIzaSyBA-zK0b3kGlIxHgIxpIk7V184BCCgvDEw",
                "138497bc0eae049a5",
                search_terms
            )
            
            # Create MovieNews object
            movie_news = MovieNews.objects.create(
                title=title,
                content=news_item.get('content', ''),
                image_url=image_url
            )
            
            created_items.append(MovieNewsSerializer(movie_news).data)
        
        return Response({
            'status': 'success',
            'message': f'Generated {len(created_items)} news items',
            'data': created_items
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)