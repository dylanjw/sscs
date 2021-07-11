release: python3 manage.py migrate
web: daphne sscs.asgi:application --port $PORT --bind 0.0.0.0 -v2
worker: python manage.py runworker default -v2
