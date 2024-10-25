from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Todo
import json
from datetime import datetime
from django.core.serializers import serialize

@csrf_exempt
def create_todo(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            todo = Todo.objects.create(
                text=data['text'], 
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

