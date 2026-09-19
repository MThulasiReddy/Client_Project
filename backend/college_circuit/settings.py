from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')
SECRET_KEY = os.getenv('SECRET_KEY', 'unsafe-development-key-change-me')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = ['localhost', '127.0.0.1'] if DEBUG else os.getenv('ALLOWED_HOSTS', '').split(',')
INSTALLED_APPS = ['daphne', 'django.contrib.admin', 'django.contrib.auth', 'django.contrib.contenttypes', 'django.contrib.sessions', 'django.contrib.messages', 'django.contrib.staticfiles', 'corsheaders', 'rest_framework', 'channels', 'accounts', 'projects']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', 'django.middleware.security.SecurityMiddleware', 'django.contrib.sessions.middleware.SessionMiddleware', 'django.middleware.common.CommonMiddleware', 'django.middleware.csrf.CsrfViewMiddleware', 'django.contrib.auth.middleware.AuthenticationMiddleware', 'django.contrib.messages.middleware.MessageMiddleware', 'django.middleware.clickjacking.XFrameOptionsMiddleware']
ROOT_URLCONF = 'college_circuit.urls'
TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS': True, 'OPTIONS': {'context_processors': ['django.template.context_processors.request', 'django.contrib.auth.context_processors.auth', 'django.contrib.messages.context_processors.messages']}}]
WSGI_APPLICATION = 'college_circuit.wsgi.application'
ASGI_APPLICATION = 'college_circuit.asgi.application'
DATABASES = {'default': dj_database_url.config(default=f'sqlite:///{BASE_DIR / "db.sqlite3"}', conn_max_age=600)}
AUTH_PASSWORD_VALIDATORS = []
LANGUAGE_CODE, TIME_ZONE, USE_I18N, USE_TZ = 'en-us', 'Asia/Kolkata', True, True
MIDDLEWARE.insert(2, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
FRONTEND_DIST_DIR = BASE_DIR / 'frontend_dist'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# Vite may be opened using either hostname during local development.
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
CORS_ALLOWED_ORIGIN_REGEXES = [r'^https://.*\\.onrender\\.com$']
REST_FRAMEWORK = {'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',), 'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',)}
if os.getenv('REDIS_URL'):
    CHANNEL_LAYERS = {'default': {'BACKEND': 'channels_redis.core.RedisChannelLayer', 'CONFIG': {'hosts': [os.getenv('REDIS_URL')]}}}
else:
    # Works for local development. Set REDIS_URL in production for multi-process real-time updates.
    CHANNEL_LAYERS = {'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}}
