import graphene


class Money(graphene.ObjectType):
    currency = graphene.String(description="Currency code.", required=True)
    amount = graphene.Float(description="Amount of money.", required=True)

    class Meta:
        description = "Represents amount of money in specific currency."
