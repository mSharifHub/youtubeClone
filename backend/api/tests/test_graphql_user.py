import json
import os
from graphene_django.utils.testing import GraphQLTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from requests_toolbelt.multipart.encoder import MultipartEncoder
from api.models import User


class UserGraphQlTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/graphql/"

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='password123',
        )

    def test_create_user_without_profile(self):
        response = self.query(
            '''
            mutation createUser($username: String!, $email: String!, $password: String!, $bio: String, $profilePicture: Upload) {
                createUser(username: $username, email: $email, password: $password, bio: $bio, profilePicture: $profilePicture) {
                    user {
                        id
                        username
                        email
                        bio
                    }
                    token 
                    refreshToken
                }
            }
            ''',
            variables={
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'newpassword123',
                'bio': 'This is a bio',
                'profilePicture': None
            }
        )

        content = response.json()
        self.assertResponseNoErrors(response)
        print("Query result for test_create_user_without_profile:", json.dumps(content, indent=2))

    def test_create_user_with_profile(self):
        profile_picture = SimpleUploadedFile(
            "profile_picture.jpg",
            b"file_content" * 1024 * 3,  # Small file content for testing
            content_type="image/jpeg"
        )

        # Construct multipart form data
        multipart_data = MultipartEncoder(
            fields={
                'operations': json.dumps({
                    'query': '''
                        mutation createUser($username: String!, $email: String!, $password: String!, $bio: String, $profilePicture: Upload) {
                            createUser(username: $username, email: $email, password: $password, bio: $bio, profilePicture: $profilePicture) {
                                user {
                                    id
                                    username
                                    email
                                    bio
                                }
                                   token
                                   refreshToken
                            }
                        }
                    ''',
                    'variables': {
                        'username': 'newuser',
                        'email': 'newuser@example.com',
                        'password': 'newpassword123',
                        'bio': 'This is a bio',
                        'profilePicture': None
                    }
                }),
                'map': json.dumps({
                    '1': ['variables.profilePicture']
                }),
                '1': ('profile_picture.jpg', profile_picture, 'image/jpeg')
            }
        )

        response = self.client.post(
            self.GRAPHQL_URL,
            data=multipart_data.to_string(),
            content_type=multipart_data.content_type
        )

        content = response.json()
        self.assertResponseNoErrors(response)
        print("Query result for test_create_user_with_profile:", json.dumps(content, indent=2))
        self.assertEqual(content['data']['createUser']['user']['username'], 'newuser')
        self.assertEqual(content['data']['createUser']['user']['email'], 'newuser@example.com')
        self.assertEqual(content['data']['createUser']['user']['bio'], 'This is a bio')

        user = User.objects.get(username='newuser')
        self.assertTrue(user.profile_picture.name.startswith('profile_pictures/newuser_profile_picture'))
        print(f"Profile picture saved at: {user.profile_picture.path}")

        if os.path.exists(user.profile_picture.path):
            os.remove(user.profile_picture.path)

    def test_create_user_with_large_profile_picture(self):
        large_profile_picture = SimpleUploadedFile(
            "large_profile_picture.jpg",
            b"file_content" * (2 * 1024 * 1024 + 1),  # Slightly larger than 2MB
            content_type="image/jpeg"
        )

        multipart_data = MultipartEncoder(
            fields={
                'operations': json.dumps({
                    'query': '''
                        mutation createUser($username: String!, $email: String!, $password: String!, $bio: String, $profilePicture: Upload) {
                            createUser(username: $username, email: $email, password: $password, bio: $bio, profilePicture: $profilePicture) {
                                user {
                                    id
                                    username
                                    email
                                    bio
                                }
                                token
                                refreshToken
                            }
                        }
                    ''',
                    'variables': {
                        'username': 'newuser',
                        'email': 'newuser@example.com',
                        'password': 'newpassword123',
                        'bio': 'This is a bio',
                        'profilePicture': None
                    }
                }),
                'map': json.dumps({
                    '1': ['variables.profilePicture']
                }),
                '1': ('large_profile_picture.jpg', large_profile_picture, 'image/jpeg')
            }
        )

        response = self.client.post(
            self.GRAPHQL_URL,
            data=multipart_data.to_string(),
            content_type=multipart_data.content_type
        )

        content = response.json()
        print("Query result for test_create_user_with_large_profile_picture:", json.dumps(content, indent=2))
        self.assertIn('errors', content)
        self.assertIn('file size should not exceed', content['errors'][0]['message'])
