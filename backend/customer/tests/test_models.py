from django.test import TestCase
from ..models import MailingAddress, Customer
from stores.models import Store


class MailingAddressTestCase(TestCase):
    def setUp(self):
        self.address = MailingAddress.objects.create(
            address1="123 Main St",
            address2="Apt 4B",
            city="and",
            country="US",
            company="Test Company",
            phone="+1234567890",
            province_code="NY",
            zip="12345"
        )

    def test_mailing_address_creation(self):
        self.assertEqual(self.address.address1, "123 Main St")
        self.assertEqual(self.address.address2, "Apt 4B")
        self.assertEqual(self.address.city, "and")
        # Assuming CountryField returns a Country object with a 'code' attribute
        self.assertEqual(self.address.country.code, "US")
        self.assertEqual(self.address.company, "Test Company")
        self.assertEqual(self.address.province_code, "NY")
        self.assertEqual(self.address.zip, "12345")
        self.assertTrue(self.address.phone, "+1234567890")

    def test_address_str(self):
        self.assertEqual(str(self.address), "123 Main St")


class CustomerTestCase(TestCase):
    def setUp(self):
        self.address = MailingAddress.objects.create(
            address1="123 Main St",
            address2="Apt 4B",
            city="and",
            country="US",
            company="Test Company",
            phone="+1234567890",
            province_code="NY",
            zip="12345"
        )
        self.store = Store.objects.create(
            name="Test Store"
        )
        self.customer = Customer.objects.create(
            store=self.store,
            first_name="John",
            last_name="Doe",
            email="johndoe@example.com",
            default_address=self.address
        )

    def test_customer_creation(self):
        self.assertEqual(self.customer.first_name, "John")
        self.assertEqual(self.customer.last_name, "Doe")
        self.assertEqual(self.customer.email, "johndoe@example.com")
        self.assertEqual(self.customer.default_address, self.address)
        self.assertEqual(self.customer.store, self.store)

    def test_customer_str(self):
        self.assertEqual(str(self.customer), "John Doe")
