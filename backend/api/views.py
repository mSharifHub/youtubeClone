from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .util import get_google_id_token, generate_youtube_handler
from api.models import User
from graphql_jwt.shortcuts import get_token, create_refresh_token
from graphql_jwt import exceptions
from .token_utils import revoke_refresh_token
from django.contrib.auth import login as django_login
from jwt import InvalidTokenError, InvalidIssuerError
from django.views.decorators.debug import sensitive_variables
from django.urls import reverse
from api.helpers import Helpers


class GoogleLoginView(APIView):
    @sensitive_variables('code', 'client_id')
    def get(self, request):
        client_id = settings.GOOGLE_CLIENT_ID
        redirect_uri = request.build_absolute_uri(reverse('google-callback'))
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
    @sensitive_variables('code', 'details', 'token', 'refresh_token')
    def get(self, request):
        # 1 Gets the code from the query
        code = request.query_params.get('code', None)
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
        # 2 Gets the user data
        try:
            details = get_google_id_token(code)
            sub = details['sub']
            email = details['email']
            email_verified = details['email_verified']
            first_name = details['given_name']
            last_name = details['family_name']
            profile_picture_url = details['picture']

            # 3 Checks if user email is verified
            if not email_verified:
                return Response({'error': 'Email verification required. Verify with Google before authenticating'},
                                status=status.HTTP_401_UNAUTHORIZED)

            # 4 Checks if user already exists
            try:
                user = User.objects.get(email=email)
                print(f'debugging user does exist {user}')
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

            django_login(request, user, 'django.contrib.auth.backends.ModelBackend')

            extra_data = {
                'google_sub': user.google_sub,
                'email': user.email,
                'youtube_handler': user.youtube_handler,
            }

            token = get_token(user, **extra_data)

            refresh_token = create_refresh_token(user)

            response = redirect(f"{settings.CLIENT_ADDRESS}?success=true")

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

        # session_key = request.COOKIES.get('sessionid')
        # session = Session.objects.get(session_key=session_key)
        # uid = session.get_decoded().get('_auth_user_id')
        # user = User.objects.get(google_sub=uid)

        if not request.user.is_authenticated:
            return Response({'success': False, 'error': 'Unauthorized or invalid request'},
                            status=status.HTTP_401_UNAUTHORIZED)
        try:

            refresh_token_value = request.COOKIES.get('JWT-refresh_token')

            if refresh_token_value:
                revoke_refresh_token(refresh_token_value)

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
