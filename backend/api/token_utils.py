
from graphql_jwt.utils import jwt_decode
from jwt.exceptions import ExpiredSignatureError


def is_token_expired(token):
    try:
        jwt_decode(token)
        return False
    except ExpiredSignatureError:
        return True




