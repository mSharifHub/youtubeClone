from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    subscribers = models.ManyToManyField('self', symmetrical=False, related_name='subscribed_to', blank=True)

    def __str__(self):
        return self.username


class Video(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    file_url = models.URLField(max_length=200)
    thumbnail_url = models.URLField(max_length=200, null=True, blank=True)
    upload_at = models.DateTimeField(auto_now_add=True)
    views = models.PositiveIntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="api")
    slug = models.SlugField(unique=True, blank=True, max_length=255)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(Video, self).save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(models.Model):
    video = models.ForeignKey(Video, related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.video.title}'


class Like(models.Model):
    video = models.ForeignKey(Video, related_name="likes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Like by {self.user.username} on {self.video.title}'
