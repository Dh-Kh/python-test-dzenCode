# Generated by Django 4.2.4 on 2023-09-10 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logic', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recordfields',
            name='txt_file',
            field=models.FileField(blank=True, null=True, upload_to='images/'),
        ),
    ]
