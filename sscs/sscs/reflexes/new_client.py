from sockpuppet.reflex import Reflex
from sockpuppet.channel import Channel
from sscs.models import Client, ClientProfile
from sscs.utils import get_client_list
from sscs.constants import TOGGLE_MODE_SETTINGS
from sscs.forms import ClientForm


def parse_form_fields(form_prefix, params):
    form_prefix = form_prefix + "-"
    ret = {}
    for key, value in params.items():
        if key.startswith(form_prefix):
            # remove prefix
            ret = ret | {key[len(form_prefix):]:value}
    return ret



class NewClientFormReflex(Reflex):
    def search(self):
        self.clients = get_client_list(
            **parse_form_fields('client', self.params)
        )
        print(f"clients: {self.clients}")
    def update(self, field_d):
        print(f"updating {field_d['form']} with {field_d['field']}:{field_d['value']}")
        pk = self.session.get("pk")
        if pk is None:
            raise TypeError("pk is not set")
        client = Client.objects.get(pk=pk)
        try:
            client_profile = ClientProfile.objects.get(client=client)
        except ClientProfile.DoesNotExist:
            client_profile = ClientProfile(client=client)
        if field_d['form'] == 'client':
            setattr(client, field_d['field'], field_d['value'])
            client.save()
            print("saving client")
        if field_d['form'] == 'client_profile':
            setattr(client_profile, field_d['field'], field_d['value'])
            client_profile.save()
            print("saving profile")


    def new_client(self):
        form_fields = parse_form_fields('client', self.params)
        matches = Client.objects.filter(**form_fields)
        if matches.exists():
            print("client already exists")
            return
        client = Client(**form_fields)
        client.save()
        print("created new client")
    def toggle(self, mode):
        settings = TOGGLE_MODE_SETTINGS[mode]
        if mode == 'search':
            self.session['pk'] == None
        for key, value in settings.items():
            setattr(self, key, value)
        self.session['mode'] = mode
        self.mode = mode
    def select(self, pk):
        self.session['pk'] = pk
        client = Client.objects.get(pk=pk)
        self.toggle('view')
        self.client_form = ClientForm(
            initial = {
                "first_name": client.first_name,
                "last_name":client.last_name,
                "nicknames":client.nicknames,
                "dob":client.dob
            }
        )
