from decimal import Decimal
from prices import Money, TaxedMoney
from ..models import Order


def test_total_setter():
    price = TaxedMoney(net=Money(10, "USD"), gross=Money(15, "USD"))
    order = Order()
    order.total = price
    assert order.total_net_amount == Decimal(10)
    assert order.total.net == Money(10, "USD")
    assert order.total_gross_amount == Decimal(15)
    assert order.total.gross == Money(15, "USD")
    assert order.total.tax == Money(5, "USD")
