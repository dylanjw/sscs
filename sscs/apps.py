from django.apps import AppConfig
import beeline
import environ

env = environ.Env(
    # set casting, default value
    DEBUG=(bool, False)
)


class MyAppConfig(AppConfig):
    name = "sscs"

    def ready(self):
        beeline.init(
            writekey=env("HONEY_API_KEY", default=""),
            dataset="sscs",
            service_name="sscs.main",
        )
