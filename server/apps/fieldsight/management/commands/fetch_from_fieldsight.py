from datetime import datetime
from django.core.cache import cache
from django.core.management.base import BaseCommand

from fieldsight.loader import Loader
from geo.models import District, Palika
from metadata.views import MetadataView


# Collected from react/src/constants/index.ts
AFFECTED_DISTRICTS = [
    40, 50, 29, 9, 35, 26, 7, 22, 44, 41,
    46, 27, 30, 12, 28, 45, 31, 49, 481, 482,
    25, 13, 39, 51, 21, 23, 10, 20, 24, 11, 42, 43,
]

MOST_AFFECTED_DISTRICTS = [
    29, 26, 22, 44, 27, 30,
    28, 31, 25, 13, 21, 23,
    20, 24,
]

DISTRICTS_TO_CACHE = list(set(AFFECTED_DISTRICTS + MOST_AFFECTED_DISTRICTS))


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        start_time = datetime.now()
        loader = Loader()
        loader.fetch_geosites(force=True)
        loader.fetch_relocation_sites(force=True)
        loader.fetch_households(force=True)
        loader.fetch_landless_households(force=True)

        start_cache_time = datetime.now()

        # Cache Country Metadata
        time = datetime.now()
        data = MetadataView._get()
        cache.set(MetadataView.COUNTRY_CACHE_KEY, data, None)
        print(f'CACHING Country METADATA\t{str(datetime.now() - time)}')

        # Cache District Metadata
        print('CACHING District METADATA')
        queryset = District.objects.filter(pk__in=DISTRICTS_TO_CACHE)
        count, index = queryset.count(), 1
        for id, name in queryset.values_list('id', 'name'):
            time = datetime.now()
            cache_key = MetadataView.DISTRICT_CACHE_KEY.format(id)
            data = MetadataView._get(district_id=id)
            cache.set(cache_key, data, None)
            print(f'  >> ({index}/{count}) {id}:{name}\t{str(datetime.now() - time)}')
            index += 1

        # Cache Palika Metadata
        print('CACHING Palika METADATA')
        queryset = Palika.objects.filter(district__in=DISTRICTS_TO_CACHE)
        count, index = queryset.count(), 1
        for id, name in queryset.values_list('id', 'name'):
            time = datetime.now()
            cache_key = MetadataView.PALIKA_CACHE_KEY.format(id)
            data = MetadataView._get(palika_id=id)
            cache.set(cache_key, data, None)
            print(f'  >> ({index}/{count}) {id}:{name}\t{str(datetime.now() - time)}')
            index += 1

        print(f'Total Cache time: {str(datetime.now() - start_cache_time)}')
        print(f'Total time: {str(datetime.now() - start_time)}')
