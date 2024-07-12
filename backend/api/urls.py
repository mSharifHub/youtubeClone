from django.urls import path
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie
urlpatterns = [
    # Graphql
    path("graphql/", csrf_protect(jwt_cookie(FileUploadGraphQLView.as_view(graphiql=True)))),

]
