from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView


class Root(APIView):
    def get(self, request):
        return JsonResponse({'message': 'this is root of Youtube Clone'})
