from django.contrib import admin
from django.forms import ModelForm

from .models import (
    Client,
    ClientNick,
    ClientProfile,
)


class ClientForm(ModelForm):
    class Meta:
        model = Client
        fields = "__all__"


class ClientNickForm(ModelForm):
    class Meta:
        model = ClientNick
        fields = "__all__"

class ClientProfileForm(ModelForm):
    class Meta:
        model = ClientProfile
        exclude = ['client']

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    pass
