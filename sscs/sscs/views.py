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


        forms = [c_form, cp_form, cn_form]

        for form in forms:
            if not form.is_valid:
                break
            form.save()
        else:
            return HttpResponseRedirect('/thanks/')
    else:
        cp_form = ClientProfileForm()
        c_form = ClientForm()
        cn_form = ClientNickForm()
    return render(
        request,
        'sscs/new_client.html',
        {
            'client_form': c_form,
            'client_profile_form': cp_form,
            'client_nick_form': cn_form
        }
    )
