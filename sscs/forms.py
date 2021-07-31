from bootstrap_datepicker_plus import DatePickerInput
from django import forms


class ClientForm(forms.Form):
    prefix = "client"

    first_name = forms.CharField(label="First Name", max_length=200)
    last_name = forms.CharField(label="Last Name", max_length=200)
    dob = forms.DateField(
        label="Date of Birth",
        widget=DatePickerInput(format='%Y-%m-%d')
    )
    nicknames = forms.CharField(label="Nicknames", max_length=200)


ClientFamilyFormSet = forms.formset_factory(ClientForm, extra=1)


class ClientProfileForm(forms.Form):
    prefix = "client_profile"

    phone_number = forms.CharField(label="Phone Number", max_length=200)
    email = forms.CharField(label="Email", max_length=200)
    address = forms.CharField(label="Address", max_length=200)
    household_size = forms.IntegerField(label="Household Size")
    pets_cat_count = forms.IntegerField(label="Cats")
    pets_dog_count = forms.IntegerField(label="Dogs")
    dietary_considerations = forms.CharField(
        label="Dietary Considerations",
        max_length=200
    )
    date_of_first_visit = forms.DateField(
        label="Date of First Visit",
        widget=DatePickerInput(format='%Y-%m-%d'),
    )
    date_of_last_visit = forms.DateField(
        label="Date of Last Visit",
        widget=DatePickerInput(format='%Y-%m-%d'),
    )
    resident_status = forms.CharField(label="Residence Status", max_length=200)


