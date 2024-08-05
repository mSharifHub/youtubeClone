from django.contrib.auth.backends import ModelBackend
from django.core.exceptions import PermissionDenied
from api.models import User


class GoogleUIDBackend(ModelBackend):
    def authenticate(self, request, google_sub=None, **kwargs):
        if google_sub is None:
            return None
        try:
            user = User.objects.get(google_sub=google_sub)

            if not user.is_verified:
                raise PermissionDenied("User email is not verified")

            return user

        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(google_sub=user_id)
        except User.DoesNotExist:
            return None
