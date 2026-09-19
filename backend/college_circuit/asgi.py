import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "college_circuit.settings")

from django.core.asgi import get_asgi_application

# Initialize Django first
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
import projects.routing
from .jwt_websocket import JwtQueryAuthMiddleware

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JwtQueryAuthMiddleware(
        URLRouter(projects.routing.websocket_urlpatterns)
    ),
})