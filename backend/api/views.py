from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Video, Comment, Like
from .serializers import VideoSerializer, CommentSerializer, LikeSerializer


@api_view(['GET'])
def home(request):
    return JsonResponse({"message": "root"})


@api_view(['GET', 'POST'])
def video_feed(request):
    if request.method == 'GET':
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def video_detail(request, slug):
    try:
        video = Video.objects.get(slug=slug)
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VideoSerializer(video)
        return JsonResponse(serializer.data)
    elif request.method == 'PUT':
        serializer = VideoSerializer(video, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        video.delete()
        return JsonResponse({'deleted': True}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def comment_list(request, video_slug):
    try:
        video = Video.objects.get(slug=video_slug)
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Video does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = Comment.objects.filter(video=video)
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return JsonResponse({'error': 'Comment does not exist'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return JsonResponse(serializer.data)
    elif request.method == 'PUT':
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        comment.delete()
        return JsonResponse({'deleted': True}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def like_list(request):
    if request.method == 'GET':
        likes = Like.objects.all()
        likes_serializer = LikeSerializer(likes, many=True)
        return JsonResponse(likes_serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def like_detail(request, like_id):
    try:
        like = Like.objects.get(pk=like_id)
    except Like.DoesNotExist:
        return JsonResponse({'error': 'Like does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = LikeSerializer(like)
        return JsonResponse(serializer.data)
    elif request.method == 'PUT':
        serializer = LikeSerializer(like, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        like.delete()
        return JsonResponse({'deleted': True}, status=status.HTTP_204_NO_CONTENT)
