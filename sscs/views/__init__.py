from django.contrib.auth.decorators import login_required
from django.template.response import TemplateResponse
from django.views import View
from django.views.generic.base import TemplateView
from django.core.paginator import Paginator

from sscs.forms import (
    ClientProfileForm,
    ClientForm,
    ClientFamilyFormSet,
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
    template_name='sscs/new_client.html'
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.mode = 'search'

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        if not context.get('stimulus_reflex'):
            context['profile_form_classes'] = 'd-none'
            context['client_form'] = ClientForm()
            context['client_profile_form'] = ClientProfileForm()
            context['client_family_formset'] = ClientFamilyFormSet(prefix="family")
        else:
            context['profile_form_classes'] = ''
            context['client_form'] = ClientForm()
            context['client_profile_form'] = ClientProfileForm()
            context['mode'] = self.request.session.get('mode')
            context['client_family_formset'] = ClientFamilyFormSet(prefix="family")

        context = context | TOGGLE_MODE_SETTINGS[self.mode]
        clients = get_client_list()
        paginator = Paginator(clients, 10)
        context = context | {"page_obj":paginator.get_page(1)}
        context['mode'] = self.mode
        return context
