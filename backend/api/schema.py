import graphene
from graphql_auth.schema import MeQuery
from api.models import User
from api.mutations import UserSerializerMutation
from api.types import UserType



class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.Field(UserType)

    def resolve_viewer(self, info, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise Exception('Not Authenticated')
        return user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()


class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
