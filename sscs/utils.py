from .models import Client


def get_client_list(
            first_name=None,
            last_name=None,
            dob=None,
            nicknames=None,
        ):

    first_name = first_name or ''
    last_name = last_name or ''
    nicknames = nicknames or ''

    if dob is None:
        return Client.objects.filter(
            first_name__contains=first_name,
            last_name__contains=last_name,
            nicknames__contains=nicknames,
            head_of_household=None)
    if dob is not None:
        return Client.objects.filter(
            first_name__contains=first_name,
            last_name__contains=last_name,
            nicknames__contains=nicknames,
            dob=dob,
            head_of_household=None,)
