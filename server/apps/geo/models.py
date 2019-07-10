from django.db import models


class Map(models.Model):
    key = models.CharField(max_length=128, unique=True)
    file = models.FileField(upload_to='maps',
                            default=None, blank=True, null=True)

    def __str__(self):
        return self.key


class Province(models.Model):
    name = models.CharField(max_length=256)

    def __str__(self):
        return self.name


class District(models.Model):
    name = models.CharField(max_length=256)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    geojson = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Palika(models.Model):
    name = models.CharField(max_length=256)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    geojson = models.TextField(blank=True)

    def __str__(self):
        return self.name
