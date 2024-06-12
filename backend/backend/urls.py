from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

from backend import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("api.videos.urls")),
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
