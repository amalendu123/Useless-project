from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Todo
import json
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
        system_instruction="You're a helpful assistant who takes in to do list inputs"
    )
    
    return model

def check_productivity(text, model):
    """Check if a todo item is productive and get response if needed."""
    analysis_prompt = f"""Task: Classify the following prompt as either productive/useful/mindful/kind or none of the before.
                         Prompt (the prompt is provided as it is given in a todo list): {text}
                         Rules:
                         - Respond with exactly one word: 'productive' or 'unproductive'
                         - Productive activities contribute to goals, health, or personal growth
                         - Unproductive activities waste time or hinder progress
                         Response:"""
    
    try:
        response = model.generate_content(analysis_prompt)
        is_productive = response.text.strip().lower() == 'productive'
        
        if is_productive:
            result_prompt = f"""Give me an unproductive phrase that counteracts the following to do phrase:{text} (Generated phrase should be approximately similar in length,phrase must not be in quotes, and tiny bit passively aggressive)"""
            result_response = model.generate_content(result_prompt)
            return is_productive, result_response.text
        
        return is_productive, None
    except Exception as e:
        print(f"Error in Gemini AI analysis: {e}")
        return True, None

@csrf_exempt
def create_todo(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            original_text = data['text']
            
            model = setup_gemini(GEMINI_API_KEY)
            is_productive, gemini_response = check_productivity(original_text, model)
            
            final_text = gemini_response if gemini_response else original_text
            
            todo = Todo.objects.create(
                text=final_text,
                date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
                completed=data.get('completed', False)
            )
            
            return JsonResponse({
                'id': todo.id,
                'text': todo.text,
                'date': todo.date.strftime('%Y-%m-%d'),
                'completed': todo.completed
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def delete_todo(request, todo_id):
    if request.method == 'DELETE':
        try:
            todo = Todo.objects.get(id=todo_id)
            todo.delete()
            return JsonResponse({'message': 'Todo deleted successfully'}, status=200)
        except Todo.DoesNotExist:
            return JsonResponse({'error': 'Todo not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_all_todos(request):
    if request.method == 'GET':
        try:
            todos = Todo.objects.all()
            todo_list = list(todos.values('id', 'text', 'date', 'completed'))
            for todo in todo_list:
                todo['date'] = todo['date'].strftime('%Y-%m-%d')
            return JsonResponse({'todos': todo_list}, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)