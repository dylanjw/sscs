from invoke import task


@task
def serve(c):
    c.run("uvicorn --reload --reload-dir sscs --ssl-keyfile=key.key --ssl-certfile cert.crt sscs.asgi:application")

