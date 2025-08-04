from django.core.exceptions import ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.utils.dateparse import parse_datetime
from graphql import GraphQLError
from api.models import User, Video, CommentThread, Comment
import requests
from django.core.cache import cache
from backend import settings

class Helpers:
    @staticmethod
    def handle_api_error(response):
        if response.status_code == 403:
            try:
                error_data = response.json()
                error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', '')
                if error_reason:
                    raise GraphQLError(
                        f"YouTube API access denied: {error_reason}. Please check your OAuth scopes and API configuration.")
            except Exception as err:
                raise GraphQLError(f"An error occurred while fetching YouTube data: {str(err)}")

    @staticmethod
    def build_youtube_api_params(base_params, page_token=None, max_results=10):
        params = {
            'max_results': max_results,
            'regionCode': 'US',
            'key': settings.GOOGLE_API_KEY,
            **base_params
        }

        if page_token:
            params['page_token'] = page_token
        return params


    @staticmethod
    def fetch_channel_details(channel_ids):
        if not channel_ids:
            return {}

        cached_channels = {}
        uncached_channel_ids = []

        for channel_id in channel_ids:
            cache_key = f'channel_details_{channel_id}'
            cache_data = cache.get(cache_key)

            if cache_data:
                cached_channels[channel_id] = cache_data
            else:
                uncached_channel_ids.append(channel_id)

        if not uncached_channel_ids:
            return cached_channels

        channels_url = 'https://www.googleapis.com/youtube/v3/channels'
        channels_params = {
            'part': 'snippet,statistics',
            'id': ','.join(uncached_channel_ids),
            'key': settings.GOOGLE_API_KEY
        }

        try:
            channel_response = requests.get(url=channels_url, params=channels_params)
            channel_response.raise_for_status()
            channel_data = channel_response.json()
        except requests.exceptions.RequestException as e:
            raise GraphQLError(f"Failed to fetch channel details: {str(e)}")

        channel_map = cached_channels.copy()

        for item in channel_data.get('items', []):
            thumbnails = item.get('snippet', {}).get('thumbnails', {})
            channel_logo = ''

            if thumbnails.get('high') and thumbnails['high'].get('url'):
                channel_logo = thumbnails['high']['url']
            elif thumbnails.get('medium') and thumbnails['medium'].get('url'):
                channel_logo = thumbnails['medium']['url']
            else:
                channel_logo = thumbnails.get('default', {}).get('url', '')

            channel_info ={
                'channel_title': item.get('snippet', {}).get('title', ''),
                'channel_description': item.get('snippet', {}).get('description', ''),
                'channel_logo': channel_logo,
                'subscriber_count': item.get('statistics', {}).get('subscriberCount', 0)
            }
            channel_map[item['id']] = channel_info
            cache_key = f"channel_details_{item['id']}"
            cache.set(cache_key, channel_info, 3600)

        return channel_map

    @staticmethod
    def get_profile_picture(user: User, first_name: str, last_name: str, profile_picture_url: str):

        current_profile_picture_content = None

        if user.profile_picture:
            try:
                with open(user.profile_picture.path, 'rb') as current_profile_picture:
                    current_profile_picture_content = current_profile_picture.read()
            except FileNotFoundError:
                current_profile_picture_content = None

        if profile_picture_url:
            try:
                response = requests.get(profile_picture_url)
                response.raise_for_status()
            except requests.exceptions.RequestException:
                return None

            new_profile_picture_content = response.content

            if  current_profile_picture_content != new_profile_picture_content:
                if user.profile_picture:
                    user.profile_picture.delete(save=False)

                profile_picture = ContentFile(new_profile_picture_content)
                file_name = f"{first_name}_{last_name}_profile_picture.jpg"
                user.profile_picture.save(file_name, profile_picture, save=False)
                user.save()

        return None

    @staticmethod
    def refresh_google_id_token(google_refresh_token):
        token_url = 'https://oauth2.googleapis.com/token'
        data = {
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'refresh_token': google_refresh_token,
            'grant_type': 'refresh_token',
        }

        try:
            response = requests.post(token_url, data=data)
            response.raise_for_status()
            token_data = response.json()

            if 'error' in token_data:
                raise Exception(f"Google token refresh error {token_data['error']}")

            return token_data

        except requests.exceptions.RequestException as e:
            raise Exception(f"Google token refresh error {str(e)}")


    @staticmethod
    def fetch_video_statistics(video_ids):
        url = 'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'part': 'statistics,contentDetails,snippet',
            'id': video_ids,
            'key': settings.GOOGLE_API_KEY
        }

        stats_response = requests.get(url=url, params=params)
        stats_response.raise_for_status()
        return stats_response.json()

    @staticmethod
    def build_video_defaults(item,stats,channel_info,query,category_id):
        return {
            'title': item['snippet']['title'],
            'description': item['snippet']['description'],
            'thumbnails_default': item['snippet'].get('thumbnails', {}).get('default', {}).get('url', ''),
            'thumbnails_medium': item['snippet'].get('thumbnails', {}).get('medium', {}).get('url', ''),
            'thumbnails_high': item['snippet'].get('thumbnails', {}).get('high', {}).get('url', ''),
            'channel_id': item['snippet']['channelId'],
            'channel_title': channel_info.get('channel_title', item['snippet']['channelTitle']),
            'channel_description': channel_info.get('channel_description',item['snippet'].get('channelDescription', '')),
            'channel_logo': channel_info.get('channel_logo', item['snippet'].get('channelLogo', '')),
            'published_at': parse_datetime(item['snippet']['publishedAt']),
            'subscriber_count': channel_info.get('subscriber_count', 0),
            'category_id': category_id,
            'view_count': stats.get('view_count', 0),
            'like_count': stats.get('like_count', 0),
            'comment_count': stats.get('comment_count', 0),
            'duration': stats.get('duration', ''),
            'query': query
        }

    @staticmethod
    def build_response(search_data, videos):
        page_info = search_data.get('pageInfo', {})
        total_results = page_info.get('totalResults', 0)
        next_page_token = search_data.get('nextPageToken')
        has_next_page = next_page_token is not None

        return {
            'videos': videos,
            'next_page_token': next_page_token,
            'total_results': total_results,
            'has_next_page': has_next_page
        }

    @staticmethod
    def process_youtube_videos(search_data, query=None, category_id=None):
        if not search_data.get('items'):
            return{
                'videos': [],
                'next_page_token': None,
                'total_results': 0,
                'has_next_page': False
            }

        video_items = search_data['items']
        video_ids = list(set([item['id']['videoId'] for item in video_items]))
        channel_ids = list(set([item['snippet']['channelId'] for item in video_items]))

        cached_videos = {}
        uncached_video_ids = []

        for video_id in video_ids:
            cache_key = f"video_details_{video_id}"
            cached_details = cache.get(cache_key)

            if cached_details:
                cached_videos[video_id] = cached_details
            else:
                uncached_video_ids.append(video_id)

        channel_map = Helpers.fetch_channel_details(channel_ids)
        statistic_map = cached_videos.copy()

        if uncached_video_ids:
            stats_data = Helpers.fetch_video_statistics(uncached_video_ids)

            for item in stats_data.get('items', []):
                video_stats ={
                    'view_count': int(item['statistics'].get('viewCount', 0)),
                    'like_count': int(item['statistics'].get('likeCount', 0)),
                    'comment_count': int(item['statistics'].get('commentCount', 0)),
                    'duration': item['contentDetails']['duration'],
                    'category_id': item['snippet'].get('categoryId', ''),

                }

                statistic_map[item['id']] = video_stats
                cache_key = f"video_details_{item['id']}"
                cache.set(cache_key, video_stats, 3600)

        videos = []

        for item in video_items:
            video_id = item['id']['videoId']
            stats = statistic_map.get(video_id, {})
            channel_info = channel_map.get(item['snippet']['channelId'], {})
            video_category_id =  stats.get('category_id')
            defaults = Helpers.build_video_defaults(item,stats,channel_info,query,video_category_id)
            video_obj, _ = Video.objects.update_or_create(video_id=video_id,defaults=defaults)
            videos.append(video_obj)
        return Helpers.build_response(search_data, videos)



    @staticmethod
    def process_youtube_video_comments(video_id, page_token=None, max_results=10):
        if not video_id or not isinstance(video_id, str):
            raise GraphQLError("Invalid video_id provided ")

        try:
            url = 'https://www.googleapis.com/youtube/v3/commentThreads'
            params = Helpers.build_youtube_api_params({
                'part': 'snippet,replies',
                'videoId': video_id,
                'order': 'time',
                'textFormat': 'plainText',
            }, page_token, max_results)


            comments_response = requests.get(url, params)
            Helpers.handle_api_error(comments_response)
            comments_data = comments_response.json()

            if not comments_data.get('items'):
                return {
                    'comments_threads': [],
                    'next_page_token': None,
                    'total_results': 0,
                    'has_next_page': False
                }

            try:
                video_obj = Video.objects.get(video_id=video_id)
            except ObjectDoesNotExist:
                raise GraphQLError(f"Video with video id: {video_id} does not exist.")

            comments_threads = []

            for item in comments_data.get('items', []):
                thread_id = item['id']
                snippet = item['snippet']
                top_level_comment = snippet['topLevelComment']

                thread_obj, _ = CommentThread.objects.get_or_create(
                    thread_id=thread_id,
                    defaults={
                        'video': video_obj,
                        'can_reply': snippet.get('canReply', True),
                        'total_reply_count': snippet.get('totalReplyCount', 0),
                        'is_public': snippet.get('isPublic', True)
                    }
                )

                top_comment_snippet = top_level_comment['snippet']
                Comment.objects.get_or_create(
                    comment_id=top_level_comment['id'],
                    defaults={
                        'thread': thread_obj,
                        'author_display_name': top_comment_snippet.get('authorDisplayName', ''),
                        'author_channel_url': top_comment_snippet.get('authorChannelUrl', ''),
                        'parent_id': None,
                        'author_channel_id': top_comment_snippet.get('authorChannelId', ''),
                        'channel_id': top_comment_snippet.get('channelId', ''),
                        'viewer_rating': top_comment_snippet.get('viewerRating', 'none'),
                        'text_display': top_comment_snippet.get('textDisplay', ''),
                        'text_original': top_comment_snippet.get('textOriginal', ''),
                        'like_count': top_comment_snippet.get('likeCount', 0),
                        'published_at': parse_datetime(top_comment_snippet.get('publishedAt')),
                        'updated_at': parse_datetime(top_comment_snippet.get('updatedAt')),

                    }
                )

                if 'replies' in item:
                    for reply in item['replies']['comments']:
                        reply_snippet = reply['snippet']
                        Comment.objects.get_or_create(
                            comment_id=reply['id'],
                            defaults={
                                'thread': thread_obj,
                                'author_display_name': reply_snippet.get('authorDisplayName', ''),
                                'author_channel_url': reply_snippet.get('authorChannelUrl', ''),
                                'author_channel_id': reply_snippet.get('authorChannelId', ''),
                                'parent_id': reply_snippet.get('parentId', ''),
                                'text_display': reply_snippet.get('textDisplay', ''),
                                'text_original': reply_snippet.get('textOriginal', ''),
                                'can_rate': reply_snippet.get('canRate', True),
                                'viewer_rating': reply_snippet.get('viewerRating', 'none'),
                                'like_count': reply_snippet.get('likeCount', 0),
                                'published_at': parse_datetime(reply_snippet.get('publishedAt')),
                                'updated_at': parse_datetime(reply_snippet.get('updatedAt')),
                            }
                        )
                comments_threads.append(thread_obj)

            page_info = comments_data.get('pageInfo', {})
            total_results = comments_data.get('totalResults', 0)
            next_page_token = comments_data.get('nextPageToken')
            has_next_page = next_page_token is not None

            return{
                'comments_threads': comments_threads,
                'next_page_token': next_page_token,
                'total_results': total_results,
                'has_next_page': has_next_page
            }

        except requests.exceptions.RequestException as err:
            raise Exception(f"Youtube API request failed: {str(err)}")


    @staticmethod
    def process_youtube_liked_videos(request,access_token, page_token=None, max_results=10):
        max_results = min(max(max_results,1) ,50)
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

            Helpers.handle_api_error(response)

            response.raise_for_status()
            youtube_data = response.json()

            if not youtube_data.get('items'):
                return {
                    'videos': [],
                    'next_page_token': None,
                    'total_results': 0,
                    'has_next_page': False
                }

            video_items =youtube_data.get('items', [])
            channel_ids = list(set([item['snippet']['channelId'] for item in video_items]))
            channel_map = Helpers.fetch_channel_details(channel_ids)

            videos = []
            for item in youtube_data.get('items', []):
                published_at_str = item['snippet']['publishedAt']
                published_at = parse_datetime(published_at_str)
                channel_info = channel_map.get(item['snippet']['channelId'], {})
                defaults = {
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnails_default': item['snippet'].get('thumbnails', {}).get('default', {}).get('url', ''),
                    'thumbnails_medium': item['snippet'].get('thumbnails', {}).get('medium', {}).get('url', ''),
                    'thumbnails_high': item['snippet'].get('thumbnails', {}).get('high', {}).get('url', ''),
                    'channel_id': item['snippet']['channelId'],
                    'channel_title': channel_info.get('channel_title', ''),
                    'channel_description': channel_info.get('channel_description', item['snippet'].get('channelDescription', '')),
                    'channel_logo': channel_info.get('channel_logo',item['snippet'].get('channelLogo', '')),
                    'subscriber_count': channel_info.get('subscriber_count', 0),
                    'published_at': published_at,
                    'category_id': item['snippet'].get('categoryId', ''),
                    'view_count': item['statistics'].get('viewCount', 0),
                    'like_count': item['statistics'].get('likeCount', 0),
                    'comment_count': item['statistics'].get('commentCount', 0),
                    'duration': item['contentDetails']['duration']

                }

                video_obj, _ = Video.objects.get_or_create(video_id=item['id'], defaults=defaults)

                videos.append(video_obj)

            return {
                'videos': videos,
                'next_page_token': youtube_data.get('nextPageToken', '') ,
                'total_results': youtube_data.get('pageInfo', {}).get('totalResults', 0),
                'has_next_page': 'nextPageToken' in youtube_data
            }
        except requests.exceptions.RequestException as err:
            raise GraphQLError(f"Youtube API request failed: {str(err)}")