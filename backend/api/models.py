import uuid
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


class Video(models.Model):
    video_id = models.CharField(max_length=500,primary_key=True, editable=False)
    title = models.CharField(max_length=500, blank=True, default='')
    description = models.TextField(blank=True, default='')
    thumbnail_default = models.URLField(blank=True, default='')
    thumbnail_medium = models.URLField(blank=True, default='')
    thumbnail_high = models.URLField(blank=True, default='')


    channel_id = models.CharField(max_length=240)
    channel_title = models.CharField(max_length=240, blank=True, default='')
    channel_description = models.TextField(blank=True, default='')
    channel_logo = models.URLField(max_length=500,blank=True, default='')

    published_at = models.DateTimeField()
    subscriber_count = models.BigIntegerField(default=0)
    category_id = models.CharField(max_length=10, blank=True,default='')

    view_count = models.BigIntegerField(default=0)
    like_count = models.BigIntegerField(default=0)
    comment_count = models.BigIntegerField(default=0)
    duration= models.CharField(max_length=10, blank= True, default='')

    def __str__(self):
        return self.video_id or self.title


class VideoPlaylist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='video_playlist_history')
    videos = models.ManyToManyField(Video, through="VideoPlaylistEntries")

    def __str__(self):
        return f" {self.user.username}'s video playlist history"


class VideoPlaylistEntries(models.Model):
    video_playlist = models.ForeignKey(VideoPlaylist, on_delete=models.CASCADE, related_name='video_entries')
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('video_playlist', 'video')
        ordering = ['-watched_at']

    def __str__(self):
        return f"{self.video.title} watched by {self.video_playlist.user.username}"



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