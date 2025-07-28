
from django.conf import settings
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .util import get_google_id_token, generate_youtube_handler
from graphql_jwt import exceptions
from django.contrib.auth import get_user_model
from jwt import InvalidTokenError, InvalidIssuerError
from django.views.decorators.debug import sensitive_variables
from django.urls import reverse
from api.helpers import Helpers

User = get_user_model()

class GoogleLoginView(APIView):
    @sensitive_variables('code', 'client_id')
    def get(self, request):
        client_id = settings.GOOGLE_CLIENT_ID
        redirect_uri = request.build_absolute_uri(reverse('google-callback'))

        scopes = [
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "openid",
        ]

        scope_str = " ".join(scopes)
        access_type = "offline"

        login_hint = request.query_params.get('login_hint', None)

        auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"response_type=code&access_type={access_type}&"
            f"redirect_uri={redirect_uri}&scope={scope_str}&"
            f"client_id={client_id}"
        )

        if login_hint:
            auth_url += f"&login_hint={login_hint}&prompt=none"
        else:
            auth_url += "&prompt=consent"


        return redirect(auth_url)


class GoogleAuthCallBackView(APIView):
    @sensitive_variables('code', 'details', 'token', 'refresh_token')
    @method_decorator(csrf_exempt)
    def get(self, request):
        # 1 Gets the code from the query
        code = request.query_params.get('code', None)
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)
        # 2 Gets the user data
        try:
            token_details = get_google_id_token(code)
            id_info = token_details['id_info']
            google_refresh_token = token_details.get('refresh_token',None)
            google_expires_in = token_details['expires_in']
            google_access_token = token_details['access_token']
            sub = id_info['sub']
            email = id_info['email']
            email_verified = id_info['email_verified']
            first_name = id_info['given_name']
            last_name = id_info['family_name']
            profile_picture_url = id_info['picture']



            # 3 Checks if user email is verified
            if not email_verified:
                return Response({'error': 'Email verification required. Verify with Google before authenticating'},
                                status=status.HTTP_401_UNAUTHORIZED)

            # 4 Checks if user already exists
            try:
                user = User.objects.get(email=email)
                user.save()

            except User.DoesNotExist:
                youtube_handler = generate_youtube_handler(first_name, last_name, )
                user_data = {
                    'google_sub': sub,
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'youtube_handler': youtube_handler,
                    'email': email,
                    'is_verified': True,
                    'is_active': True
                }
                serializer = UserSerializer(data=user_data)

                if serializer.is_valid():
                    user = serializer.save()
                    user.save()

                else:
                    return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            Helpers.get_profile_picture(user, first_name, last_name, profile_picture_url)


            response = redirect(f"{settings.CLIENT_ADDRESS}?success=true")

            response.set_cookie(
                'google_id_token',
                token_details['id_token'],
                httponly=True,
                max_age=google_expires_in,
                samesite='Strict',
                secure=True
            )

            # storing google tokens on cookies
            response.set_cookie(
                'google_access_token',
                google_access_token,
                httponly=True,
                max_age=google_expires_in,
                samesite='Strict',
                secure= True
            )

            if google_refresh_token:
                response.set_cookie(
                    'google_refresh_token',
                    google_refresh_token,
                    httponly=True,
                    max_age=14 * 24 * 3600,  # 14 days
                    samesite='Strict',
                    secure=True
                )

            return response
        except Exception as err:
            return Response({'error': f"Token exchanged failed: {err}"}, status=status.HTTP_400_BAD_REQUEST)


# class YoutubeLikedVideosView(APIView):
#     @sensitive_variables('access_token')
#     def get(self,request):
#         access_token = request.COOKIES.get('google_access_token')
#
#         if not access_token:
#             refresh_token = request.COOKIES.get('google_refresh_token')
#             if refresh_token:
#                 try:
#                     refreshed_token = Helpers.refresh_google_id_token(refresh_token)
#                     access_token = refreshed_token['access_token']
#                 except Exception as err:
#                     return Response({
#                         'error': f"Error refreshing google token: {err}",
#                         'message': 'Please login again'
#                     }, status=status.HTTP_401_UNAUTHORIZED)
#             else:
#                 return Response({
#                     'error': 'Google token not found',
#                     'message': 'Please login again'
#                 },status=status.HTTP_401_UNAUTHORIZED)
#
#         page_token = request.query_params.get('page_token','')
#         max_results = min(int(request.query_params.get('max_results', 10)), 50)
#
#         try:
#             youtube_api_url = 'https://www.googleapis.com/youtube/v3/videos'
#             params = {
#                 'part':'snippet,statistics,contentDetails',
#                 'myRating':'like',
#                 'maxResults':max_results,
#                 'key': settings.GOOGLE_CLIENT_ID
#             }
#
#             if page_token:
#                 params['pageToken'] = page_token
#
#             headers = {
#                 "Authorization": f"Bearer {access_token}",
#                 'Accept': 'application/json'
#             }
#
#             response = request.get(youtube_api_url, params=params, headers=headers)
#
#             if response.status_code == 401:
#                 refresh_token = request.COOKIES.get('google_refresh_token')
#                 if refresh_token:
#                     try:
#                         new_token = Helpers.refresh_google_id_token(refresh_token)
#                         access_token = new_token['access_token']
#
#                         headers['Authorization'] = f'Bearer {access_token}'
#                         response = request.get(youtube_api_url, params=params, headers=headers)
#
#                         django_response = Response(response.json(), status=response.status_code)
#
#                         django_response.set_cookie(
#                             'google_access_token',
#                             access_token,
#                             httponly=True,
#                             max_age=new_token['expires_in'],
#                             samesite='Strict',
#                             secure=True
#                         )
#
#                         return django_response
#                     except Exception as err:
#                         return Response({
#                             'error': f"Error refreshing google token: {err}",
#                             'message': 'Please login again'
#                         }, status=status.HTTP_401_UNAUTHORIZED)
#                 else:
#                     return Response({
#                         'error': 'Google token not found',
#                         'message': 'Please login again'
#                     },status=status.HTTP_401_UNAUTHORIZED)
#
#             response.raise_for_status()
#             youtube_data = response.json()
#
#             processed_videos  =[]
#
#             for  item in youtube_data.get('items',[]):
#                 video_data = {
#                     'id': item['id'],
#                     'title': item['snippet']['title'],
#                     'description': item['snippet']['description'],
#                     'published_at': item['snippet']['publishedAt'],
#                     'thumbnail_url': item['snippet']['thumbnails']['medium']['url'],
#                     'channel_title': item['snippet']['channelTitle'],
#                     'view_count': item['statistics'].get('viewCount',0),
#                     'like_count': item['statistics'].get('likeCount',0),
#                     'duration': item['contentDetails']['duration']
#                 }
#                 processed_videos.append(video_data)
#
#             return Response({
#                 'videos': processed_videos,
#                 'next_page_token': youtube_data.get('nextPageToken',''),
#                 'total_results': youtube_data.get('pageInfo',{}).get('totalResults',0),
#             })
#
#         except request.exceptions.RequestException as err:
#             return Response({
#                 'error': f"Error fetching youtube data: {err}",
#                 'message': f"{str(err)}"
#             },status = status.HTTP_400_BAD_REQUEST)
#


class LogoutView(APIView):
    def post(self, request):
        pass






