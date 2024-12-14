import re
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


class EmailScalar(graphene.Scalar):
    """Custom Scalar for validating email addresses"""

    @staticmethod
    def serialize(email):
        return str(email)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return EmailScalar.parse_value(node.value)

    @staticmethod
    def parse_value(value):
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(email_regex, value):
            return value
        raise ValueError("Invalid email address")
