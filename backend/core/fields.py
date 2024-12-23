from json import JSONDecodeError
import graphene


class JSONString(graphene.JSONString):
    @staticmethod
    def parse_literal(node):
        try:
            return graphene.JSONString.parse_literal(node)
        except JSONDecodeError:
            return None
