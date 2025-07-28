from functools import wraps
import requests
import graphene
import requests.exceptions
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils.dateparse import parse_datetime
from django.views.decorators.debug import sensitive_variables
from graphql_auth.schema import MeQuery
from graphene_django.filter import DjangoFilterConnectionField

from api.helpers import Helpers
from api.models import User, Post, VideoPlaylist, Video
from graphql import GraphQLError
from api.graphql.mutations import UserSerializerMutation, CreatePost, EditPost, DeletePost, SaveVideoPlaylist
from api.graphql.object_types import UserTypes, PostNode, VideoPlaylistNode, YoutubeVideoResponse

DEFAULT_POST_ORDERING= '-created_at'


def require_auth(func):
    @wraps(func)
    def wrapper(self,info,**kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Not Authenticated")
        return func(self,info,**kwargs)
    return  wrapper


class Query(MeQuery, graphene.ObjectType):
    all_users = graphene.List(UserTypes)
    viewer = graphene.Field(UserTypes)
    viewer_posts = DjangoFilterConnectionField(PostNode)
    all_posts = DjangoFilterConnectionField(PostNode)
    viewer_video_playlist = graphene.Field(VideoPlaylistNode)
    youtube_liked_videos = graphene.Field(
        YoutubeVideoResponse,
        page_token=graphene.String(),
        max_results=graphene.Int(default_value=10),
    )

    @require_auth
    def resolve_viewer(self, info, **kwargs):
        return info.context.user

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    @require_auth
    def resolve_viewer_posts(self, info, **kwargs):
        return  Post.objects.filter(author=info.context.user).order_by(DEFAULT_POST_ORDERING)

    def resolve_all_posts(self,info,**kwargs):
        return Post.objects.all().order_by(DEFAULT_POST_ORDERING)

    @require_auth
    def resolve_viewer_video_playlist(self,info,**kwargs):
        try:
            return info.context.user.video_playlist_history
        except ObjectDoesNotExist:
            return  VideoPlaylist.objects.create(user=info.context.user)

    @require_auth
    @sensitive_variables('access_token')
    def resolve_youtube_liked_videos(self,info,page_token=None,max_results=10,**kwargs):

        request = info.context
        access_token = request.COOKIES.get('google_access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('google_refresh_token')
            if refresh_token:
                try:
                    token_data =  Helpers.refresh_google_id_token(refresh_token)
                    access_token = token_data['access_token']
                except Exception as err:
                    raise  GraphQLError("Authentication required.Please log in with Google to access YouTube data.")
            else:
                raise  GraphQLError("Authentication required.Please log in with Google to access YouTube data.")

        max_results = min(max_results,50)

        try:

            youtube_api_url = 'https://www.googleapis.com/youtube/v3/videos'
            params = {
                'part' : 'snippet,contentDetails,statistics',
                'myRating':'like',
                'maxResults': max_results,
            }

            if page_token:
                params['pageToken'] = page_token

            headers = {
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            }

            response = requests.get(youtube_api_url,params=params,headers=headers)

            if response.status_code == 401:
                refresh_token = request.COOKIES.get('google_refresh_token')
                if refresh_token:
                    try:
                        token_data = Helpers.refresh_google_id_token(refresh_token)
                        access_token = token_data['access_token']

                        headers['Authorization'] = f'Bearer {access_token}'
                        response = requests.get(youtube_api_url,params=params,headers=headers)

                    except Exception as e:
                        raise GraphQLError("Token refresh failed. Please log in again.")
                else:
                    raise GraphQLError("Authentication expired. Please log in again.")

            if response.status_code == 403:
                try:
                    error_data = response.json()
                    error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', '')
                    if error_reason:
                        raise GraphQLError( f"YouTube API access denied: {error_reason}. Please check your OAuth scopes and API configuration.")
                except Exception as err:
                    raise GraphQLError(f"An error occurred while fetching YouTube data: {str(err)}")

            response.raise_for_status()
            youtube_data = response.json()
            videos = []
            for item in youtube_data.get('items',[]):
                published_at_str = item['snippet']['publishedAt']
                published_at = parse_datetime(published_at_str)
                defaults = {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail_default': item['snippet'].get('thumbnails', {}).get('default', {}).get('url', ''),
                    'thumbnail_medium': item['snippet'].get('thumbnails', {}).get('medium', {}).get('url', ''),
                    'thumbnail_high': item['snippet'].get('thumbnails', {}).get('high', {}).get('url', ''),
                    'channel_id': item['snippet']['channelId'],
                    'channel_title': item['snippet']['channelTitle'],
                    'channel_description': item['snippet'].get('channelDescription', ''),
                    'channel_logo': item['snippet'].get('channelLogo', ''),
                    'published_at': published_at,
                    'category_id': item['snippet'].get('categoryId'),
                    'view_count': item['statistics'].get('viewCount', 0),
                    'like_count': item['statistics'].get('likeCount', 0),
                    'comment_count': item['statistics'].get('commentCount', 0),
                    'duration': item['contentDetails']['duration']

                }

                video_obj, _ = Video.objects.get_or_create( video_id=item['id'], defaults=defaults)

                videos.append(video_obj)

            return {
                'videos': videos,
                'next_page_token': youtube_data.get('nextPageToken','') if youtube_data.get('nextPageToken') else None,
                'total_results': youtube_data.get('pageInfo',{}).get('totalResults',0),
                'has_next_page': 'nextPageToken' in youtube_data
            }
        except requests.exceptions.RequestException as err:
            raise GraphQLError(f"Youtube API request failed: {str(err)}")
        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")


class Mutation(graphene.ObjectType):
    user_update = UserSerializerMutation.Field()
    create_post = CreatePost.Field()
    edit_post = EditPost.Field()
    delete_post = DeletePost.Field()
    save_video_playlist = SaveVideoPlaylist.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
