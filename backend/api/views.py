from django.conf import settings
from django.core.files.base import ContentFile
from django.shortcuts import redirect
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .util import get_google_id_token, generate_youtube_handler
from api.models import User
import requests
from graphql_jwt.shortcuts import get_token, create_refresh_token
from graphql_jwt.utils import jwt_decode, get_user_by_payload
from graphql_jwt import exceptions


class GoogleLoginView(APIView):
    def get(self, request):
        client_id = settings.GOOGLE_CLIENT_ID
        redirect_uri = settings.GOOGLE_REDIRECT_URI
        scope = 'openid%20email%20profile'
        access_type = "offline"
        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"response_type=code&access_type={access_type}&"
            f"redirect_uri={redirect_uri}&scope={scope}&"
            f"client_id={client_id}"
        )
        return redirect(auth_url)


class GoogleAuthCallBackView(APIView):
    def get(self, request):
        code = request.query_params.get('code', None)
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            details = get_google_id_token(code)
            email = details['email']
            email_verified = details['email_verified']
            first_name = details['given_name']
            last_name = details['family_name']
            profile_picture_url = details['picture']

            if not email_verified:
                return Response({'error': 'Email verification required. Verify with Google before authenticating'},
                                status=status.HTTP_400_BAD_REQUEST)

            try:
                user = User.objects.get(email=email)
                user.is_verified = True
                user.save()

            except User.DoesNotExist:
                youtube_handler = generate_youtube_handler(first_name, last_name, )
                user_data = {
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'youtube_handler': youtube_handler,
                    'email': email,
                    'is_verified': True,
                    'is_active': True
                }
                serializer = UserSerializer(data=user_data)

                if serializer.is_valid():
                    user = serializer.save()
                    if profile_picture_url:
                        response = requests.get(profile_picture_url)
                        profile_picture = ContentFile(response.content)
                        file_name = f"{first_name}_{last_name}_profile_picture.jpg"
                        user.profile_picture.save(file_name, profile_picture, save=False)
                    user.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            token = get_token(user)

            refresh_token = create_refresh_token(user)

            response = redirect(settings.CLIENT_ADDRESS)

            response.set_cookie(
                'JWT',
                token,
                httponly=True,
                max_age=3 * 60 * 3600,
                samesite='None',
                secure=True
            )
            response.set_cookie(
                'JWT-refresh_token',
                refresh_token,
                httponly=True,
                max_age=7 * 24 * 3600,
                samesite='None',
                secure=True
            )

            return response
        except ValueError as err:
            return Response({'error': f"Token exchanged failed: {err}"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        # get cookie from the request
        token = request.COOKIES.get('JWT')

        # If there is no token then throw an error
        if not token:
            return Response({'success': True, 'error': 'Unauthorized or Invalid Request'}, status=status.HTTP_400_BAD_REQUEST)

        print(f"token for debug {token}")

        try:
            payload = jwt_decode(token)
            user = get_user_by_payload(payload)

            if not user:
                return Response({'success': False, 'error': 'Unauthorized or Invalid Request'}, status=status.HTTP_401_UNAUTHORIZED)

            print(f"debugging user {user}")

            response = Response({'success': True, "message": "Logged out successfully"}, status=status.HTTP_200_OK)
            response.delete_cookie('JWT')
            response.delete_cookie('JWT-refresh_token')
            print(f"response for debugging user {user} logged out success {response}")
            return response

        except exceptions.JSONWebTokenError as err:
            return Response({'success': False, 'error': f'error occurred {err}'}, status=status.HTTP_400_BAD_REQUEST)

