import graphene
import stores.schema

class Query(stores.schema.Query, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)