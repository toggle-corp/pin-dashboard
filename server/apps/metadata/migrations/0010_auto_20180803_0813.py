# Generated by Django 2.0.5 on 2018-08-03 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('metadata', '0009_auto_20180801_0714'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='geosite',
            name='ward',
        ),
        migrations.RemoveField(
            model_name='household',
            name='ward',
        ),
        migrations.AlterField(
            model_name='geosite',
            name='place',
            field=models.CharField(blank=True, default='', max_length=256),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='household',
            name='place',
            field=models.CharField(blank=True, default='', max_length=256),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Place',
        ),
        migrations.DeleteModel(
            name='Ward',
        ),
    ]