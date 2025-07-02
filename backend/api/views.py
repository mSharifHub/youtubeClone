
import base64
import json
import requests
from django.conf import settings
from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .util import get_google_id_token, generate_youtube_handler
from graphql_jwt import exceptions
from django.contrib.auth import get_user_model
from jwt import InvalidTokenError, InvalidIssuerError
from django.views.decorators.debug import sensitive_variables
from django.urls import reverse
from api.helpers import Helpers

User = get_user_model()

class GoogleLoginView(APIView):
    @sensitive_variables('code', 'client_id')
    def get(self, request):
        client_id = settings.GOOGLE_CLIENT_ID
        redirect_uri = request.build_absolute_uri(reverse('google-callback'))
        scope = 'openid%20email%20profile'
        access_type = "offline"

        login_hint = request.query_params.get('login_hint', None)

        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"response_type=code&access_type={access_type}&"
            f"redirect_uri={redirect_uri}&scope={scope}&"
            f"client_id={client_id}"
        )

        if login_hint:
            auth_url += f"&login_hint={login_hint}&prompt=none"
        else:
            auth_url += "&prompt=consent"


        return redirect(auth_url)


class GoogleAuthCallBackView(APIView):
    @sensitive_variables('code', 'details', 'token', 'refresh_token')
    @method_decorator(csrf_exempt)
    def get(self, request):
        # 1 Gets the code from the query
        code = request.query_params.get('code', None)
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
        # 2 Gets the user data
        try:
            token_details = get_google_id_token(code)
            id_info = token_details['id_info']
            google_refresh_token = token_details.get('refresh_token',None)
            google_expires_in = token_details['expires_in']
            sub = id_info['sub']
            email = id_info['email']
            email_verified = id_info['email_verified']
            first_name = id_info['given_name']
            last_name = id_info['family_name']
            profile_picture_url = id_info['picture']



            # 3 Checks if user email is verified
            if not email_verified:
                return Response({'error': 'Email verification required. Verify with Google before authenticating'},
                                status=status.HTTP_401_UNAUTHORIZED)

            # 4 Checks if user already exists
            try:
                user = User.objects.get(email=email)
                user.save()

            except User.DoesNotExist:
                youtube_handler = generate_youtube_handler(first_name, last_name, )
                user_data = {
                    'google_sub': sub,
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
                    user.save()

                else:
                    return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            Helpers.get_profile_picture(user, first_name, last_name, profile_picture_url)


            response = redirect(f"{settings.CLIENT_ADDRESS}?success=true")

            # storing google tokens on cookies
            response.set_cookie(
                'google_id_token',
                token_details['id_token'],
                httponly=True,
                max_age=google_expires_in,
                samesite='Strict',
                secure= True
            )

            if google_refresh_token:
                response.set_cookie(
                    'google_refresh_token',
                    google_refresh_token,
                    httponly=True,
                    max_age=14 * 24 * 3600,  # 14 days
                    samesite='Strict',
                    secure=True
                )

            return response
        except Exception as err:
            return Response({'error': f"Token exchanged failed: {err}"}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):

        if not request.user.is_authenticated:
            return Response({'success': False, 'error': 'Unauthorized or invalid request'},
                            status=status.HTTP_401_UNAUTHORIZED)

        google_access_token = request.COOKIES.get('google_access_token')
        google_refresh_token = request.COOKIES.get('google_refresh_token')

        if not google_access_token or not google_refresh_token:
            return Response({'success': False, 'error': 'Unauthorized or invalid request'}, status=status.HTTP_401_UNAUTHORIZED)

        # message = {
        #     "access_token": google_access_token,
        #     "refresh_token": google_refresh_token,
        #     "user_id": request.user.google_sub
        # }
        #
        # message_str = json.dumps(message)
        #
        # byte_message = message_str.encode('utf-8')
        #

        try:
            # publisher = pubsub_v1.PublisherClient()
            # topic_path = publisher.topic_path(settings.GOOGLE_CLOUD_PROJECT_ID, settings.GOOGLE_CLOUD_PUB_SUB_TOPIC_ID)
            # future = publisher.publish(topic_path, byte_message)
            # print(future.result())
            response = Response({'success': True, "message": "Logged out successfully"}, status=status.HTTP_200_OK)

            for cookie in request.COOKIES:
                response.delete_cookie(cookie)

            return response

        except exceptions.JSONWebTokenExpired:
            return Response({'success': False, 'error': 'Token is expired'},
                            status=status.HTTP_401_UNAUTHORIZED)
        except (InvalidTokenError, InvalidIssuerError) as err:
            return Response({'success': False, 'error': f'Invalid token: {err}'},
                            status=status.HTTP_401_UNAUTHORIZED)

        except exceptions.JSONWebTokenError as err:
            return Response({'success': False, 'error': f'authentication failed {err}'},
                            status=status.HTTP_400_BAD_REQUEST)






