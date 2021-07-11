release: python3 manage.py migrate
web: daphne sscs.asgi:channel_layer --port $PORT --bind 0.0.0.0
worker: python manage.py runworker channel_layer
