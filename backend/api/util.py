# import os.path
# from oauth2client import client

from django.conf import settings
import requests
from google.oauth2 import id_token
import cachecontrol
import google.auth.transport.requests


# def get_id_token_google(code):
#     client_secret_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'client_secret.json')
#
#     credentials = client.credentials_from_clientsecrets_and_code(
#         client_secret_path,
#         ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/userinfo.profile',
#          'https://www.googleapis.com/auth/userinfo.email'],
#         code
#     )
#
#     return credentials.id_token


def get_google_id_token(code):
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,

    }

    token_http_post = requests.post(token_url, data=token_data)

    token_http_post.raise_for_status()

    token_response_parsed = token_http_post.json()

    session = requests.session()

    cached_session = cachecontrol.CacheControl(session)

    request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(token_response_parsed['id_token'], request, settings.GOOGLE_CLIENT_ID)

    return id_info
