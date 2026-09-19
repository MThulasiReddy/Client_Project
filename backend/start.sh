#!/bin/sh

set -e

echo "Running migrations..."
python manage.py migrate --noinput

echo "Creating admin user if needed..."
python manage.py shell <<'PYTHON'
import os
from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(
            username=username,
            email=email or "",
            password=password,
        )
        print(f"Superuser '{username}' created.")
    else:
        print(f"Superuser '{username}' already exists.")
PYTHON

echo "Starting Daphne..."
exec daphne -b 0.0.0.0 -p "${PORT}" college_circuit.asgi:application