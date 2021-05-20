from django.shortcuts import render

from .forms import ExtClientForm


def new_client(request):
    if request.method == "POST":
        form = ExtClientForm(request.POST)
        if form.is_valid():
            return HttpResponseRedirect('/thanks/')
    else:
        form = ExtClientForm()
    return render(request, 'sscs/new_client.html', {'form': form})
