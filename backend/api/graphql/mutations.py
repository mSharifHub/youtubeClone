from datetime import datetime
from enum import nonmember
from typing import Optional, Dict, Any

import graphene
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import now
from graphene_django.rest_framework.mutation import SerializerMutation
from api.serializers import UserSerializer
from  graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from api.models import Post, PostImage, VideoPlaylist, Video, VideoPlaylistEntries
from api.graphql.types import  PostNode, VideoPlaylistEntryNode
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


class SaveVideoPlaylist(graphene.Mutation):
    video_entry = graphene.Field(VideoPlaylistEntryNode)


    cursor = graphene.String()

    class Arguments:
        video_id = graphene.ID(required=True)
        title = graphene.String(required=False)
        description = graphene.String(required=False)
        thumbnail_default = graphene.String(required=False)
        thumbnail_medium = graphene.String(required=False)
        channel_id = graphene.String(required=False)
        channel_title = graphene.String(required=False)
        channel_description = graphene.String(required=False)
        channel_logo = graphene.String(required=False)
        published_at = graphene.DateTime(required=False)
        subscriber_count = graphene.String(required=False)
        category_id = graphene.String(required=False)
        view_count = graphene.String(required=False)
        like_count = graphene.String(required=False)
        comment_count = graphene.String(required=False)
        duration = graphene.String(required=False)


    @classmethod
    def mutate (cls, root, info, **kwargs)-> 'SaveVideoPlaylist':
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        try:

            video_object, _ = Video.objects.update_or_create(
                video_id=kwargs['video_id'],
                defaults={
                    'title': kwargs.get('title'),
                    'description': kwargs.get('description'),
                    'thumbnail_default': kwargs.get('thumbnail_default'),
                    'thumbnail_medium': kwargs.get('thumbnail_medium'),
                    'channel_id': kwargs.get('channel_id'),
                    'channel_title': kwargs.get('channel_title'),
                    'channel_description': kwargs.get('channel_description'),
                    'channel_logo': kwargs.get('channel_logo'),
                    'published_at': kwargs.get('published_at'),
                    'subscriber_count': kwargs.get('subscriber_count'),
                    'category_id': kwargs.get('category_id'),
                    'view_count': kwargs.get('view_count'),
                    'like_count': kwargs.get('like_count'),
                    'comment_count': kwargs.get('comment_count'),
                    'duration': kwargs.get('duration'),
                }

            )

            playlist,_ = VideoPlaylist.objects.get_or_create(user=user)

            entry, _ = VideoPlaylistEntries.objects.update_or_create(
                video_playlist=playlist,
                video=video_object,
                defaults={"watched_at": now()}

            )

            return SaveVideoPlaylist(video_entry=entry)


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