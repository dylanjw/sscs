from django.core.paginator import Paginator
from django.db import IntegrityError
from sockpuppet.reflex import Reflex
from sockpuppet.channel import Channel
from sscs.models import Client, ClientProfile
from sscs.utils import get_client_list
from sscs.forms import ClientForm, ClientProfileForm


def parse_form_fields(form_prefix, params):
    form_prefix = form_prefix + "-"
    ret = {}
    for key, value in params.items():
        if key.startswith(form_prefix):
            # remove prefix
            ret = ret | {key[len(form_prefix):]:value}
    return ret



class NewClientFormReflex(Reflex):
    def paginate(self, page):
        paginator = Paginator(
            get_client_list(
                **parse_form_fields('client', self.params)
            ),
            10
        )
        self.page_obj = paginator.get_page(page)
    def search(self):
        paginator = Paginator(
            get_client_list(
                **parse_form_fields('client', self.params)
            ),
            10
        )
        self.page_obj = paginator.get_page(1)
        self.refill_forms()
    def update(self, field_d):
        print(f"updating {field_d['form']} with {field_d['field']}:{field_d['value']}")
        pk = self.session.get("pk")
        if pk is None:
            raise TypeError("pk is not set")
        client = Client.objects.get(pk=pk)
        try:
            client_profile = ClientProfile.objects.get(client=client)
            self.mode = "edit"
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
        self.refill_forms(pk)
        print(f"self.mode:{self.mode}, session['mode']{self.session.get('mode')}")


    def new_client(self):
        form_fields = parse_form_fields('client', self.params)
        matches = Client.objects.filter(**form_fields)
        if matches.exists():
            self.error_message = "Client already exists"
            return
        client = Client(**form_fields)
        try:
            client.save()
        except IntegrityError as e:
            print("form error")
            self.error_message = "There was an error with your submission"

            self.client_form = ClientForm(
                initial = {
                    "first_name": client.first_name,
                    "last_name":client.last_name,
                    "nicknames":client.nicknames,
                    "dob":client.dob
                }
            )
            self.toggle('search')
            return
        self.client_form, self.client_profile_form = _refill_forms_from_params(
            self.params
        )
        self.toggle('edit')
        self.session['pk'] = client.pk
        print(f"created new client: {client.pk}")
    def toggle(self, mode):
        if mode == 'search':
            self.session['pk'] = None
        self.mode = mode
        self.session['mode'] = mode
        self.refill_forms()

    def refill_forms(self, pk=None):
        pk = self.session.get('pk')
        if pk is not None:
            self.client_form, self.client_profile_form = _refill_forms_from_db(pk)
        else:
            self.client_form, self.client_profile_form = _refill_forms_from_params(self.params)




    def select(self, pk):
        self.session['pk'] = pk
        client = Client.objects.get(pk=pk)
        self.toggle('view')
        self.refill_forms(pk)


def _refill_forms_from_db(pk):
        client = Client.objects.get(pk=pk)
        client_form = ClientForm(
            initial = {
                "first_name": client.first_name,
                "last_name":client.last_name,
                "nicknames":client.nicknames,
                "dob":client.dob
            }
        )
        try:
            client_profile = ClientProfile.objects.get(client=client)
            client_profile_form = ClientProfileForm(
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
        except ClientProfile.DoesNotExist:
            client_profile_form = ClientProfileForm()
        return client_form, client_profile_form


def _refill_forms_from_params(params):
        client_fields = parse_form_fields('client', params)
        client_profile_fields = parse_form_fields('client_profile', params)
        client_form = ClientForm(
            initial = {
                "first_name": client_fields.get('first_name'),
                "last_name": client_fields.get('last_name'),
                "nicknames": client_fields.get('nicknames'),
                "dob": client_fields.get('dob')
            }
        )
        client_profile_form = ClientProfileForm(
            initial={
                "phone_number": client_profile_fields.get('phone_number'),
                "email": client_profile_fields.get('email'),
                "address": client_profile_fields.get('address'),
                "household_size": client_profile_fields.get('household_size'),
                "pets_cat_count": client_profile_fields.get('pets_cat_count'),
                "pets_dog_count": client_profile_fields.get('pes_dog_count'),
                "dietary_considerations": client_profile_fields.get('dietary_considerations'),
                "date_of_first_visit": client_profile_fields.get('date_of_first_visit'),
                "date_of_last_visit": client_profile_fields.get('date_of_last_visit'),
                "resident_status": client_profile_fields.get('resident_status'),
            }
        )
        return client_form, client_profile_form
