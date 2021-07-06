from django.contrib.auth.decorators import login_required
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic.base import TemplateView

from sscs.forms import (
    ClientProfileForm,
    ClientForm,
)

from sscs.models import (
    Client,
    ClientProfile,
)

from sscs.utils import get_client_list
from sscs.constants import TOGGLE_MODE_SETTINGS

def set_none_to_empty_string(val):
    if val is None:
        return ''


class NewClientView(TemplateView):
    form_classes = (
        ClientProfileForm,
        ClientForm,
    )
    template_name='sscs/new_client.html'
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.form_dict = {
            f"{form.prefix}_form":form() for form in self.form_classes
        }

    @property
    def mode(self):
        return self.request.session.get('mode')

    @mode.setter
    def mode(self, value):
        self.request.session['mode'] = value

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context = context | self.form_dict

        pk = self.request.session.get('pk')
        if self.mode is None:
            self.mode = 'search'
        if pk is not None and self.mode != 'search':
            client = Client.objects.get(pk=pk)
            try:
                client_profile = ClientProfile.objects.get(client=client)
            except ClientProfile.DoesNotExist:
                client_profile = False
            context['client_form'] = ClientForm(
                initial = {
                    "first_name": client.first_name,
                    "last_name":client.last_name,
                    "nicknames":client.nicknames,
                    "dob":client.dob
                }
            )
            if client_profile:
                context['client_profile_form'] = ClientProfileForm(
                    initial={
                        "phone_number": client_profile.phone_number,
                        "email": client_profile.email,
                        "address": client_profile.address,
                        "household_size": client_profile.household_size,
                        "pets_cat_count": client_profile.pets_cat_count,
                        "pets_dog_count": client_profile.pets_dog_count,
                        "dietary_considerations": client_profile.dietary_considerations,
                        "date_of_first_visit": client_profile.date_of_first_visit,
                        "date_of_last_visit": client_profile.date_of_last_visit,
                        "resident_status": client_profile.resident_status,
                    }
                )

        context = context | TOGGLE_MODE_SETTINGS[self.mode]
        context = context | {"clients":get_client_list()}
        context['mode'] = self.mode
        return context
