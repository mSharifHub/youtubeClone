from rest_framework import serializers
from api.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'profile_picture',
            'bio',
            'subscribers',
            'is_verified',
            'is_active'
        )
