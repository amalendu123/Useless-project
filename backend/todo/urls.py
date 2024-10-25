from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_todo, name='create_todo'),
    path('delete/<int:todo_id>/', views.delete_todo, name='delete_todo'),
    path('', views.get_all_todos, name='get_all_todos'),
]