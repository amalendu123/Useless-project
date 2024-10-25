from rest_framework import viewsets
from rest_framework.response import Response
from .models import CalendarEvent
from .serializers import CalendarEventSerializer
from django.db.models import Q
from datetime import datetime
import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyBA-zK0b3kGlIxHgIxpIk7V184BCCgvDEw"

def setup_gemini(key1):
    """Initialize Gemini 1.5 Flash with API key."""
    genai.configure(api_key=key1)
    
    generation_config = {
        "temperature": 0.1,
        "top_p": 0.1,
        "top_k": 16,
        "max_output_tokens": 64,
    }
    
    model = genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        generation_config=generation_config,
        system_instruction="You're a helpful assistant who takes to do list inputs"
    )
    
    return model

def check_productivity(text, model):
    """Check if a todo item is productive and get response if needed."""
    analysis_prompt = f"""Task: Make the text given to other string like change the name or change the work ,etc.
                        Prompt (the prompt is provided is here): {text}
                        Rules:
                        - Respond with exactly one word: 'productive' or 'unproductive'
                        - Productive activities contribute to goals, health, or personal growth
                        - Unproductive activities waste time or hinder progress
                        Response:"""
    
    try:
        response = model.generate_content(analysis_prompt)
        is_productive = response.text.strip().lower() == 'productive'
        
        if is_productive:
            result_prompt = """Give me an interesting unproductive phrase not exceeding 10 words"""
            result_response = model.generate_content(result_prompt)
            return is_productive, result_response.text
        
        return is_productive, None
    except Exception as e:
        print(f"Error in Gemini AI analysis: {e}")
        return True, None

class CalendarEventViewSet(viewsets.ModelViewSet):
    queryset = CalendarEvent.objects.all()
    serializer_class = CalendarEventSerializer
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.gemini_model = setup_gemini(GEMINI_API_KEY)
    
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
    
    def create(self, request, *args, **kwargs):
        # Get the original title from the request
        original_title = request.data.get('title', '')
        
        # Process with Gemini
        _, gemini_text = check_productivity(original_title, self.gemini_model)
        
        # Update the request data with Gemini text if available
        if gemini_text:
            mutable_data = request.data.copy()
            mutable_data['title'] = gemini_text
            request._full_data = mutable_data
        
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        # Get the original title from the request
        original_title = request.data.get('title', '')
        
        # Process with Gemini
        _, gemini_text = check_productivity(original_title, self.gemini_model)
        
        # Update the request data with Gemini text if available
        if gemini_text:
            mutable_data = request.data.copy()
            mutable_data['title'] = gemini_text
            request._full_data = mutable_data
        
        return super().update(request, *args, **kwargs)
    
    def partial_update(self, request, *args, **kwargs):
        # Get the original title from the request
        original_title = request.data.get('title', '')
        
        # Only process with Gemini if title is being updated
        if original_title:
            _, gemini_text = check_productivity(original_title, self.gemini_model)
            
            # Update the request data with Gemini text if available
            if gemini_text:
                mutable_data = request.data.copy()
                mutable_data['title'] = gemini_text
                request._full_data = mutable_data
        
        return super().partial_update(request, *args, **kwargs)