from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from google.oauth2 import  id_token
from google.auth.transport import requests as google_requests


User = get_user_model()

class GoogleTokenAuthentication(BaseBackend):

    def authenticate(self, request):
        google_id_token = request.COOKIES.get('google_id_token')
        if not google_id_token:
            print('debugging auth: no google_access_token',google_id_token)
            return None

        try:
            id_info = id_token.verify_oauth2_token(google_id_token,google_requests.Request())

            email = id_info.get('email')

            if not email:
                return None

            try:
                user = User.objects.get(email=email)
                return  user
            except User.DoesNotExist:
                return None


        except Exception as e:
            return None



    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

