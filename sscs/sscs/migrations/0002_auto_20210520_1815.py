# Generated by Django 3.2.2 on 2021-05-20 18:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sscs', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ClientNicks',
            new_name='ClientNick',
        ),
        migrations.RenameModel(
            old_name='ClientExt',
            new_name='ClientProfile',
        ),
    ]
