from django.urls import path
from .consumers import ProjectUpdatesConsumer
websocket_urlpatterns = [path('ws/projects/', ProjectUpdatesConsumer.as_asgi())]
