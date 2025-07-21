from django_filters import FilterSet, OrderingFilter, DateTimeFromToRangeFilter

from api.models import Post, VideoPlaylistEntries


class PostFilter(FilterSet):
    order_by = OrderingFilter(fields=('created_at', 'created_at'), )

    class Meta:
        model = Post

        fields = {
            'author': ['exact'],
            'content': ['icontains'],
            'created_at': ['exact', 'gt', 'lt'],
        }


class VideoHistoryFilter(FilterSet):
    watched_at = DateTimeFromToRangeFilter()
    order_by = OrderingFilter(fields=('watched_at', 'watched_at'), )

    class Meta:
        model = VideoPlaylistEntries
        fields = [ 'video', 'watched_at']
