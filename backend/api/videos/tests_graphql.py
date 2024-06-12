import graphene
from django.core.files.uploadedfile import SimpleUploadedFile
from graphene_django.utils.testing import GraphQLTestCase
from api.videos.models import Video, User
from backend.schema import schema
import json


class UserGraphQlTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/graphql/"
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='password123',
            email='testuser@example.com',
            bio='This is a test bio.',
            profile_picture=SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg')
        )

    def test_create_user_mutation(self):
        response = self.query(
            '''
            mutation createUser($username: String!, $email: String!, $password: String!, $bio: String, $profilePicture: String) {
                createUser(username: $username, email: $email, password: $password, bio: $bio, profilePicture: $profilePicture) {
                    user {
                        username
                        email
                        bio
                        profilePicture
                    }
                }
            }
            ''',

            variables={
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'newpassword123',
                'bio': 'This is a new user bio',
                'profilePicture': None
            }
        )

        content = json.loads(response.content)
        print(json.dumps(content, indent=2))
        self.assertResponseNoErrors(response)


class VideoGraphQLTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/graphql/"
    GRAPHQL_SCHEMA = schema

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='password123',
            email='testuser@example.com',
            bio='This is a test bio.',
            profile_picture=SimpleUploadedFile(name='test_image.jpg', content=b'', content_type='image/jpeg')
        )

        self.video = Video.objects.create(
            title="test video",
            description="test description",
            file_url="http://example.com/video.mp4",
            thumbnail_url="http://example.com/video.jpg",
            user=self.user,
        )

    def test_video_by_slug_query(self):
        response = self.query(
            '''
            query videoBySlug($slug: String!) {
                videoBySlug(slug: $slug) {
                    title
                    description
                    fileUrl
                    thumbnailUrl
                    uploadAt
                    views
                    user{
                        username
                    }
                    slug
                }
            }
            ''',

            variables={'slug': self.video.slug}
        )

        content = json.loads(response.content)

        # Print the full response body on the terminal for debugging
        print(json.dumps(content, indent=2))

        # This validates the status code and if you get errors
        self.assertResponseNoErrors(response)

        # Additional assertions
        self.assertEqual(content['data']['videoBySlug']['title'], 'test video')
        self.assertEqual(content['data']['videoBySlug']['description'], 'test description')
