import graphene
from graphql_jwt import ObtainJSONWebToken, Refresh, Revoke
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from graphene_file_upload.scalars import Upload
from graphene_django.types import DjangoObjectType
from graphql import GraphQLError
from graphql_jwt.shortcuts import get_token, create_refresh_token
from graphql_jwt.decorators import login_required
from graphql_jwt.utils import jwt_decode

from api.models import Video, User, Comment, Like


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_staff', 'profile_picture', 'bio', 'subscribers', 'is_verified', 'email')


def validate_file_size(file, max_size):
    print(f"Validating file size: {file.size} bytes, max size: {max_size} bytes")
    if file.size > max_size:
        raise ValidationError(f"file size should not exceed {max_size / (1024 * 1024)} MB")


def validate_username_length(username, min_length=3):
    if len(username) < min_length:
        raise ValidationError(f"Username must be at least {min_length} characters long")


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
    staff_users = graphene.List(UserType)

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

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()

    def resolve_staff_users(self, info, **kwargs):
        return User.objects.filter(is_staff=True)

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
        profile_picture = Upload(required=False)

    user = graphene.Field(UserType)
    token = graphene.String()
    refresh_token = graphene.String()

    def mutate(self, info, username, email, password, bio=None, profile_picture=None):
        try:
            validate_username_length(username, min_length=3)

            # Create a new user instance
            user = User(
                username=username,
                email=email,
                bio=bio,
            )

            if profile_picture:
                validate_file_size(profile_picture, max_size=2 * 1024 * 1024)
                file_name = f"{username}_profile_picture.{profile_picture.name.split('.')[-1]}"
                user.profile_picture.save(file_name, ContentFile(profile_picture.read()), save=False)

            # Set user password
            user.set_password(password)
            user.save()
            token = get_token(user)
            refresh_token = create_refresh_token(user)

            return CreateUser(user=user, token=token, refresh_token=refresh_token)
        except ValidationError as e:
            raise GraphQLError(f'400:{e.message}')
        except Exception as e:
            raise GraphQLError(f'500: An error occurred while creating the user. {str(e)}')


class DeleteUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info, id):
        try:
            user = User.objects.get(pk=id)
            if info.context.user != user:
                raise GraphQLError(f"403: You do not have authorization")
            username = user.username
            user.delete()
            try:
                User.objects.get(pk=id)
                raise GraphQLError(f"500: User {username} has not been deleted")
            except User.DoesNotExist:
                return DeleteUser(success=True, message=f"User {username} has been deleted successfully")
        except User.DoesNotExist:
            raise GraphQLError(f"400: user not found")


class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        username = graphene.String()
        email = graphene.String()
        password = graphene.String()
        bio = graphene.String()
        profile_picture = Upload(required=False)

    user = graphene.Field(UserType)

    @login_required
    def mutate(self, info, id, username=None, email=None, password=None, bio=None, profile_picture=None):
        user = User.objects.get(pk=id)

        if info.context.user != user:
            raise GraphQLError(f"403: You do not have authorization")

        if username:
            user.username = username
        if email:
            user.email = email
        if bio:
            user.bio = bio

        if profile_picture:
            validate_file_size(profile_picture, max_size=2 * 1024 * 1024)  # 2MB
            file_name = f"{username}_profile_picture.{profile_picture.name.split('.')[-1]}"
            user.profile_picture.save(file_name, ContentFile(profile_picture.read()), save=False)
        user.save()
        return UpdateUser(user=user)


class VerifyToken(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)

    success = graphene.Boolean()
    message = graphene.String()
    payload = graphene.String()

    def mutate(self, info, token):
        try:
            payload = jwt_decode(token)

            username = payload['username']
            if not username:
                raise Exception("Invalid token: username not found")

            user = User.objects.get(username=username)
            user.status.verified = True
            user.status.save()

            return VerifyToken(success=True, message=f"user verified successfully", payload=payload)

        except User.DoesNotExist:
            return VerifyToken(success=False, message=f"Invalid token: username not found", payload={})
        except Exception as err:
            return VerifyToken(success=False, message=str(err), payload={})


class CustomObtainJsonWebToken(ObtainJSONWebToken):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    success = graphene.Boolean()
    errors = graphene.String()
    token = graphene.String()
    refresh_token = graphene.String()
    username = graphene.String()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            result = super().mutate(root, info, **kwargs)
            username = kwargs['username']
            return cls(success=True, errors=None, token=result.token, refresh_token=result.refresh_token, username=username)
        except Exception as err:
            return cls(success=False, errors=str(err), token=None, refresh_token=None)



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

    @classmethod
    def mutate(cls, root, info, video_id, user_id):
        user = User.objects.get(id=user_id)
        video = Video.objects.get(id=video_id)
        like = Like(video=video, user=user)
        like.save()
        return CreateLike(like=like)


class AuthMutation(graphene.ObjectType):
    register_user = CreateUser.Field()
    verify_account = VerifyToken.Field()
    token_auth = CustomObtainJsonWebToken.Field()
    refresh_token = Refresh.Field()
    revoke_token = Revoke.Field()
    delete_user = DeleteUser.Field()
    update_user = UpdateUser.Field()
    create_video = CreateVideo.Field()
    create_comment = CreateComment.Field()
    create_like = CreateLike.Field()

schema = graphene.Schema(query=Query, mutation=AuthMutation)
