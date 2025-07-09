import graphene
from graphql_auth.schema import MeQuery
from api.models import User, Post
from graphql import GraphQLError
from api.graphql.mutations import UserSerializerMutation, CreatePost
from api.graphql.types import UserType, PostType


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.Field(UserType)

    viewer_posts = graphene.List(PostType)
    all_posts = graphene.List(PostType)

    def resolve_viewer(self, info, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError('Not Authenticated')
        return user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_viewer_posts(self, info, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
           raise GraphQLError('Not Authenticated')
        return  Post.objects.filter(author=user).order_by('-created_at')

    def resolve_all_posts(self,info,**kwargs):
        return Post.objects.all().order_by('-created_at')


class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()
    create_post = CreatePost.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
