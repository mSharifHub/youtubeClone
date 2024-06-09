from django.contrib import admin
from django.urls import path, include
from .views import get_root

urlpatterns = [
    path('', get_root, name='root'),
]