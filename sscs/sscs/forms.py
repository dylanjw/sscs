from bootstrap_datepicker_plus import DatePickerInput
from django.forms import ModelForm, formset_factory

from .models import (
    Client,
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
            "dob": DatePickerInput()
        }


class ClientProfileForm(ModelForm):
    class Meta:
        model = ClientProfile
        exclude = ['client']
        widgets = {
            "date_of_first_visit": DatePickerInput(),
            "date_of_last_visit": DatePickerInput(),
        }

