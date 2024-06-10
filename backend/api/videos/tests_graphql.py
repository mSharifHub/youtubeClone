from graphene_django.utils.testing import GraphQLTestCase
from django.contrib.auth.models import User
from api.videos.models import Video, Comment, Like
from backend.schema import schema


class VideoGraphQLTestCase(GraphQLTestCase):
    GraphQLTestCase.schema = schema

    def setUp(self):
        self.user = User.objects.create_user(username='test', password='<PASSWORD>')
        self.video = Video.objects.create(
            title="test video"
        )
