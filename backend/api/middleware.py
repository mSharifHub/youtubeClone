
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import authenticate
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from api.helpers import Helpers
from backend import settings
import logging
logger = logging.getLogger(__name__)

class GoogleAuthMiddleWare(MiddlewareMixin):
    def process_request(self, request):
        if  getattr(request, 'user', None) and request.user.is_authenticated:
            return

        google_id_token = request.COOKIES.get('google_id_token')
        google_refresh_token = request.COOKIES.get('google_refresh_token')
        user = None
        token_valid = False

        if google_id_token:
            try:
                id_token.verify_oauth2_token(google_id_token,google_requests.Request(), settings.GOOGLE_CLIENT_ID )
                user = authenticate(request, google_id_token=google_id_token)
                token_valid = True
            except ValueError as value_error:
                logger.warning(f"Error validating Google token: {value_error}")
            except Exception as e:
                logger.error(f"Token verification failed: {str(e)}")


        if not token_valid and google_refresh_token:
            try:
                token_data = Helpers.refresh_google_id_token(google_refresh_token)
                new_id_token = token_data['id_token']
                expires_in = token_data['expires_in']
                if new_id_token:
                    user = authenticate(request, google_id_token=new_id_token)
                    request.new_id_token = (new_id_token, expires_in)
            except Exception as e:
                logger.error(f"Error refreshing google token: {e}")
        if user:
            request.user = user


    def process_response(self, request, response):
        if hasattr(request, 'new_id_token'):
            new_id_token, expires_in = request.new_id_token

            response.set_cookie(
                'google_id_token',
                new_id_token,
                httponly=True,
                max_age=expires_in,
                samesite='Strict',
                secure=True
            )


        return response


