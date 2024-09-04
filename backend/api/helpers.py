from django.core.files.base import ContentFile
from api.models import User
import requests

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
