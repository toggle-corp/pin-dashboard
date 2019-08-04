# Generated by Django 2.2.3 on 2019-08-04 04:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0003_ward'),
        ('metadata', '0007_relocationsite_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='LandlessHousehold',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('identifier', models.CharField(max_length=128)),
                ('result', models.CharField(blank=True, max_length=256)),
                ('district', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geo.District')),
                ('palika', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geo.Palika')),
                ('ward', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geo.Ward')),
            ],
        ),
    ]