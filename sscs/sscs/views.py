from django.shortcuts import render

from .forms import (
    ClientForm,
    ClientProfileForm,
)

from .models import (
    Client,
    ClientProfile,
)


def new_client(request):
    if request.method == "POST":

        client_form = ClientForm(request.POST)
        # check if client exists
        assert client_form.is_valid()

        result = Client.objects.filter(
            last_name=client_form.cleaned_data["last_name"],
            first_name=client_form.cleaned_data["first_name"],
            dob=client_form.cleaned_data["dob"],
        )
        if len(result) > 0:
            # handle matching clients
            raise NotImplementedError(f"Currently doesn't handle client matches: {result}")
        else:
            client = client_form.save()

        client_profile = ClientProfile(client=client)
        client_profile_form = ClientProfileForm(
            request.POST,
            instance=client_profile,
        )
        client_profile_form.save()


        return HttpResponseRedirect('/thanks/')
    else:
        client_profile_form = ClientProfileForm()
        client_form = ClientForm()
    return render(
        request,
        'sscs/new_client.html',
        {
            'client_form': client_form,
            'client_profile_form': client_profile_form,
        }
    )
