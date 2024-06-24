from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from api.models import Video, Comment, Like


class VideoTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testUser', email='<EMAIL>', password='<PASSWORD>')
        self.video = Video.objects.create(
            title="Test Video",
            description="Test Description",
            file_url="http://example.com/test.mp4",
            thumbnail_url="http://example.com/test.jpg",
            user=self.user

        )

    # Test Get And Post
    def test_video_feed(self):
        url = reverse('video_feed')

        data = {
            "title": "Test Video",
            "description": "Test Description",
            "file_url": "http://example.com/test.mp4",
            "thumbnail_url": "http://example.com/test.jpg",
            "user": self.user.id
        }
        create_response = self.client.get(url, data, format='json')
        self.assertEqual(create_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Video.objects.count(), 1)

        get_response = self.client.get(url, format='json')
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Video.objects.count(), 1)

    # GET video_feed detail
    def test_video_detail(self):
        url = reverse('video_detail', kwargs={'slug': self.video.slug})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CommentTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testUser', email='<EMAIL>', password='<PASSWORD>')
        self.video = Video.objects.create(
            title="Test Video",
            description="Test Description",
            file_url="http://example.com/test.mp4",
            thumbnail_url="http://example.com/test.jpg",
            user=self.user
        )
        self.comment = Comment.objects.create(
            video=self.video,
            user=self.user,
            content="Test Comment",
        )

    def test_get_comment_list(self):
        url = reverse('comment_list', kwargs={'video_slug': self.video.slug})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_comment_detail(self):
        url = reverse("comment_detail", kwargs={"pk": self.comment.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_comment(self):
        url = reverse('comment_list', kwargs={'video_slug': self.video.slug})
        data = {
            'video': self.video.id,
            'user': self.user.id,
            'content': "Test Comment",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LikeTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testUser', email='<EMAIL>', password='<PASSWORD>')
        self.video = Video.objects.create(
            title="Test Video",
            description="Test Description",
            file_url="http://example.com/test.mp4",
            thumbnail_url="http://example.com/test.jpg",
            user=self.user
        )

        self.like = Like.objects.create(
            video=self.video,
            user=self.user,
        )

    def test_get_like_list(self):
        url = reverse('like_list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Like.objects.count(), 1)

    def test_create_like(self):
        url = reverse('like_list')
        data = {
            'video': self.video.id,
            'user': self.user.id,
        }
        response = self.client.post(url,data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Like.objects.count(), 2)

    def test_delete_like(self):
        url = reverse('like_detail', kwargs={'like_id': self.like.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Like.objects.count(), 0)