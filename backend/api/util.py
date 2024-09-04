import string
from re import split

from django.conf import settings
import requests
from google.oauth2 import id_token
import cachecontrol
import google.auth.transport.requests
from django.core.exceptions import ValidationError
from api.models import User
import random


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


    # response_token = str(token_response_parsed)
    #
    # print(response_token.split(","))

    return {
        'id_info': id_info,
        'access_token': token_response_parsed['access_token'],
        'refresh_token': token_response_parsed['refresh_token'],
        'expires_in': token_response_parsed['expires_in'],
    }


def generate_youtube_handler(first_name, last_name):
    base_handler = f'{first_name}_{last_name}'.lower()
    handler = base_handler

    if User.objects.filter(youtube_handler=base_handler).exists():
        while True:
            suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            handler = f'{first_name}_{last_name}_{suffix}'
            if not User.objects.filter(youtube_handler=handler).exists():
                break
    return handler


def validate_file_size(file, max_size):
    if file.size > max_size:
        raise ValidationError(f"file size should not exceed {max_size / (1024 * 1024)} MB")
