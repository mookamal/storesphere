from enum import Enum

class BasePermissionEnum(Enum):
    @property
    def codename(self):
        return self.value.split(".")[1]

class StorePermissions(BasePermissionEnum):
    PRODUCTS_VIEW = "products.view"
    PRODUCTS_CREATE = "products.create"
    PRODUCTS_EDIT = "products.edit"
    PRODUCTS_DELETE = "products.delete"

    ORDERS_VIEW = "orders.view"
    ORDERS_MANAGE = "orders.manage"

    COLLECTIONS_VIEW = "collections.view"
    COLLECTIONS_EDIT = "collections.edit"

    STORE_SETTINGS = "store.settings"
    STORE_ANALYTICS = "store.analytics"
