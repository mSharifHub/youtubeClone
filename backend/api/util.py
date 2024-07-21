import os.path

from oauth2client import client

from django.conf import settings

import requests

from google.oauth2 import id_token
from google.auth.transport import requests as google_auth_requests

from graphql_jwt.shortcuts import get_user_by_token, get_token, create_refresh_token


def get_id_token_google(code):
    client_secret_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'client_secret.json')

    credentials = client.credentials_from_clientsecrets_and_code(
        client_secret_path,
        ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/userinfo.profile',
         'https://www.googleapis.com/auth/userinfo.email'],
        code
    )

    return credentials.id_token


def get_id_token_google_rest_api(code):
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

    id_info = id_token.verify_oauth2_token(token_response_parsed['id_token'], google_auth_requests.Request(),
                                           settings.GOOGLE_CLIENT_ID)

    return id_info


def generate_token(user):
    return get_token(user)


def generate_refresh_token(user):
    return create_refresh_token(user)
