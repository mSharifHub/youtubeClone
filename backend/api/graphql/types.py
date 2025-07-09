import graphene
from graphene_django import DjangoObjectType
from api.models import User, Post, PostImage


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            'google_sub',
            "first_name",
            "last_name",
            'username',
            'is_staff',
            'profile_picture',
            'bio',
            'subscribers',
            'is_verified',
            'is_active',
            'email',
            'youtube_handler',
            'posts'
        )

    profile_picture = graphene.String()

    def resolve_profile_picture(self, info):
        if self.profile_picture:
            picture_url = info.context.build_absolute_uri(self.profile_picture.url)
            return picture_url


class PostImageType(DjangoObjectType):
    image = graphene.String()
    class Meta:
        model = PostImage
        fields = ('id',)



    def resolve_image(self, info):
        if  self.image and hasattr(self.image, "url"):
            return info.context.build_absolute_uri(self.image.url)

        return None


class PostType(DjangoObjectType):

    images = graphene.List(PostImageType)
    profile_picture = graphene.String()

    class Meta:
        model = Post
        fields = (
            'id',
            'content',
            'created_at',
            'author'
        )


    def resolve_images(self,info):
        return self.images.all()

    def resolve_profile_picture(self:Post,info):
        if self.author and self.author.profile_picture:
            return info.context.build_absolute_uri(self.author.profile_picture.url)
        return None
