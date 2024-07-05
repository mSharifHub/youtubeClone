import graphene
import graphql_jwt
from graphql_auth.schema import MeQuery
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_jwt.decorators import login_required, superuser_required
from graphql_jwt.shortcuts import get_token, create_refresh_token
from django.http import HttpResponse
import requests

from api.models import User
from api.util import get_id_token_google


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id',
                  "first_name",
                  "last_name",
                  'username',
                  'is_staff',
                  'profile_picture', 'bio',
                  'subscribers', 'is_verified', 'email'
                  )

    profile_picture = graphene.String()

    def resolve_profile_picture(self, info):
        if self.profile_picture:
            picture_url = info.context.build_absolute_uri(self.profile_picture.url)
            print(f"this is the picture_url send to front end: {picture_url}")
            return picture_url


def validate_file_size(file, max_size):
    print(f"Validating file size: {file.size} bytes, max size: {max_size} bytes")
    if file.size > max_size:
        raise ValidationError(f"file size should not exceed {max_size / (1024 * 1024)} MB")


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserType)
    viewer = graphene.Field(UserType)

    @login_required
    def resolve_viewer(self, info, **kwargs):
        return info.context.user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()


class GoogleAuth(graphene.Mutation):
    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        code = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        if 'code' in kwargs.keys():
            print(f"code obtained {kwargs['code']}")
            code = kwargs['code']

            try:
                # Get details and destruct user details
                details = get_id_token_google(code)
                email = details['email']
                email_verified = details['email_verified']
                first_name = details['given_name']
                last_name = details['family_name']
                profile_picture_url = details['picture']

                print(
                    f"email: {email},"
                    f" email_verified: {email_verified}, "
                    f"first_name {first_name}, "
                    f"profile_picture: {profile_picture_url}"
                )

                if not email_verified:
                    print("email is not verified and error has been raised")
                    raise GraphQLError("Email must be verified with google before creating or logging in")

                try:
                    user = User.objects.get(email=email)
                    user.is_verified = True
                    user.save()
                    print("user already exist in the database. user has been saved")

                except User.DoesNotExist:
                    print("user does not exist in the database. user is being created")
                    user = User(
                        username=email.split('@')[0],
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        is_verified=True,
                        is_active=True,
                    )
                    if profile_picture_url:
                        response = requests.get(profile_picture_url)
                        profile_picture = ContentFile(response.content)
                        validate_file_size(profile_picture, max_size=2 * 1024 * 1024)
                        file_name = f"{first_name}_{last_name}_profile_picture.jpg"
                        user.profile_picture.save(file_name, profile_picture, save=False)

                    user.save()

                    print("new user has been created and saved")

                print("creating an access token and refresh token")
                token = get_token(user)
                refresh_token = create_refresh_token(user)
                print(f"access_token: {token}, refresh_token: {refresh_token}")
                return GoogleAuth(user=user, token=token, refresh_token=refresh_token)

            except ValueError as err:
                raise GraphQLError(f"Token exchange failed: {err}")

        raise GraphQLError("Authentication failed")


class AuthMutation(graphene.ObjectType):
    google_auth = GoogleAuth.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    revoke_token = graphql_jwt.Revoke.Field()
    delete_token_cookie = graphql_jwt.DeleteJSONWebTokenCookie.Field()
    delete_refresh_token_cookie = graphql_jwt.DeleteRefreshTokenCookie.Field()


schema = graphene.Schema(query=Query, mutation=AuthMutation)
