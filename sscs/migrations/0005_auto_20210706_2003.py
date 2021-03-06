# Generated by Django 3.2.2 on 2021-07-06 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sscs', '0004_auto_20210703_1932'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientprofile',
            name='address',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='date_of_first_visit',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='date_of_last_visit',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='dietary_considerations',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='email',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='household_size',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='pets_cat_count',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='pets_dog_count',
            field=models.PositiveIntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='phone_number',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='resident_status',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
