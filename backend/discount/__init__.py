class DiscountValueType:
    FIXED = "fixed"
    PERCENTAGE = "percentage"

    CHOICES = [
        (FIXED, "fixed"),
        (PERCENTAGE, "%"),
    ]


class DiscountType:
    SALE = "sale"
    # PROMOTION = "promotion"
    # ORDER_PROMOTION = "order_promotion"
    VOUCHER = "voucher"
    MANUAL = "manual"

    CHOICES = [
        (SALE, "Sale"),
        (VOUCHER, "Voucher"),
        (MANUAL, "Manual"),
        # (PROMOTION, "Promotion"),
        # (ORDER_PROMOTION, "Order promotion"),
    ]

class VoucherType:
    SHIPPING = "shipping"
    ENTIRE_ORDER = "entire_order"
    SPECIFIC_PRODUCT = "specific_product"

    CHOICES = [
        (ENTIRE_ORDER, "Entire order"),
        (SHIPPING, "Shipping"),
        (SPECIFIC_PRODUCT, "Specific products, collections and categories"),
    ]