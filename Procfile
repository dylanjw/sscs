release: python3 manage.py migrate
web: gunicorn sscs.wsgi --log-file -
worker: python manage.py runworker channel_layer
