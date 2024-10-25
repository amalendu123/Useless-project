from rest_framework import viewsets
from rest_framework.response import Response
from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from django.db.models import Q
from datetime import datetime

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer

    def get_queryset(self):
        queryset = CalendarEvent.objects.all()
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if month and year:
            queryset = queryset.filter(
                date__year=year,
                date__month=month
            )
        return queryset