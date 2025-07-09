import graphene
from graphene_django.rest_framework.mutation import SerializerMutation
from api.serializers import UserSerializer
from  graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from api.models import  Post, PostImage
from api.graphQl.types import  PostType

MAX_TOTAL_SIZE = 10* 1024 * 1024   # 1MB total size allowed


class UserSerializerMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer


class CreatePost(graphene.Mutation):
    post = graphene.Field(PostType)

    class Arguments:
        content = graphene.String(required=False)
        images = graphene.List(Upload, required=False)

    def mutate(self,info,content=None, images=None):
        user= info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        if not content and not images:
            raise GraphQLError("You must have either a image or a content")

        post = Post.objects.create(author=user, content=content or '')

        total_size =0

        for image in images:
            print(image)
        if images:
            for image in images:
                if image.size > MAX_TOTAL_SIZE:
                    raise GraphQLError("Image size exceeds the limit")

                total_size += image.size
                if total_size > MAX_TOTAL_SIZE:
                    raise GraphQLError("Total size of images exceeds the limit")

            PostImage.objects.create(post=post, image=image)

        return CreatePost(post=post)