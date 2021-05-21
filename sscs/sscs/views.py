from django.shortcuts import render

from .forms import (
    ClientForm,
    ClientProfileForm,
    ClientNickForm,
)


def new_client(request):
    if request.method == "POST":

        client_form = ClientForm(request.POST)
        client_profile_form = ClientProfileForm(request.POST)
        client_nick_form = ClientNickForm(request.POST)


        forms = [
            client_form,
            client_profile_form,
            client_nick_form,
        ]

        # check if client exists
        assert client_form.is_valid

        result = Client.objects.filter(
            last_name=client_form.fields.get("last_name"),
            first_name=client_form.fields.get("first_name"),
            dob=client_form.fields.get("dob"),
        )
        if len(result) > 0:
            # handle matching clients
            raise NotImplementedError("Currently doesn't handle client matches")
        else:
            client = client_form.save()

        client_profile = ClientProfile(client=new_client.pk)
        client_profile_form = ClientProfileForm(
            request.POST,
            instance=client_profile,
        )
        client_profile_form.save()

        for form in forms:
            if not form.is_valid:
                break
            form.save()
        else:
            return HttpResponseRedirect('/thanks/')
    else:
        client_profile_form = ClientProfileForm()
        client_form = ClientForm()
        client_nick_form = ClientNickForm()
    return render(
        request,
        'sscs/new_client.html',
        {
            'client_form': client_form,
            'client_profile_form': client_profile_form,
            'client_nick_form': client_nick_form
        }
    )
