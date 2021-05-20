from django.forms import ModelForm

from .models import ClientExt


class ExtClientForm(ModelForm):
    class Meta:
        model = ClientExt
        fields = "__all__"
