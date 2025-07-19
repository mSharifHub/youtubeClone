from datetime import datetime
from typing import Optional, Dict, Any

import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphene_django.rest_framework.mutation import SerializerMutation
from api.serializers import UserSerializer
from  graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from api.models import  Post, PostImage, VideoHistory
from api.graphql.types import  PostNode, VideoHistoryNode
from graphql_relay import from_global_id
from dateutil.parser import parse as parse_date

MAX_TOTAL_SIZE = 10* 1024 * 1024   # 1MB total size allowed


class UserSerializerMutation(SerializerMutation):
    class Meta:
        serializer_class = UserSerializer


class DeletePost(graphene.Mutation):
    success = graphene.Boolean()
    post = graphene.Field(PostNode)

    class Arguments:
        post_id = graphene.ID(required=True)

    def mutate(self, info, post_id):
        user= info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        try:
            global_id= from_global_id(post_id)[1]
            post = Post.objects.get(pk=global_id, author=user)
            post.delete()
            return DeletePost(success=True, post=Post(id=global_id))


        except ValueError:
            raise GraphQLError("Invalid post id")

        except ObjectDoesNotExist:
            raise GraphQLError("Post not found")

        except Exception as e:
            raise GraphQLError(f"an error occurred: {str(e)}")


class EditPost (graphene.Mutation):
    post = graphene.Field(PostNode)
    cursor = graphene.String()

    class Arguments:
        post_id = graphene.ID(required=True)
        content = graphene.String(required=True)


    def mutate(self, info, post_id, content=None):
        user= info.context.user
        db_id = from_global_id(post_id)[1]
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        try:
            post = Post.objects.get(pk=db_id, author=user)
        except ObjectDoesNotExist:
            raise GraphQLError("Post not found")


        post.content = content
        post.save()
        return EditPost(post=post)


class SaveVideoHistory(graphene.Mutation):
    video_history = graphene.Field(VideoHistoryNode)
    cursor = graphene.String()

    class Arguments:
        video_id = graphene.ID(required=True)
        title = graphene.String(required=False)
        thumbnail_default = graphene.String(required=False)


    @classmethod
    def mutate (cls, root, info, **kwargs)-> 'SaveVideoHistory':
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        try:
            defaults = {
                'title': kwargs['title'],
                'thumbnail_default': kwargs['thumbnail_default'],
                'watched_at':datetime.now()
            }

            video_history, _ = VideoHistory.objects.update_or_create(
                user = user,
                video_id = kwargs['video_id'],
                defaults = defaults
            )

            return SaveVideoHistory(video_history=video_history)

        except Exception as err:
            raise GraphQLError(f"an error occurred: {str(err)}")



class CreatePost(graphene.Mutation):
    post = graphene.Field(PostNode)
    cursor = graphene.String()

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

        if images:
            for image in images:
                if image.size > MAX_TOTAL_SIZE:
                    raise GraphQLError("Image size exceeds the limit")

                total_size += image.size
                if total_size > MAX_TOTAL_SIZE:
                    raise GraphQLError("Total size of images exceeds the limit")

            PostImage.objects.create(post=post, image=image)

        return CreatePost(post=post)