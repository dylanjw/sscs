# Generated by Django 3.2.2 on 2021-06-03 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sscs', '0002_auto_20210520_1815'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientprofile',
            name='nicknames',
            field=models.CharField(default=' ', max_length=200),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='ClientNick',
        ),
    ]