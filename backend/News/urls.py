from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieNewsViewSet, generate_news

router = DefaultRouter()
router.register(r'news', MovieNewsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('generate/', generate_news, name='generate-news'),
]