from api.token_utils import is_token_expired
from graphql_jwt.shortcuts import get_user_by_token, get_token, create_refresh_token
from django.middleware.csrf import get_token as get_csrf_token
from django.utils.deprecation import MiddlewareMixin


class CustomCSRFMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response['X-CSRF-Token'] = get_csrf_token(request)
        return response


class HandleTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get('JWT')
        refresh_token = request.COOKIES.get('JWT-refresh_token')

        if token and not is_token_expired(token):
            user = get_user_by_token(token)
            request.user = user

        elif refresh_token:
            user = get_user_by_token(refresh_token)
            if user:
                new_token = get_token(user)
                new_refresh_token = create_refresh_token(user)
                print(f"Created a new token  {new_token}")
                print(f"Created a new refresh token {new_refresh_token}")
                request.user = user
                request.token_to_set = {
                    'token': new_token,
                    'refresh_token': new_refresh_token
                }
        response = self.get_response(request)

        tokens = getattr(request, 'tokens_to_set', None)

        if tokens:
            print(f"Setting JWT cookie: {tokens['token']}")
            print(f"Setting JWT-refresh_token cookie: {tokens['refresh_token']}")

            response.set_cookie(
                'JWT',
                tokens['token'],
                httponly=True,
                max_age=3 * 60 * 3600,
                samesite='None',
                secure=True
            )
            response.set_cookie(
                'JWT-refresh_token',
                tokens['refresh_token'],
                httponly=True,
                max_age=7 * 24 * 3600,
                samesite='None',
                secure=True
            )

        return response
