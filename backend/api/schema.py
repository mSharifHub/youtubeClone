import graphene
import graphql_jwt
from graphql_auth.schema import MeQuery
from api.models import User
from api.mutations import GoogleAuth, UserSerializerMutation
from api.types import UserType


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.Field(UserType)

    def resolve_viewer(self, info, **kwargs):
        user = info.context.user
        token_in_cookies = info.context.COOKIES.get('JWT')
        print(f"viewer token in cookies {token_in_cookies}")
        if user.is_anonymous:
            raise Exception("Not logged in")
        print(f"Authenticated user: {user.username}")
        return user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()


class Mutation(graphene.ObjectType):
    google_auth = GoogleAuth.Field()
    user_serializer = UserSerializerMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
