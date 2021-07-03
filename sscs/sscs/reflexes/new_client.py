from sockpuppet.reflex import Reflex
from sscs.models import Client
from sscs.utils import get_client_list


def parse_form_fields(form_prefix, params):
    form_prefix = form_prefix + "-"
    ret = {}
    for key, value in params.items():
        if key.startswith(form_prefix):
            # remove prefix
            ret = ret | {key[len(form_prefix):]:value}
    return ret



class NewClientFormReflex(Reflex):
    def update(self):
        self.clients = get_client_list(
            **parse_form_fields('client', self.params)
        )
        print(str(parse_form_fields('client', self.params)))
    def new_client(self):
        form_fields = parse_form_fields('client', self.params)
        matches = Client.objects.filter(**form_fields)
        if matches.exists():
            print("client already exists")
            return
        client = Client(**form_fields)
        client.save()
        print("created new client")
