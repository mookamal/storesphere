import graphene
import stores.schema

class Query(stores.schema.Query, graphene.ObjectType):
    pass

class Mutation(stores.schema.StoreMutation,graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query,mutation=Mutation)