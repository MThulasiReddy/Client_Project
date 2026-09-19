# Generated manually for College Circuit's initial schema.
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]
    operations = [migrations.CreateModel(
        name='ProjectRequest',
        fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('title', models.CharField(max_length=160)),
            ('category', models.CharField(choices=[('web', 'Web Development'), ('iot', 'IoT Project'), ('mobile', 'Mobile App'), ('ai', 'AI / Machine Learning'), ('design', 'UI / UX Design'), ('other', 'Other')], max_length=20)),
            ('description', models.TextField()), ('phone', models.CharField(max_length=25)), ('college', models.CharField(max_length=160)),
            ('budget', models.CharField(blank=True, max_length=80)), ('deadline', models.DateField(blank=True, null=True)),
            ('status', models.CharField(choices=[('received', 'Request received'), ('confirmed', 'Confirmed'), ('doing', 'In progress'), ('done', 'Done'), ('delivered', 'Delivered')], default='received', max_length=20)),
            ('quote', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)), ('admin_note', models.TextField(blank=True)),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='project_requests', to=settings.AUTH_USER_MODEL)),
        ], options={'ordering': ['-updated_at']}
    )]
