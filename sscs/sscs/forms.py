from bootstrap_datepicker_plus import DatePickerInput
from django.contrib import admin
from django.forms import ModelForm, formset_factory

from .models import (
    Client,
    ClientNick,
    ClientProfile,
)


class ClientForm(ModelForm):
    class Meta:
        model = Client
        fields = [
            "first_name",
            "last_name",
            "dob"
        ]
        widgets = {
            "dob":DatePickerInput()
        }


class ClientNickForm(ModelForm):
    class Meta:
        model = ClientNick
        fields = ["nickname"]





class ClientProfileForm(ModelForm):
    class Meta:
        model = ClientProfile
        exclude = ['client']
        widgets = {
            "date_of_first_visit":DatePickerInput(),
            "date_of_last_visit":DatePickerInput(),
        }

@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    pass
