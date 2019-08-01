from django.core.cache import cache
from django.conf import settings
from django.db import models
from django.shortcuts import get_object_or_404

from rest_framework import (
    views,
    response,
)
from geo.models import (
    District, Palika, Ward
)
from .serializers import (
    CountrySerializer,
    DistrictDetailSerializer,
    PalikaDetailSerializer,
)
from .models import (
    GeoSite,
    Household,
    RelocationSite,
)

from fieldsight.loader import Loader


def get_counts(qs):
    count_list = qs.values('name').annotate(count=models.Count('name'))
    return {
        item['name']: item['count']
        for item in count_list
        if item['name']
    }


class CatPoint:
    def __init__(self, geosite):
        self.geosite = geosite
        self.latitude = geosite.latitude
        self.longitude = geosite.longitude

        self.landslide_code = geosite.code
        self.landslide_cat = geosite.category

        # FIXME: sometime palika is undefined
        self.gp_name = geosite.palika and geosite.palika.name

        self.place = geosite.place

        self.households = geosite.household_set
        self.hh_affected = self.households.count()
        self.risk_score = geosite.risk_score
        self.high_risk_of = geosite.high_risk_of
        self.direct_risk_for = geosite.direct_risk_for
        self.potential_impact = geosite.potential_impact
        self.risk_probability = geosite.risk_probability

        self.relocation_sites = RelocationSite.objects.filter(household__geosite=geosite).distinct()


class Cat2Point(CatPoint):
    def __init__(self, geosite):
        super().__init__(geosite)
        self.mitigation_work_status = geosite.status
        self.mitigation_work_by = geosite.mitigation_work_by or 'N/A'


class Cat3Point(CatPoint):
    def __init__(self, geosite):
        super().__init__(geosite)
        self.eligible_households = self.households\
            .filter(eligibility__contains='Yes').count()
        self.households_relocated = self.households\
            .filter(result__contains='Relocated').count()


class Metadata:
    # We have not used get_xxx naming specification below
    # so that these attributes will be directly mapped with the serializer
    # fields.
    def __init__(self, district=None, palika=None, ward=None):
        self.district = district
        self.palika = palika
        self.ward = ward
        self.gs = GeoSite.objects
        self.hh = Household.objects

        if self.ward:
            self.gs = self.gs.filter(ward=ward)
            self.hh = self.hh.filter(ward=ward)
        elif self.palika:
            self.gs = self.gs.filter(palika=palika)
            self.hh = self.hh.filter(palika=palika)
        elif self.district:
            self.gs = self.gs.filter(district=district)
            self.hh = self.hh.filter(district=district)

    def landslides_surveyed(self):
        return get_counts(
            self.gs.annotate(name=models.F('category')),
        )

    def landslides_risk_score(self):
        return get_counts(
            self.gs.annotate(name=models.F('risk_score')),
        )

    def land_purchased(self):
        return self.hh.aggregate(
            total=models.Sum('land_size')
        )['total'] or 0

    def geohazard_affected(self):
        hh = self.hh.filter(eligibility_source='Geohazard')
        return {
            'eligible': hh.filter(eligibility__contains='Yes').count(),
            'relocated': hh.filter(result__contains='Relocated').count(),
            'total': hh.count(),
        }

    def people_relocated(self):
        hh = self.hh.filter(eligibility_source='Geohazard')
        hh = hh.filter(result__contains='Relocated')
        return {
            'male': hh.aggregate(total=models.Sum(
                models.F('total_male')
            ))['total'] or 0,
            'female': hh.aggregate(total=models.Sum(
                models.F('total_female')
            ))['total'] or 0,
            'children_male': hh.aggregate(total=models.Sum(
                models.F('men_0_5') + models.F('men_6_18')
            ))['total'] or 0,
            'children_female': hh.aggregate(total=models.Sum(
                models.F('women_0_5') + models.F('women_6_18')
            ))['total'] or 0,
            'elderly_male': hh.aggregate(total=models.Sum(
                models.F('men_60_plus')
            ))['total'] or 0,
            'elderly_female': hh.aggregate(total=models.Sum(
                models.F('women_60_plus')
            ))['total'] or 0,
        }

    def districts(self):
        return [
            Metadata(district=district) for district in District.objects.all()
        ]

    def palikas(self):
        return [
            Metadata(palika=palika)
            for palika
            in Palika.objects.filter(district=self.district).all()
        ]

    def wards(self):
        return [
            Metadata(ward=ward)
            for ward
            in Ward.objects.filter(palika=self.palika).all()
        ]

    def total_households(self):
        hh = self.hh.filter(eligibility_source='Geohazard')
        hh = hh.filter(result__contains='Relocated')
        return hh.count()

    def relocation_points(self):
        filter_query = {'district': self.district}
        if self.ward:
            filter_query = {'ward': self.ward}
        elif self.palika:
            filter_query = {'palika': self.palika}
        return [
            RelocationPoint(hh)
            for hh
            in Household.objects.filter(
                **filter_query,
                geosite__isnull=False,
            )
        ]

    def cat2_points(self):
        filter_query = {'district': self.district}
        if self.ward:
            filter_query = {'ward': self.ward}
        elif self.palika:
            filter_query = {'palika': self.palika}
        return [
            Cat2Point(gs)
            for gs
            in GeoSite.objects.filter(
                **filter_query,
                category__iexact='cat2',
            ).prefetch_related('palika', 'household_set')
        ]

    def cat3_points(self):
        filter_query = {'district': self.district}
        if self.ward:
            filter_query = {'ward': self.ward}
        elif self.palika:
            filter_query = {'palika': self.palika}
        return [
            Cat3Point(gs)
            for gs
            in GeoSite.objects.filter(
                **filter_query,
                category__iexact='cat3',
            ).prefetch_related('palika', 'household_set')
        ]


class MetadataView(views.APIView):
    DISTRICT_CACHE_KEY = 'pin-district-metadata-cache-{}'
    PALIKA_CACHE_KEY = 'pin-palika-metadata-cache-{}'
    COUNTRY_CACHE_KEY = 'pin-country-metadata-cache-nepal'

    @staticmethod
    def _get(district_id=None, palika_id=None):
        loader = Loader()

        try:
            loader.fetch_geosites()
            loader.fetch_households()
        except Exception:
            pass

        if district_id:
            district = get_object_or_404(District, pk=district_id)
            metadata = Metadata(district=district)
            serializer = DistrictDetailSerializer(metadata)
        elif palika_id:
            palika = get_object_or_404(Palika, pk=palika_id)
            metadata = Metadata(palika=palika)
            serializer = PalikaDetailSerializer(metadata)
        else:
            metadata = Metadata()
            serializer = CountrySerializer(metadata)
        return serializer.data

    def get(self, request, district_id=None, palika_id=None):
        if not settings.CACHE_METADATA:
            print('NOT CACHING')
            return MetadataView._get(district_id, palika_id)

        cache_key = self.COUNTRY_CACHE_KEY
        if district_id:
            cache_key = self.DISTRICT_CACHE_KEY.format(district_id)
        elif palika_id:
            cache_key = self.PALIKA_CACHE_KEY.format(palika_id)

        data = cache.get(cache_key)
        if data is None:
            data = MetadataView._get(district_id, palika_id)
            cache.set(cache_key, data)

        return response.Response(data)
