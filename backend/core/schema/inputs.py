import graphene


class CountryInput(graphene.InputObjectType):
    name = graphene.String()
    code = graphene.String()
