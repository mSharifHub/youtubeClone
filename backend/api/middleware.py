from graphql_jwt.shortcuts import get_user_by_token

from api.token_utils import is_token_expired, get_user_from_token, create_new_token


class HandleTokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.COOKIES.get('JWT')
        refresh_token = request.COOKIES.get('JWT-refresh_token')

        if token and not is_token_expired(token):
            print(f"Retrieved token  from cookie and is not expired: {token}")
            user = get_user_from_token(token)
            if user:
                request.user = user
        elif refresh_token:
            print(f"Retrieved token from cookie and is expired")
            user = get_user_from_token(refresh_token)

            if user:
                new_token, new_refresh_token = create_new_token(user)
                print(f"Created new token: {new_token}")
                print(f"Created new refresh token: {new_refresh_token}")
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
                max_age= 3 * 60 * 3600,
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
