from django.urls import path, include

from api import views

urlpatterns = [
    path('', views.Root.as_view(), name='root'),
]