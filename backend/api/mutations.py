
from graphene_django.rest_framework.mutation import SerializerMutation
from api.serializers import UserSerializer


class UserSerializerMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer




