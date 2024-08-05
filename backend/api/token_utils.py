from graphql_jwt.utils import jwt_decode
from jwt.exceptions import ExpiredSignatureError
from graphql_jwt.refresh_token.models import RefreshToken


def is_token_expired(token):
    try:
        jwt_decode(token)
        return False
    except ExpiredSignatureError:
        return True


def revoke_refresh_token(token):
    try:
        refresh_token = RefreshToken.objects.get(token=token)

        if not refresh_token.revoked:
            refresh_token.revoke()

    except RefreshToken.DoesNotExist:
        pass

