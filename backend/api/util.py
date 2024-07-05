import os.path

from oauth2client import client


def get_id_token_google(code):
    client_secret_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'client_secret.json')

    credentials = client.credentials_from_clientsecrets_and_code(
        client_secret_path,
        ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        code
    )

    return credentials.id_token
