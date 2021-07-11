"""
ASGI config for sscs project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
import channels.routing import get_default_application()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sscs.settings.base')
django.setup()

application = get_default_application()
