# import graphene
# from django.core.files.base import ContentFile
from graphene_django.rest_framework.mutation import SerializerMutation
# from graphql.error.graphql_error import GraphQLError
# from graphql_jwt.refresh_token.shortcuts import create_refresh_token
# from graphql_jwt.shortcuts import get_token
# from api.models import User
from api.serializers import UserSerializer
from django.core.exceptions import ValidationError
# from api.util import get_id_token_google
# import requests


class UserSerializerMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer


def validate_file_size(file, max_size):
    if file.size > max_size:
        raise ValidationError(f"file size should not exceed {max_size / (1024 * 1024)} MB")


# class GoogleAuth(graphene.Mutation):
#     is_success = graphene.Boolean()
#
#     class Arguments:
#         code = graphene.String(required=True)
#
#     def mutate(self, info, **kwargs):
#
#         is_success = False
#
#         if 'code' in kwargs.keys():
#             code = kwargs['code']
#
#             try:
#                 details = get_id_token_google(code)
#                 email = details['email']
#                 email_verified = details['email_verified']
#                 first_name = details['given_name']
#                 last_name = details['family_name']
#                 profile_picture_url = details['picture']
#
#                 if not email_verified:
#                     raise GraphQLError("Email must be verified with google before creating or logging in")
#
#                 try:
#                     user = User.objects.get(email=email)
#                     user.is_verified = True
#                     user.save()
#
#                 except User.DoesNotExist:
#                     user_data = {
#                         'username': email.split('@')[0],
#                         'first_name': first_name,
#                         'last_name': last_name,
#                         'email': email,
#                         'is_verified': True,
#                         'is_active': True
#                     }
#
#                     serializer = UserSerializer(data=user_data)
#
#                     if serializer.is_valid():
#                         user = serializer.save()
#                         if profile_picture_url:
#                             response = requests.get(profile_picture_url)
#                             profile_picture = ContentFile(response.content)
#                             validate_file_size(profile_picture, max_size=2 * 1024 * 1024)
#                             file_name = f"{first_name}_{last_name}_profile_picture.jpg"
#                             user.profile_picture.save(file_name, profile_picture, save=False)
#                         user.save()
#                     else:
#                         raise GraphQLError(serializer.errors)
#
#                 token = get_token(user)
#                 refresh_token = create_refresh_token(user)
#
#                 info.context.tokens_to_set = {
#                     'token': token,
#                     'refresh_token': refresh_token,
#                 }
#
#                 is_success = True
#                 return GoogleAuth(is_success=is_success)
#
#             except ValueError as err:
#
#                 raise GraphQLError(f"Token exchange failed: {err}")
#
#         raise GraphQLError("Authentication failed")
