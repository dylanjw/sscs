import uuid

from django.db import models


class Client(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    dob = models.DateField()
    nicknames = models.CharField(max_length=200)
    head_of_household = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    cid = models.UUIDField(default=uuid.uuid4, editable=False)

class ClientProfile(models.Model):
    # A client is a
    client = models.OneToOneField(
        Client,
        on_delete = models.CASCADE
    )
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    household_size = models.PositiveIntegerField(null=True) # Should this be a get function?
    # in_household = models.ManyToManyField(Client, symmetrical = False)
    pets_cat_count = models.PositiveIntegerField(null=True)
    pets_dog_count = models.PositiveIntegerField(null=True)
    dietary_considerations = models.CharField(max_length=500, blank=True)
    date_of_first_visit = models.DateField(null=True)
    date_of_last_visit = models.DateField(null=True)
    resident_status = models.CharField(max_length=200, blank=True)
