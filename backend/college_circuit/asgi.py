import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'college_circuit.settings')
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import projects.routing
from .jwt_websocket import JwtQueryAuthMiddleware
application = ProtocolTypeRouter({'http': get_asgi_application(), 'websocket': JwtQueryAuthMiddleware(URLRouter(projects.routing.websocket_urlpatterns))})
