from enum import Enum

class BasePermissionEnum(Enum):
    @property
    def codename(self):
        return self.value.split(".")[1]

class StorePermissions(BasePermissionEnum):
    # Product permissions cover products, their images, and collections
    PRODUCTS_VIEW = "products.view"
    PRODUCTS_CREATE = "products.create"
    PRODUCTS_UPDATE = "products.update"
    PRODUCTS_DELETE = "products.delete"

    ORDERS_VIEW = "orders.view"
    ORDERS_MANAGE = "orders.manage"

    STORE_SETTINGS = "store.settings"
    STORE_ANALYTICS = "store.analytics"
