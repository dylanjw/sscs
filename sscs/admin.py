from django.contrib import admin
from .models import ClientProfile, Client


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    pass
