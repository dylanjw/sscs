from django.db import models


class Client(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    dob = models.DateField()


class ClientProfile(models.Model):
    # A client is a
    client = models.OneToOneField(
        Client,
        on_delete = models.CASCADE
    )
    phone_number = models.CharField(max_length=20)
    email = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    household_size = models.PositiveIntegerField() # Should this be a get function?
    # in_household = models.ManyToManyField(Client, symmetrical = False)
    pets_cat_count = models.PositiveIntegerField()
    pets_dog_count = models.PositiveIntegerField()
    dietary_considerations = models.CharField(max_length=500)
    date_of_first_visit = models.DateField()
    date_of_last_visit = models.DateField()
    resident_status = models.CharField(max_length=200)


class ClientNick(models.Model):
    client = models.ForeignKey(
        'Client',
        on_delete = models.CASCADE,
    )
    nickname = models.CharField(max_length=200)
