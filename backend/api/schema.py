import graphene
import graphql_jwt
from graphql_auth.schema import MeQuery
from api.models import User
from api.mutations import UserSerializerMutation
from api.types import UserType
from graphql_jwt.exceptions import PermissionDenied


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.Field(UserType)

    def resolve_viewer(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise PermissionDenied()
        return user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()


class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
