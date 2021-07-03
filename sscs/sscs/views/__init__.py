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

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context = context | self.form_dict
        context = context | {"clients":get_client_list()}
        return context
