import graphene
from graphql import GraphQLError
from stores.enums import StorePermissions
from stores.models import Store, StaffMember
from core.utils.constants import StorePermissionErrors

class BaseMutation(graphene.Mutation):
    """
    Base mutation class providing common authentication and authorization logic
    for all GraphQL mutations in the system.
    """

    @classmethod
    def get_store(cls, default_domain):
        """
        Retrieve the store based on the default domain.
        """
        try:
            return Store.objects.get(default_domain=default_domain)
        except Store.DoesNotExist:
            raise GraphQLError(
                "Store not found.",
                extensions={
                    "code": "NOT_FOUND",
                    "status": 404
                }
            )

    @classmethod
    def get_staff_member(cls, user, store):
        """
        Retrieve the staff member for a given user and store.
        
        Args:
            user (User): The authenticated user.
            store (Store): The store context.
        
        Returns:
            StaffMember: The staff member instance.
        
        Raises:
            GraphQLError: If the user is not a staff member of the store.
        """
        try:
            staff_member = StaffMember.objects.get(user=user, store=store)
            return staff_member
        except StaffMember.DoesNotExist:
            raise GraphQLError(
                "You are not a staff member of this store.",
                extensions={
                    "code": "NOT_STAFF_MEMBER",
                    "status": 403
                }
            )

    @classmethod
    def check_authentication(cls, info):
        """
        Perform authentication checks.
        """
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError(
                "Authentication required.",
                extensions={
                    "code": "UNAUTHENTICATED",
                    "status": 401
                }
            )
        
        return user

    @classmethod
    def check_permission(cls, staff_member, permission: StorePermissions):
        """
        Check staff member permissions.
        """
        if not staff_member.has_permission(permission):
            raise GraphQLError(
                StorePermissionErrors.PERMISSION_DENIED['message'],
                extensions={
                    "code": StorePermissionErrors.PERMISSION_DENIED['code'],
                    "status": StorePermissionErrors.PERMISSION_DENIED['status']
                }
            )

    @classmethod
    def validate_input(cls, input_data):
        """
        Validate input data. 
        To be overridden by subclasses if needed.
        """
        return input_data

    @classmethod
    def mutate(cls, root, info, **data):
        """
        Base mutation method to be overridden by subclasses.
        """
        raise NotImplementedError(
            "Subclasses must implement the mutate method"
        )
