class OrderStatus:
    # The order was placed or created. There is work to do for the order, which can include processing payment, fulfilling, or processing returns.
    OPEN = "Open"
    # The order was manually or automatically archived.
    ARCHIVED = "Archived"
    # The order was canceled. If a canceled order was not fully refunded, then there might be work remaining for the order.
    CANCELED = "Canceled"
    CHOICES = [
        (OPEN, 'Open'),
        (ARCHIVED, 'Archived'),
        (CANCELED, 'Canceled'),
    ]


class PaymentStatus:
    PENDING = 'Pending'
    AUTHORIZED = 'Authorized'
    DUE = 'Due'
    EXPIRING = 'Expiring'
    EXPIRED = 'Expired'
    PAID = 'Paid'
    REFUNDED = 'Refunded'
    PARTIALLY_REFUNDED = 'Partially refunded'
    PARTIALLY_PAID = 'Partially paid'
    VOIDED = 'Voided'
    UNPAID = 'Unpaid'

    CHOICES = [
        (PENDING, 'Pending'),
        (AUTHORIZED, 'Authorized'),
        (DUE, 'Due'),
        (EXPIRING, 'Expiring'),
        (EXPIRED, 'Expired'),
        (PAID, 'Paid'),
        (REFUNDED, 'Refunded'),
        (PARTIALLY_REFUNDED, 'Partially refunded'),
        (PARTIALLY_PAID, 'Partially paid'),
        (VOIDED, 'Voided'),
        (UNPAID, 'Unpaid'),
    ]


class FulfillmentStatus:
    FULFILLED = 'Fulfilled'
    UNFULFILLED = 'Unfulfilled'
    PARTIALLY_FULFILLED = 'Partially fulfilled'
    SCHEDULED = 'Scheduled'
    ON_HOLD = 'On hold'

    CHOICES = [
        (FULFILLED, 'Fulfilled'),
        (UNFULFILLED, 'Unfulfilled'),
        (PARTIALLY_FULFILLED, 'Partially fulfilled'),
        (SCHEDULED, 'Scheduled'),
        (ON_HOLD, 'On hold'),
    ]


class ReturnStatus:
    RETURN_REQUESTED = 'Return requested'
    RETURN_IN_PROGRESS = 'Return in progress'
    RETURNED = 'Returned'
    INSPECTION_COMPLETE = 'Inspection complete'

    CHOICES = [
        (RETURN_REQUESTED, 'Return requested'),
        (RETURN_IN_PROGRESS, 'Return in progress'),
        (RETURNED, 'Returned'),
        (INSPECTION_COMPLETE, 'Inspection complete'),
    ]
