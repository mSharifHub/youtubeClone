from django.urls import path
from .views import *

urlpatterns = [
    path("api/", video_feed, name="video_feed"),
    path("api/<slug:slug>/", video_detail, name="video_detail"),
    path("api/<slug:video_slug>/comments/", comment_list, name="comment_list"),
    path("comments/<int:pk>/", comment_detail, name="comment_detail"),
    path("likes/", like_list, name="like_list"),
    path("likes/<int:like_id>/", like_detail, name="like_detail"),
]
