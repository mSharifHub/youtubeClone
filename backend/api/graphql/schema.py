from functools import wraps
import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphql_auth.schema import MeQuery
from graphene_django.filter import DjangoFilterConnectionField
from api.models import User, Post, VideoPlaylist
from graphql import GraphQLError
from api.graphql.mutations import UserSerializerMutation, CreatePost, EditPost, DeletePost, SaveVideoPlaylist
from api.graphql.types import UserTypes, PostNode, VideoPlaylistNode

DEFAULT_POST_ORDERING= '-created_at'


def require_auth(func):
    @wraps(func)
    def wrapper(self,info,**kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Not Authenticated")
        return func(self,info,**kwargs)
    return  wrapper


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserTypes)
    viewer = graphene.Field(UserTypes)
    viewer_posts = DjangoFilterConnectionField(PostNode)
    all_posts = DjangoFilterConnectionField(PostNode)
    viewer_video_playlist = graphene.Field(VideoPlaylistNode)

    @require_auth
    def resolve_viewer(self, info, **kwargs):
        return info.context.user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    @require_auth
    def resolve_viewer_posts(self, info, **kwargs):
        return  Post.objects.filter(author=info.context.user).order_by(DEFAULT_POST_ORDERING)

    def resolve_all_posts(self,info,**kwargs):
        return Post.objects.all().order_by(DEFAULT_POST_ORDERING)

    @require_auth
    def resolve_viewer_video_playlist(self,info,**kwargs):
        try:
            return info.context.user.video_playlist_history
        except ObjectDoesNotExist:
            return  VideoPlaylist.objects.create(user=info.context.user)


class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()
    create_post = CreatePost.Field()
    edit_post = EditPost.Field()
    delete_post = DeletePost.Field()
    save_video_playlist = SaveVideoPlaylist.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
