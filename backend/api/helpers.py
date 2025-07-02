
from django.core.files.base import ContentFile
from api.models import User
import requests
from backend import settings


class Helpers:
    @staticmethod
    def get_profile_picture(user: User, first_name: str, last_name: str, profile_picture_url: str):

        current_profile_picture_content = None

        if user.profile_picture:
            try:
                with open(user.profile_picture.path, 'rb') as current_profile_picture:
                    current_profile_picture_content = current_profile_picture.read()
            except FileNotFoundError:
                current_profile_picture_content = None

        if profile_picture_url:
            try:
                response = requests.get(profile_picture_url)
                response.raise_for_status()
            except requests.exceptions.RequestException:
                return None

            new_profile_picture_content = response.content

            if not current_profile_picture_content == new_profile_picture_content:
                if user.profile_picture:
                    user.profile_picture.delete(save=False)

                profile_picture = ContentFile(new_profile_picture_content)
                file_name = f"{first_name}_{last_name}_profile_picture.jpg"
                user.profile_picture.save(file_name, profile_picture, save=False)
                user.save()

            else:
                return None
        return None

    @staticmethod
    def refresh_google_id_token(google_refresh_token):
        token_url = 'https://oauth2.googleapis.com/token'
        data = {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'refresh_token': google_refresh_token,
            'grant_type': 'refresh_token',
        }

        try:

            response = requests.post(token_url, data=data)
            response.raise_for_status()
            token_data = response.json()

            if 'error' in token_data:
                raise Exception(f"Google token refresh error {token_data['error']}")

            return token_data

        except requests.exceptions.RequestException as e:
            raise Exception(f"Google token refresh error {str(e)}")



