# Generated by Django 2.2.3 on 2019-08-04 05:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('metadata', '0008_landlesshousehold'),
    ]

    operations = [
        migrations.AlterField(
            model_name='landlesshousehold',
            name='identifier',
            field=models.CharField(max_length=128, unique=True),
        ),
    ]