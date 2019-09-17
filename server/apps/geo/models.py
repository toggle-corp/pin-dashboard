from django.db import models
from django.contrib.postgres.fields import JSONField


class Map(models.Model):
    key = models.CharField(max_length=128, unique=True)
    file = models.FileField(upload_to='maps',
                            default=None, blank=True, null=True)

    def __str__(self):
        return self.key


class Province(models.Model):
    name = models.CharField(max_length=256)
    meta = JSONField(default=dict)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=256)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    meta = JSONField(default=dict)

    def __str__(self):
        return self.name


class Palika(models.Model):
    NAGARPALIKA = 'nagarpalika'
    GAUNPALIKA = 'gaunpalika'
    METRO = 'metro'
    SUB_METRO = 'sub_metro'

    PALIKA_TYPES = (
        (NAGARPALIKA, 'Nagarpalika'),
        (GAUNPALIKA, 'Gaunpalika'),
        (METRO, 'Metropolitan City'),
        (SUB_METRO, 'Sub-Metropolitan City'),
    )

    name = models.CharField(max_length=256)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    meta = JSONField(default=dict)
    type = models.CharField(
        max_length=50,
        choices=PALIKA_TYPES,
        null=True, blank=True,
    )

    def __str__(self):
        return self.name


class Ward(models.Model):
    name = models.CharField(max_length=256)
    palika = models.ForeignKey(Palika, on_delete=models.CASCADE)
    meta = JSONField(default=dict)

    def __str__(self):
        return self.name
