import base64
import json
from functools import wraps
import requests
import graphene
import requests.exceptions
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.query_utils import Q
from django.views.decorators.debug import sensitive_variables
from graphql_auth.schema import MeQuery
from graphene_django.filter import DjangoFilterConnectionField
from api.helpers import Helpers
from api.models import User, Post, VideoPlaylist, Video, CommentThread, Comment
from graphql import GraphQLError
from api.graphql.mutations import UserSerializerMutation, CreatePost, EditPost, DeletePost, SaveVideoPlaylist
from api.graphql.object_types import UserTypes, PostNode, VideoPlaylistNode, YoutubeVideoResponse, YoutubeCommentsResponse

DEFAULT_POST_ORDERING = '-created_at'

def require_auth(func):
    @wraps(func)
    def wrapper(self, info, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Not Authenticated")
        return func(self, info, **kwargs)

    return wrapper


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserTypes)
    viewer = graphene.Field(UserTypes)
    viewer_posts = DjangoFilterConnectionField(PostNode)
    all_posts = DjangoFilterConnectionField(PostNode)
    viewer_video_playlist = graphene.Field(VideoPlaylistNode)

    youtube_search_videos = graphene.Field(
        YoutubeVideoResponse,
        query=graphene.String(default_value='trending'),
        after = graphene.String(),
        max_results=graphene.Int(default_value=10),
    )

    # youtube_search_videos = graphene.Field(
    #     YoutubeVideoResponse,
    #     query=graphene.String(default_value='trending'),
    #     page_token=graphene.String(),
    #     max_results=graphene.Int(default_value=10),
    # )


    youtube_liked_videos = graphene.Field(
        YoutubeVideoResponse,
        page_token=graphene.String(),
        max_results=graphene.Int(default_value=10),
    )

    youtube_video_categories = graphene.Field(
        YoutubeVideoResponse,
        category_id=graphene.String(required=True),
        page_token = graphene.String(),
        max_results = graphene.Int(default_value=10),
    )

    youtube_video_comments = graphene.Field(
        YoutubeCommentsResponse,
        video_id=graphene.String(required=True),
        page_token = graphene.String(),
        max_results = graphene.Int(default_value=10),
    )

    @require_auth
    def resolve_viewer(self, info, **kwargs):
        return info.context.user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    @require_auth
    def resolve_viewer_posts(self, info, **kwargs):
        return Post.objects.filter(author=info.context.user).order_by(DEFAULT_POST_ORDERING)

    def resolve_all_posts(self, info, **kwargs):
        return Post.objects.all().order_by(DEFAULT_POST_ORDERING)

    @require_auth
    def resolve_viewer_video_playlist(self, info, **kwargs):
        try:
            return info.context.user.video_playlist_history
        except ObjectDoesNotExist:
            return VideoPlaylist.objects.create(user=info.context.user)


    def resolve_youtube_video_comments(self, info, video_id, page_token=None, max_results=10, **kwargs):
        try:
            return Helpers.process_youtube_video_comments(video_id, page_token, max_results)
        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")


    def resolve_youtube_video_categories(self,info, category_id, page_token=None, max_results=10, **kwargs):
        max_results = min(max_results, 50)
        try:
            url = 'https://www.googleapis.com/youtube/v3/videoCategories'
            search_params = {
                'part': 'snippet',
                'type': 'video',
                'videoCategoryId': category_id,
                'maxResults': max_results,
                'q': 'trending',
                'regionCode': 'US',
                'relevanceLanguage': 'en',
                'safeSearch': 'moderate',
                'order': 'relevance',
                'key': settings.GOOGLE_API_KEY
            }

            if page_token:
                search_params['pageToken'] = page_token

            search_response = requests.get(url=url, params=search_params)
            search_response.raise_for_status()
            search_data = search_response.json()
            return Helpers.process_youtube_videos(search_data,category_id)

        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")


    def resolve_youtube_search_videos(self,info,query,after=None, max_results=10,**kwargs):
        max_results = min(max_results,50)

        try:
            videos_queryset = Video.objects.all()

            if query and query != 'trending':
                videos_queryset = videos_queryset.filter(query__icontains=query)

            videos_queryset = videos_queryset.order_by('-published_at','video_id')

            if after:
                try:
                    cursor_data = json.loads(base64.b64decode(after).decode('utf-8'))
                    cursor_published_at = cursor_data['published_at']
                    cursor_video_id = cursor_data['video_id']

                    videos_queryset = videos_queryset.filter(
                        Q(published_at__lt=cursor_published_at) |
                        (Q(published_at=cursor_published_at) & Q(video_id__gt=cursor_video_id))
                    )
                except(ValueError, KeyError, json.JSONDecodeError):
                    raise GraphQLError("Invalid cursor")

            videos_list = list(videos_queryset[:max_results + 1])

            has_next_page = len(videos_list) > max_results

            if has_next_page:
                videos_list= videos_list[:max_results]

            next_page_token = None

            if has_next_page and videos_list:
                last_video = videos_list[-1]

                cursor_data = {
                    "published_at": last_video.published_at.isoformat(),
                    'video_id': last_video.video_id
                }

                next_page_token = base64.b64encode(json.dumps(cursor_data).encode('utf-8')).decode('utf-8')

            return{
                'videos': videos_list,
                'next_page_token': next_page_token,
                'has_next_page': has_next_page,

            }

        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")




    # def resolve_youtube_search_videos(self, info,page_token, query='trending',max_results=10, **kwargs):
    #     max_results = min(max_results,50)
    #
    #     try:
    #         search_url = 'https://www.googleapis.com/youtube/v3/search'
    #         search_params = {
    #             'part': 'snippet',
    #             'type': 'video',
    #             'q': query,
    #             'maxResults': max_results,
    #             'regionCode': 'US',
    #             'relevanceLanguage': 'en',
    #             'safeSearch': 'moderate',
    #             'order': 'relevance',
    #             'key': settings.GOOGLE_API_KEY
    #         }
    #
    #         if page_token:
    #             search_params['pageToken'] = page_token
    #
    #         search_response = requests.get(url=search_url, params=search_params)
    #         search_response.raise_for_status()
    #         search_data = search_response.json()
    #         return Helpers.process_youtube_videos(search_data)
    #
    #     except Exception as err:
    #         raise GraphQLError(f"An error occurred: {str(err)}")


    @require_auth
    @sensitive_variables('access_token')
    def resolve_youtube_liked_videos(self, info, page_token=None, max_results=10, **kwargs):
        request = info.context
        access_token = request.COOKIES.get('google_access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('google_refresh_token')
            if refresh_token:
                try:
                    token_data = Helpers.refresh_google_id_token(refresh_token)
                    access_token = token_data['access_token']
                except Exception as err:
                    raise GraphQLError("Authentication required.Please log in with Google to access YouTube data.")
            else:
                raise GraphQLError("Authentication required.Please log in with Google to access YouTube data.")

        try:
            return Helpers.process_youtube_liked_videos(request,access_token, page_token, max_results)
        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")

class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()
    create_post = CreatePost.Field()
    edit_post = EditPost.Field()
    delete_post = DeletePost.Field()
    save_video_playlist = SaveVideoPlaylist.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
