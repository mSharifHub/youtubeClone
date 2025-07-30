
import graphene

from api.graphql.base_types import BaseStatisticsFields, BaseSnippetFields, BaseIdFields, BaseThumbnailsFields

class VideoStatisticsInput(graphene.InputObjectType, BaseStatisticsFields):
    pass

class VideoIdInput(graphene.InputObjectType, BaseIdFields):
    video_id = graphene.String(required=True)

class ThumbnailInput(graphene.InputObjectType, BaseThumbnailsFields):
    pass

class ThumbnailsInput(graphene.InputObjectType):
    default = graphene.Field(ThumbnailInput)
    medium = graphene.Field(ThumbnailInput)
    high = graphene.Field(ThumbnailInput)

class VideoSnippetInput(graphene.InputObjectType, BaseSnippetFields):
    thumbnails = graphene.Field(ThumbnailsInput)

class VideoInput(graphene.InputObjectType):
    id = graphene.InputField(VideoIdInput, required=True)
    snippet = graphene.InputField(VideoSnippetInput, required=True)
    statistics = graphene.InputField(VideoStatisticsInput, required=True)


