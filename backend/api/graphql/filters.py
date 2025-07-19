
from django_filters  import FilterSet, OrderingFilter

from api.models import Post, VideoHistory


class PostFilter(FilterSet):
    order_by = OrderingFilter(fields=('created_at','created_at'),)

    class Meta:
        model = Post

        fields = {
            'author': ['exact'],
            'content': ['icontains'],
            'created_at': ['exact', 'gt', 'lt'],
        }


class VideoHistoryFilter(FilterSet):
    class Meta:
        model = VideoHistory
        fields = '__all__'
