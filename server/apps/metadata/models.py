from django.db import models

from geo.models import Palika, District, Ward


class GeoSite(models.Model):
    code = models.CharField(max_length=128, unique=True)

    latitude = models.FloatField(default=None, blank=True, null=True)
    longitude = models.FloatField(default=None, blank=True, null=True)

    district = models.ForeignKey(
        District,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    palika = models.ForeignKey(
        Palika,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    ward = models.ForeignKey(
        Ward,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    place = models.CharField(max_length=256, blank=True)

    category = models.CharField(max_length=256, blank=True)
    risk_score = models.CharField(max_length=256, blank=True)
    high_risk_of = models.CharField(max_length=256, blank=True)
    direct_risk_for = models.CharField(max_length=256, blank=True)
    potential_impact = models.CharField(max_length=256, blank=True)
    risk_probability = models.CharField(max_length=256, blank=True)

    mitigation_work_by = models.CharField(max_length=256, blank=True)
    status = models.CharField(max_length=256, blank=True)

    def __str__(self):
        return self.code


class RelocationSite(models.Model):
    code = models.CharField(max_length=128, unique=True)

    latitude = models.FloatField(default=None, blank=True, null=True)
    longitude = models.FloatField(default=None, blank=True, null=True)

    district = models.ForeignKey(
        District,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    palika = models.ForeignKey(
        Palika,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    ward = models.ForeignKey(
        Ward,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    place = models.CharField(max_length=256, blank=True)

    protection_support = models.CharField(max_length=256, blank=True)
    technical_support = models.CharField(max_length=256, blank=True)
    site_type = models.CharField(max_length=256, blank=True)
    status = models.CharField(max_length=256, blank=True)

    def __str__(self):
        return self.code


class LandlessHousehold(models.Model):
    identifier = models.CharField(max_length=128, unique=True)
    district = models.ForeignKey(District,
                                 default=None, blank=True, null=True,
                                 on_delete=models.SET_NULL)
    palika = models.ForeignKey(
        Palika,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    ward = models.ForeignKey(
        Ward,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )

    result = models.CharField(max_length=256, blank=True)


class Household(models.Model):
    code = models.CharField(max_length=128)
    geosite = models.ForeignKey(GeoSite,
                                default=None, blank=True, null=True,
                                on_delete=models.SET_NULL)
    relocation_site = models.ForeignKey(RelocationSite,
                                        default=None, blank=True, null=True,
                                        on_delete=models.SET_NULL)

    district = models.ForeignKey(District,
                                 default=None, blank=True, null=True,
                                 on_delete=models.SET_NULL)
    palika = models.ForeignKey(
        Palika,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    ward = models.ForeignKey(
        Ward,
        default=None, blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    place = models.CharField(max_length=256, blank=True)

    land_size = models.FloatField(default=None, blank=True, null=True)
    eligibility_source = models.CharField(max_length=256, blank=True)

    eligibility = models.CharField(max_length=256, blank=True)
    application = models.CharField(max_length=256, blank=True)
    result = models.CharField(max_length=256, blank=True)

    total_male = models.IntegerField(default=None, blank=True, null=True)
    total_female = models.IntegerField(default=None, blank=True, null=True)
    men_0_5 = models.IntegerField(default=None, blank=True, null=True)
    men_6_18 = models.IntegerField(default=None, blank=True, null=True)
    men_19_60 = models.IntegerField(default=None, blank=True, null=True)
    men_60_plus = models.IntegerField(default=None, blank=True, null=True)
    women_0_5 = models.IntegerField(default=None, blank=True, null=True)
    women_6_18 = models.IntegerField(default=None, blank=True, null=True)
    women_19_60 = models.IntegerField(default=None, blank=True, null=True)
    women_60_plus = models.IntegerField(default=None, blank=True, null=True)
    other = models.IntegerField(default=None, blank=True, null=True)

    tranches = models.IntegerField(default=None, blank=True, null=True)

    def __str__(self):
        return self.code
