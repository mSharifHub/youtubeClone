import graphene
from graphene_django.types import DjangoObjectType
from api.videos.models import Video, Comment, Like, User


class UserType(DjangoObjectType):
    class Meta:
        model = User


class VideoType(DjangoObjectType):
    user = graphene.Field(UserType)

    class Meta:
        model = Video

    def resolve_user(self, info):
        return self.user


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class Query(graphene.ObjectType):
    all_videos = graphene.List(VideoType)
    all_comments = graphene.List(CommentType)
    all_likes = graphene.List(LikeType)
    video_by_slug = graphene.Field(VideoType, slug=graphene.String(required=True))
    comments_by_video_slug = graphene.List(CommentType, video_slug=graphene.String(required=True))
    user_by_user_name = graphene.Field(UserType, username=graphene.String(required=True))
    all_users = graphene.List(UserType)

    def resolve_all_videos(self, info, **kwargs):
        return Video.objects.all()

    def resolve_all_comments(self, info, **kwargs):
        return Comment.objects.all()

    def resolve_all_likes(self, info, **kwargs):
        return Like.objects.all()

    def resolve_video_by_slug(self, info, slug):
        try:
            return Video.objects.get(slug=slug)
        except Video.DoesNotExist:
            return None

    def resolve_comments_by_video_slug(self, info, video_slug):
        try:
            video = Video.objects.get(slug=video_slug)
            return Comment.objects.filter(video=video)
        except Video.DoesNotExist:
            return None

    def resolve_all_user(self, info, **kwargs):
        return User.objects.all()

    def resolve_user_by_user_name(self, info, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None


class CreateUser(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        bio = graphene.String()
        profile_picture = graphene.String()
    user = graphene.Field(UserType)

    def mutate(self, info, username, email, password, bio=None, profile_picture=None):
        user = User(
            username=username,
            email=email,
            bio=bio,
            profile_picture=profile_picture
        )
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class CreateVideo(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        description = graphene.String(required=True)
        file_url = graphene.String(required=True)
        thumbnail_url = graphene.String(required=True)
        user_id = graphene.Int(required=True)

    video = graphene.Field(VideoType)

    def mutate(self, info, title, description, file_url, thumbnail_url, user_id):
        user = User.objects.get(id=user_id)
        video = Video(title=title, description=description, file_url=file_url, thumbnail_url=thumbnail_url, user=user)
        video.save()
        return CreateVideo(video=video)


class CreateComment(graphene.Mutation):
    class Arguments:
        video_slug = graphene.String(required=True)
        content = graphene.String(required=True)
        user_id = graphene.Int(required=True)

    comment = graphene.Field(CommentType)

    def mutate(self, info, video_slug, content, user_id):
        user = User.objects.get(id=user_id)
        video = Video.objects.get(slug=video_slug)
        comment = Comment(video=video, user=user, content=content)
        comment.save()
        return CreateComment(comment=comment)


class CreateLike(graphene.Mutation):
    class Arguments:
        video_id = graphene.Int(required=True)
        user_id = graphene.Int(required=True)

    like = graphene.Field(LikeType)

    def mutate(self, info, video_id, user_id):
        user = User.objects.get(id=user_id)
        video = Video.objects.get(id=video_id)
        like = Like(video=video, user=user)
        like.save()
        return CreateLike(like=like)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    create_video = CreateVideo.Field()
    create_comment = CreateComment.Field()
    create_like = CreateLike.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
