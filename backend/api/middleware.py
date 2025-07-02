from django.middleware.csrf import get_token as get_csrf_token



class CustomCSRFMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        token = get_csrf_token(request)
        if token:
            response['X-CSRFToken'] = token
        return response

