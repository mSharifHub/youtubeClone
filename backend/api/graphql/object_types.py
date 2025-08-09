import graphene
from django.core.exceptions import ObjectDoesNotExist
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from api.graphql.filters import PostFilter, VideoHistoryFilter
from api.models import User, Post, PostImage, VideoPlaylist, Video, VideoPlaylistEntries, Comment, CommentThread

class UserTypes(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            'google_sub',
            "first_name",
            "last_name",
            'username',
            'is_staff',
            'profile_picture',
            'bio',
            'subscribers',
            'is_verified',
            'is_active',
            'email',
            'youtube_handler',
            'posts'
        )

    profile_picture = graphene.String()

    def resolve_profile_picture(self, info):
        if self.profile_picture:
            picture_url = info.context.build_absolute_uri(self.profile_picture.url)
            return picture_url
        return None

class PostImageTypes(DjangoObjectType):
    image = graphene.String()
    class Meta:
        model = PostImage
        fields = ('id',)

    def resolve_image(self, info):
        if  self.image and hasattr(self.image, "url"):
            return info.context.build_absolute_uri(self.image.url)
        return None

class VideoNode(DjangoObjectType):
    class Meta:
        model = Video
        interfaces = (relay.Node,)
        fields = '__all__'


class YoutubeVideoRating(graphene.ObjectType):
    video_id = graphene.String()
    rating = graphene.String()

class YoutubeVideoRatingResponse(graphene.ObjectType):
    rating = graphene.Field(YoutubeVideoRating)
    etag= graphene.String()

class YoutubeVideoRateResponse(graphene.ObjectType):
    succcess: graphene.Boolean()
    message: graphene.String()

class CommentNode(DjangoObjectType):
    parent_comment = graphene.Field(lambda : CommentNode)
    replies = graphene.List(lambda : CommentNode)

    class Meta:
        model = Comment
        interfaces = (relay.Node,)
        fields = '__all__'

    def resolve_parent_comment(self,info):
        if self.parent_id:
            try:
                return Comment.objects.get(comment_id=self.parent_id)
            except ObjectDoesNotExist:
                return None
        return None

    def resolve_replies(self,info):
        return Comment.objects.filter(parent_id = self.comment_id)

class CommentThreadNode(DjangoObjectType):
        top_level_comment = graphene.Field(CommentNode)
        replies = graphene.List(CommentNode)
        class Meta:
            model = CommentThread
            interfaces = (relay.Node,)
            fields = '__all__'

        def resolve_top_level_comment(self,info):
            return self.comments.filter(parent_id__isnull=True).first()

        def resolve_replies(self,info):
            return self.comments.filter(parent_id__isnull=False).order_by('created_at')


class VideoPlaylistEntryNode(DjangoObjectType):
    class Meta:
        model = VideoPlaylistEntries
        interfaces = (relay.Node,)
        fields = '__all__'

class VideoPlaylistNode(DjangoObjectType):
    video_entries = DjangoFilterConnectionField(VideoPlaylistEntryNode,filterset_class=VideoHistoryFilter)
    class Meta:
        model = VideoPlaylist
        interfaces = (relay.Node,)
        fields = '__all__'

class YoutubeVideoResponse(graphene.ObjectType):
    videos = graphene.List(VideoNode)
    next_page_token = graphene.String()
    total_results = graphene.Int()
    has_next_page = graphene.Boolean()

class YoutubeCommentsResponse(graphene.ObjectType):
   comments_threads = graphene.List(CommentThreadNode)
   next_page_token = graphene.String()
   total_results = graphene.Int()
   has_next_page = graphene.Boolean()

class PostNode(DjangoObjectType):
    profile_picture = graphene.String()

    class Meta:
        model = Post
        interfaces = (relay.Node,)
        fields = '__all__'
        filterset_class = PostFilter

    def resolve_images(self,info):
        return  self.images.all()

    def resolve_profile_picture(self:Post,info):
        if self.author and self.author.profile_picture:
            return info.context.build_absolute_uri(self.author.profile_picture.url)
        return  None