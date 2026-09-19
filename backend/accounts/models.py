from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models

phone_validator = RegexValidator(regex=r'^[6-9]\d{9}$', message='Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.')

class StudentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=10, unique=True, validators=[phone_validator])
    def __str__(self): return f'{self.user.email} ({self.phone})'
