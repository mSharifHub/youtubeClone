
# Revise code and change
from graphql_jwt.utils import jwt_decode
from graphql_jwt.shortcuts import get_user_by_token, get_token, create_refresh_token
from datetime import datetime


def get_user_from_token(token):
    user = get_user_by_token(token)
    if user:
        return user

    return None


def is_token_expired(token):
    payload = jwt_decode(token)
    print ("this is the payload from is_token_expierd {}".format(payload))
    exp = payload['exp']
    if exp:
        exp_date = datetime.fromtimestamp(exp)
        return exp_date < datetime.utcnow()
    return False


def create_new_token(user):
    token = get_token(user)
    refresh_token = create_refresh_token(user)
    return token, refresh_token
