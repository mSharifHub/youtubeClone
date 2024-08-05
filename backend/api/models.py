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
