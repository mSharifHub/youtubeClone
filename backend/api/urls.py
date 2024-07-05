from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_file_upload.django import FileUploadGraphQLView
from graphql_jwt.decorators import jwt_cookie

urlpatterns = [
    # Graphql
    path("graphql/", jwt_cookie(csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True)))),

]
