from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_root(request):
    return JsonResponse({"message": "test root"})
