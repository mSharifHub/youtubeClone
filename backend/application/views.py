from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


def test_local(request):
    return JsonResponse({'payload': '--local test successfully'})
