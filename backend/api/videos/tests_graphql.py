from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth.models import User
from api.videos.models import Video

import json


class VideoGraphQLTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/graphql/"

    def setUp(self):
        self.user = User.objects.create_user(username='test', password='password')
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
