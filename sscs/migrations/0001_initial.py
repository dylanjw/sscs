# Generated by Django 3.2.2 on 2021-05-20 05:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200)),
                ('last_name', models.CharField(max_length=200)),
                ('dob', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='ClientNicks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=200)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sscs.client')),
            ],
        ),
        migrations.CreateModel(
            name='ClientExt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone_number', models.CharField(max_length=20)),
                ('email', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('household_size', models.PositiveIntegerField()),
                ('pets_cat_count', models.PositiveIntegerField()),
                ('pets_dog_count', models.PositiveIntegerField()),
                ('dietary_considerations', models.CharField(max_length=500)),
                ('date_of_first_visit', models.DateField()),
                ('date_of_last_visit', models.DateField()),
                ('resident_status', models.CharField(max_length=200)),
                ('client', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='sscs.client')),
            ],
        ),
    ]