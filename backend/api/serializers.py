from rest_framework import serializers
from api.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'google_sub',
            'first_name',
            'last_name',
            'username',
            'email',
            'youtube_handler',
            'bio',
            'subscribers',
            'is_verified',
            'is_active'
        )
