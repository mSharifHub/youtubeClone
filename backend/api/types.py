import graphene
from graphene_django import DjangoObjectType
from api.models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id',
                  "first_name",
                  "last_name",
                  'username',
                  'is_staff',
                  'profile_picture',
                  'bio',
                  'subscribers',
                  'is_verified',
                  'is_active',
                  'email'
                  )

    profile_picture = graphene.String()

    def resolve_profile_picture(self, info):
        if self.profile_picture:
            picture_url = info.context.build_absolute_uri(self.profile_picture.url)
            print(f"this is the picture_url send to front end: {picture_url}")
            return picture_url
