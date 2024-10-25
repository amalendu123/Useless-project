from django.db import models
from django.utils import timezone

class MovieNews(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Movie News'

    def __str__(self):
        return self.title