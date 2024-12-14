import graphene
from graphql.language import ast
from phonenumbers import parse, is_valid_number, NumberParseException


class PhoneNumberScalar(graphene.Scalar):
    """Custom Scalar for validating phone numbers"""

    @staticmethod
    def serialize(phone):
        return str(phone)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return PhoneNumberScalar.parse_value(node.value)

    @staticmethod
    def parse_value(value):

        try:
            phone = parse(value, None)
            if is_valid_number(phone):
                return value
            raise ValueError("Invalid phone number")
        except NumberParseException:
            raise ValueError("Invalid phone number")
