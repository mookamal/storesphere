from enum import Enum

class BasePermissionEnum(Enum):
    @property
    def codename(self):
        return self.value.split(".")[1]

class StorePermissions(BasePermissionEnum):
    # Product permissions for managing products and their basic attributes
    PRODUCTS_VIEW = "products.view"
    PRODUCTS_CREATE = "products.create"
    PRODUCTS_UPDATE = "products.update"
    PRODUCTS_DELETE = "products.delete"

    # Separate permissions for managing collections
    COLLECTIONS_VIEW = "collections.view"
    COLLECTIONS_CREATE = "collections.create"
    COLLECTIONS_UPDATE = "collections.update"
    COLLECTIONS_DELETE = "collections.delete"

    ORDERS_VIEW = "orders.view"
    ORDERS_MANAGE = "orders.manage"

    STORE_SETTINGS = "store.settings"
    STORE_ANALYTICS = "store.analytics"
