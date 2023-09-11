"""
ASGI config for project_data project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from logic.routing import websocket_urlpatterns
#from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from logic.middleware import JwtAuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_data.settings')
django_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": AllowedHostsOriginValidator(
        JwtAuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})