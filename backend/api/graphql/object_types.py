import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from api.graphql.filters import PostFilter, VideoHistoryFilter
from api.models import User, Post, PostImage, VideoPlaylist, Video, VideoPlaylistEntries

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


class VideoPlaylistEntryNode(DjangoObjectType):
    class Meta:
        model = VideoPlaylistEntries
        interfaces = (relay.Node,)
        fields = '__all__'

class VideoPlaylistNode(DjangoObjectType):
    video_entries = DjangoFilterConnectionField(VideoPlaylistEntryNode,filterset_class= VideoHistoryFilter)
    class Meta:
        model = VideoPlaylist
        interfaces = (relay.Node,)
        fields = '__all__'

class YoutubeVideoResponse(graphene.ObjectType):
    videos = graphene.List(VideoNode)
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
