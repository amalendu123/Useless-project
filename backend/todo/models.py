from django.db import models

class Todo(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=50)  
    date = models.DateField() 
    completed = models.BooleanField(default=False) 
    
    def __str__(self):
        return self.text  

    class Meta:
        verbose_name = 'Todo'
        verbose_name_plural = 'Todos'