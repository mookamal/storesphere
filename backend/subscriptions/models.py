from django.db import models
from enum import Enum
from django.utils import timezone
from stores.models import Store

class SubscriptionPlan(models.Model):
    class PlanType(Enum):
        BASIC = 'Basic'
        STANDARD = 'Standard'
        PREMIUM = 'Premium'
    
    type = models.CharField(
        max_length=10,
        choices=[(tag.name, tag.value) for tag in PlanType],
        unique=True
    )
    description = models.TextField(blank=True)
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    yearly_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.set_yearly_price()
        super().save(*args, **kwargs)

    def set_yearly_price(self):
        self.yearly_price = self.monthly_price * 10

    def __str__(self):
        return f'{self.type} - ${self.monthly_price}'

class Subscription(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    is_yearly = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.end_date:
            if self.is_yearly:
                self.end_date = self.start_date + timezone.timedelta(days=365)
            else:
                self.end_date = self.start_date + timezone.timedelta(days=30)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.store.name} - {self.plan.type} ({'Yearly' if self.is_yearly else 'Monthly'})"
