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
        page_token=graphene.String(),
        max_results=graphene.Int(default_value=10),
    )
    youtube_liked_videos = graphene.Field(
        YoutubeVideoResponse,
        page_token=graphene.String(),
        max_results=graphene.Int(default_value=10),
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
        max_results = min(max_results, 50)

        try:
            url = 'https://www.googleapis.com/youtube/v3/commentThreads'
            params= {
                'part': 'snippet,replies',
                'videoId': video_id,
                'maxResults': max_results,
                'order': 'time',
                'textFormat': 'plainText',
                'key': settings.YOUTUBE_API_KEY
            }

            if page_token:
                params['pageToken'] = page_token

            comments_response = requests.get(url,params)

            comments_response.raise_for_status()

            data = comments_response.json()

            if not data.get('items'):

                return {
                    'comments_threads':[],
                    'next_page_token': None,
                    'total_results': 0,
                    'has_next_page': False
                }

            try:
                video_obj = Video.objects.get(video_id=video_id)
            except ObjectDoesNotExist:
                raise GraphQLError(f"Video with video id: {video_id} does not exist.")

            comments_threads = []

            for item in data.get('items', []):
                thread_id = item['id']
                snippet = item['snippet']
                top_level_comment = snippet['topLevelComment']

                thread_obj,_ = CommentThread.objects.get_or_create(
                    thread_id = thread_id,
                    defaults = {
                        'video': video_obj,
                        'can_reply': snippet.get('canReply', True),
                        'total_reply_count': snippet.get('totalReplyCount', 0),
                        'is_public': snippet.get('isPublic', True)
                    }
                )


                top_comment_snippet = top_level_comment['snippet']
                Comment.objects.get_or_create(
                    comment_id = top_level_comment['id'],
                    defaults = {
                        'thread':  thread_obj,
                        'author_display_name': top_comment_snippet.get('authorDisplayName',''),
                        'author_channel_url': top_comment_snippet.get('authorChannelUrl',''),
                        'parent_id': None,
                        'author_channel_id': top_comment_snippet.get('authorChannelId',{}).get('value',''),
                        'channel_id': top_comment_snippet.get('channelId',{}).get('value',''),
                        'viewer_rating': top_comment_snippet.get('viewerRating','none'),
                        'text_display': top_comment_snippet.get('textDisplay',''),
                        'text_original': top_comment_snippet.get('textOriginal',''),
                        'like_count': top_comment_snippet.get('likeCount',0),
                        'published_at': parse_datetime(top_comment_snippet.get('publishedAt')),
                        'updated_at': parse_datetime(top_comment_snippet.get('updatedAt')),

                    }
                )

                if 'replies' in item:
                    for reply in item['replies']['comments']:
                        reply_snippet = reply['snippet']
                        Comment.objects.get_or_create(
                            comment_id = reply['id'],
                            defaults = {
                                'thread':  thread_obj,
                                'author_display_name': reply_snippet.get('authorDisplayName',''),
                                'author_channel_url': reply_snippet.get('authorChannelUrl',''),
                                'author_channel_id': reply_snippet.get('authorChannelId',{}).get('value',''),
                                'parent_id': reply_snippet.get('parentId', {}).get('value', ''),
                                'text_display': reply_snippet.get('textDisplay',''),
                                'text_original': reply_snippet.get('textOriginal',''),
                                'can_rate': reply_snippet.get('canRate',True),
                                'view_rating': reply_snippet.get('viewRating','none'),
                                'like_count': reply_snippet.get('likeCount',0),
                                'published_at': parse_datetime(reply_snippet.get('publishedAt')),
                                'updated_at': parse_datetime(reply_snippet.get('updatedAt')),
                            }
                        )
                comments_threads.append(thread_obj)

            page_info = data.get('pageInfo', {})
            next_page_token = page_info.get('nextPageToken') if "nextPageToken" in page_info else None
            total_results = page_info.get('totalResults', 0)
            has_next_page = next_page_token is not None

            return {
                'comments_threads': comments_threads,
                'next_page_token': next_page_token,
                total_results: total_results,
                has_next_page: has_next_page
            }

        except requests.exceptions.RequestException as err:
            raise GraphQLError(f"Youtube API request failed: {str(err)}")
        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")



    def resolve_youtube_search_videos(self, info, query='trending', page_token=None, max_results=10, **kwargs):
        max_results = min(max_results, 50)
        try:
            search_url = 'https://www.googleapis.com/youtube/v3/search'
            search_params = {
                'part': 'snippet',
                'type': 'video',
                'q': query,
                'maxResults': max_results,
                'regionCode': 'US',
                'relevanceLanguage': 'en',
                'safeSearch': 'moderate',
                'order': 'relevance',
                'key': settings.YOUTUBE_API_KEY
            }

            if page_token:
                search_params['pageToken'] = page_token

            search_response = requests.get(url=search_url, params=search_params)
            search_response.raise_for_status()
            search_data = search_response.json()

            if not search_data.get('items'):
                return {
                    'videos': [],
                    'next_page_token': None,
                    'total_results': 0,
                    'has_next_page': False
                }
            video_items = search_data['items']
            video_ids = [item['id']['videoId'] for item in video_items]
            channel_ids = list(set([item['snippet']['channelId'] for item in video_items]))

            stats_url = 'https://www.googleapis.com/youtube/v3/videos'
            stats_params = {
                'part': 'statistics,contentDetails',
                'id': ','.join(video_ids),
                'regionCode': 'US',
                'key': settings.YOUTUBE_API_KEY
            }

            stats_response = requests.get(url=stats_url, params=stats_params)
            stats_response.raise_for_status()
            stats_data = stats_response.json()

            statistic_map = {}
            for item in stats_data.get('items', []):
                statistic_map[item['id']] = {
                    'view_count': item['statistics'].get('viewCount', 0),
                    'like_count': item['statistics'].get('likeCount', 0),
                    'comment_count': item['statistics'].get('commentCount', 0),
                    'duration': item['contentDetails']['duration']
                }

            channels_url = 'https://www.googleapis.com/youtube/v3/channels'

            channels_params = {
                'part': 'snippet,statistics',
                'id': ','.join(channel_ids),
                'key': settings.YOUTUBE_API_KEY
            }

            channel_response = requests.get(url=channels_url, params=channels_params)
            channel_response.raise_for_status()
            channel_data = channel_response.json()

            channel_map = {}

            for item in channel_data.get('items', []):
                thumbnails = item.get('snippet', {}).get('thumbnails', {})
                channel_logo = ''

                if thumbnails.get('high') and thumbnails['high'].get('url'):
                    channel_logo = thumbnails['high']['url']
                elif thumbnails.get('medium') and thumbnails['medium'].get('url'):
                    channel_logo = thumbnails['medium']['url']
                else:
                    channel_logo = thumbnails.get('default', {}).get('url', '')

                channel_map[item['id']] = {
                    'channel_title': item.get('snippet', {}).get('title', ''),
                    'channel_description': item.get('snippet', {}).get('description', ''),
                    'channel_logo': channel_logo,
                    'subscriber_count': item.get('statistics', {}).get('subscriberCount', 0)
                }

            videos = []

            for item in video_items:
                video_id = item['id']['videoId']
                published_at = parse_datetime(item['snippet']['publishedAt'])
                stats = statistic_map.get(video_id, {})
                channel_info = channel_map.get(item['snippet']['channelId'], {})

                defaults = {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnails_default': item['snippet'].get('thumbnails', {}).get('default', {}).get('url', ''),
                    'thumbnails_medium': item['snippet'].get('thumbnails', {}).get('medium', {}).get('url', ''),
                    'thumbnails_high': item['snippet'].get('thumbnails', {}).get('high', {}).get('url', ''),
                    'channel_id': item['snippet']['channelId'],
                    'channel_title': channel_info.get('channel_title', item['snippet']['channelTitle']),
                    'channel_description': channel_info.get('channel_description',
                                                            item['snippet'].get('channelDescription', '')),
                    'channel_logo': channel_info.get('channel_logo', item['snippet'].get('channelLogo', '')),
                    'published_at': published_at,
                    'subscriber_count': channel_info.get('subscriber_count', 0),
                    'category_id': item['snippet'].get('categoryId'),
                    'view_count': stats.get('view_count', 0),
                    'like_count': stats.get('like_count', 0),
                    'comment_count': stats.get('comment_count', 0),
                    'duration': stats.get('duration', '')
                }

                video_obj, _ = Video.objects.update_or_create(video_id=video_id, defaults=defaults)
                videos.append(video_obj)

            page_info = search_data.get('pageInfo', {})
            next_page_token = page_info.get('nextPageToken') if "nextPageToken" in page_info else None
            total_results = page_info.get('totalResults', 0)
            has_next_page = next_page_token is not None

            return {
                'videos': videos,
                'next_page_token': next_page_token,
                'total_results': total_results,
                'has_next_page': has_next_page
            }

        except requests.exceptions.RequestException as err:
            raise GraphQLError(f"Youtube API request failed: {str(err)}")
        except Exception as err:
            raise GraphQLError(f"An error occurred: {str(err)}")


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

        max_results = min(max_results, 50)

        try:

            youtube_api_url = 'https://www.googleapis.com/youtube/v3/videos'
            params = {
                'part': 'snippet,contentDetails,statistics',
                'myRating': 'like',
                'maxResults': max_results,
            }

            if page_token:
                params['pageToken'] = page_token

            headers = {
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json',
                'Content-Type': 'application/json'

            }

            response = requests.get(youtube_api_url, params=params, headers=headers)

            if response.status_code == 401:
                refresh_token = request.COOKIES.get('google_refresh_token')
                if refresh_token:
                    try:
                        token_data = Helpers.refresh_google_id_token(refresh_token)
                        access_token = token_data['access_token']

                        headers['Authorization'] = f'Bearer {access_token}'
                        response = requests.get(youtube_api_url, params=params, headers=headers)

                    except Exception as e:
                        raise GraphQLError("Token refresh failed. Please log in again.")
                else:
                    raise GraphQLError("Authentication expired. Please log in again.")

            if response.status_code == 403:
                try:
                    error_data = response.json()
                    error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', '')
                    if error_reason:
                        raise GraphQLError(
                            f"YouTube API access denied: {error_reason}. Please check your OAuth scopes and API configuration.")
                except Exception as err:
                    raise GraphQLError(f"An error occurred while fetching YouTube data: {str(err)}")

            response.raise_for_status()
            youtube_data = response.json()
            videos = []
            for item in youtube_data.get('items', []):
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

                video_obj, _ = Video.objects.get_or_create(video_id=item['id'], defaults=defaults)

                videos.append(video_obj)

            return {
                'videos': videos,
                'next_page_token': youtube_data.get('nextPageToken', '') if youtube_data.get('nextPageToken') else None,
                'total_results': youtube_data.get('pageInfo', {}).get('totalResults', 0),
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
