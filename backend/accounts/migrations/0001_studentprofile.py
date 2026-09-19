import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [migrations.CreateModel(name='StudentProfile', fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('phone', models.CharField(max_length=10, unique=True, validators=[django.core.validators.RegexValidator(message='Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.', regex='^[6-9]\\d{9}$')])),
        ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
    ])]
