from django.urls import path
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie

from api.views import GoogleLoginView, GoogleAuthCallBackView, LogoutView

urlpatterns = [

    path('api/auth/google/', GoogleLoginView.as_view(), name='google-login'),

    path('api/auth/google/callback/', GoogleAuthCallBackView.as_view(), name='google-callback'),


    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    # Graphql
    path("graphql/", csrf_protect(FileUploadGraphQLView.as_view(graphiql=True))),

    # path("graphql/", csrf_protect(jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True)))),
    # path("graphql/", csrf_exempt(jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True)))),

]
