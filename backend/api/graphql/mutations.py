
import graphene
from django.core.exceptions import ObjectDoesNotExist
from django.utils.timezone import now
from graphene_django.rest_framework.mutation import SerializerMutation
from api.graphql.input_types import VideoInput
from api.serializers import UserSerializer
from  graphene_file_upload.scalars import Upload
from graphql import GraphQLError
from api.models import Post, PostImage, VideoPlaylist, Video, VideoPlaylistEntries
from api.graphql.object_types import  PostNode, VideoPlaylistEntryNode
from graphql_relay import from_global_id
MAX_TOTAL_SIZE = 10* 1024 * 1024

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
        video =  VideoInput(required=True)

    @classmethod
    def mutate (cls, root, info, **kwargs)-> 'SaveVideoPlaylist':
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Authentication required")

        try:
            video_data = kwargs['video']
            snippet = video_data.snippet
            statistics = video_data.statistics

            thumbnails_default = snippet.thumbnails.default.url if snippet.thumbnails.default else ''
            thumbnails_medium = snippet.thumbnails.medium.url if snippet.thumbnails.medium else ''
            thumbnails_high = snippet.thumbnails.high.url if snippet.thumbnails.high else ''

            defaults = {
                'title': snippet.title or '',
                'description': snippet.description if snippet.description else '',
                'thumbnails_default': thumbnails_default,
                'thumbnails_medium': thumbnails_medium,
                'thumbnails_high': thumbnails_high,
                'channel_id': snippet.channel_id,
                'channel_title': snippet.channel_title if snippet.channel_title else '',
                'channel_description': snippet.channel_description if snippet.channel_description else '',
                'channel_logo': snippet.channel_logo if snippet.channel_logo else '',
                'published_at': snippet.published_at,
                'subscriber_count': snippet.subscriber_count if snippet.subscriber_count else 0,
                'category_id':snippet.category_id ,
                'view_count': statistics.view_count if statistics.view_count else 0,
                'like_count': statistics.like_count if statistics.like_count else 0,
                'comment_count': statistics.comment_count if statistics.comment_count else 0,
                'duration': statistics.duration if statistics.duration else ""
            }

            video_object, _ = Video.objects.update_or_create(video_id= video_data.id.video_id,defaults=defaults)
            playlist,_ = VideoPlaylist.objects.get_or_create(user=user)

            video_entry, _ = VideoPlaylistEntries.objects.update_or_create(
                video_playlist=playlist,
                video=video_object,
                defaults={"watched_at": now()}

            )

            return SaveVideoPlaylist(video_entry=video_entry)

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