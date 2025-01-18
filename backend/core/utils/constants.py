from enum import Enum, auto

class StorePermissionErrors:
    """Constants for store-related permission errors."""
    
    UNAUTHENTICATED = {
        "message": "Authentication required.",
        "code": "UNAUTHENTICATED",
        "status": 401
    }
    
    STORE_NOT_FOUND = {
        "message": "Store not found.",
        "code": "NOT_FOUND", 
        "status": 404
    }

    NOT_STAFF_MEMBER = {
        "message": "Not a staff member of the store.",
        "code": "NOT_STAFF_MEMBER", 
        "status": 403
    }

    PERMISSION_DENIED = {
        "message": "Insufficient permissions.",
        "code": "PERMISSION_DENIED", 
        "status": 403
    }

class ProductErrorCodes(Enum):
    """Enumeration of product-related error codes."""
    INVALID_PRICE = auto()
    NEGATIVE_STOCK = auto()
    VARIANT_LIMIT_EXCEEDED = auto()
    DUPLICATE_VARIANT = auto()

class ValidationConstants:
    """Constants for validation rules."""
    MAX_PRODUCT_NAME_LENGTH = 255
    MIN_PRICE = 0
    MAX_STOCK_QUANTITY = 10000
