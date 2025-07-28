
import graphene

class BaseStatisticsFields:
    view_count = graphene.String()
    like_count = graphene.String()
    dislike_count = graphene.String()
    comment_count = graphene.String()
    duration = graphene.String()

class BaseThumbnailFields:
    url = graphene.String()
    width = graphene.Int()
    height = graphene.Int()

class BaseSnippetFields:
    title = graphene.String()
    description = graphene.String()
    channel_id = graphene.String()
    channel_title = graphene.String()
    channel_description = graphene.String()
    channel_logo = graphene.String()
    published_at = graphene.DateTime()
    subscriber_count = graphene.String()
    category_id = graphene.String()

class BaseIdFields:
    video_id = graphene.String()
