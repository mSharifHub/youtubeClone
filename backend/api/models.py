from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    google_sub = models.CharField(max_length=500, primary_key=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    youtube_handler = models.TextField(null=False, blank=False, unique=True)
    bio = models.TextField(max_length=500, blank=True)
    subscribers = models.ManyToManyField('self', symmetrical=False, related_name='subscribed_to', blank=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username



class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        snippet = (self.content[:50] + '..') if len(self.content) > 30 else self.content
        return f"Post {self.pk}  by {self.author.username}: {snippet}"


class PostImage(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='post_images/')

    def __str__(self):
        return f"{self.pk} for Post {self.post.pk}"