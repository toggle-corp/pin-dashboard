import logging
import requests
import os
import re

from django.conf import settings
from django.contrib.postgres import search
from fieldsight.models import Project
from geo.models import (
    Palika,
    District,
    Ward,
)
from metadata.models import (
    GeoSite,
    Household,
)

logger = logging.getLogger(__name__)


try:
    with open(os.path.join(settings.BASE_DIR, '.env')) as f:
        content = f.read()
except IOError:
    content = ''

for line in content.splitlines():
    m1 = re.match(r'\A([A-Za-z_0-9]+)=(.*)\Z', line)
    if m1:
        key, val = m1.group(1), m1.group(2)
        m2 = re.match(r"\A'(.*)'\Z", val)
        if m2:
            val = m2.group(1)
        m3 = re.match(r'\A"(.*)"\Z', val)
        if m3:
            val = re.sub(r'\\(.)', r'\1', m3.group(1))
        os.environ.setdefault(key, val)


def get_env(key):
    return os.environ.get(key)


def get_attr(datum, key):
    if key in datum:
        return datum[key]
    if 'attributes' in datum:
        return datum['attributes'].get(key)


def parse_number(text):
    matches = re.findall(r'\d+\.\d+', text)
    if len(matches) > 0:
        return matches[0] or 0
    return None


def parse_land_area(text):
    number = parse_number(text)
    return number and float(number) * 10000


def trigram_name_search(queryset, name_query):
    return queryset.annotate(
        similarity=search.TrigramSimilarity('name', str(name_query or '')),
    ).filter(similarity__gt=0.5)


class Loader:
    api = '{}/fieldsight/api/remote'.format(get_env('FS_URL'))
    headers = {
        'Authorization': 'Bearer {}'.format(get_env('FS_TOKEN')),
        'Referer': get_env('FS_ORIGIN'),
        'Origin': get_env('FS_ORIGIN'),
    }

    geosite_map = {
        'Risk_Score': 'risk_score',
        'High_risk_of': 'high_risk_of',
        'Direct_risk_for': 'direct_risk_for',
        'Potential_impact': 'potential_impact',
        'Risk_Probability': 'risk_probability',
        'Mitigation_work_by': 'mitigation_work_by',
        'Status': 'status',
        'Name_of_place': 'place',
        'Ward': 'ward',
    }

    household_map = {
        'Land_size_allocated_to_HH': 'land_size',
        'Eligibility_Source': 'eligibility_source',
        'Eligibility': 'eligibility',
        'Application': 'application',
        'Result': 'result',
        'Total_Male': 'total_male',
        'Total_Female': 'total_female',
        'Men_Age_0_5': 'men_0_5',
        'Men_Age_6_18': 'men_6_18',
        'Men_Age_19_60': 'men_19_60',
        'Men_Age_60_Plus': 'men_60_plus',
        'Women_Age_0_5': 'women_0_5',
        'Women_Age_6_18': 'women_6_18',
        'Women_Age_19_60': 'women_19_60',
        'Women_Age_60_Plus': 'women_60_plus',
    }

    household_parse_functions = {
        'Land_size_allocated_to_HH': parse_land_area,
    }

    household_defaults = {
        'Total_Male': 0,
        'Total_Female': 0,
        'Men_Age_0_5': 0,
        'Men_Age_6_18': 0,
        'Men_Age_19_60': 0,
        'Men_Age_60_Plus': 0,
        'Women_Age_0_5': 0,
        'Women_Age_6_18': 0,
        'Women_Age_19_60': 0,
        'Women_Age_60_Plus': 0,
    }

    def fetch_data(self, key, force=False):
        url = '{}/{}'.format(self.api, key)
        project, _ = Project.objects.get_or_create(key='key')

        params = {}
        if not force and project.last_updated_at:
            params['last_timestamp'] = project.last_updated_at

        r = requests.get(url, params=params, headers=self.headers)
        response = r.json()

        project.last_updated_at = int(response['timestamp'])
        project.save()

        if not response.get('updated'):
            return []

        return response['data']

    def fetch_geosites(self, force=False):
        data = self.fetch_data('geosites', force)
        for datum in data:
            try:
                logger.info('Collecting Geosites!!')
                self.load_geosite(datum)
            except Exception:
                logger.error('Fetch Geosites Failed!!', exc_info=True)

    def fetch_households(self, force=False):
        data = self.fetch_data('hh_registry', force)
        for datum in data:
            try:
                logger.info('Collecting Households!!')
                self.load_household(datum)
            except Exception:
                logger.error('Fetch Households Failed!!', exc_info=True)

    def load_geosite(self, datum):
        code = get_attr(datum, 'Geohazard_code')
        defaults = {}
        for key, value in self.geosite_map.items():
            defaults[value] = get_attr(datum, key)

        defaults['category'] = 'CAT{}'.format(get_attr(datum, 'Category'))
        defaults['latitude'] = get_attr(datum, 'latitude') or \
            datum['location'][1]
        defaults['longitude'] = get_attr(datum, 'longitude') or \
            datum['location'][0]

        defaults['district'] = trigram_name_search(District.objects, get_attr(datum, 'District')).first()
        defaults['palika'] = trigram_name_search(
            Palika.objects.filter(district__in=[defaults['district']]),
            get_attr(datum, 'Gaupalika'),
        ).first()
        defaults['ward'] = Ward.objects.filter(
            name=str(get_attr(datum, 'Ward')), palika__in=[defaults['palika']],
        ).first()

        [
            logger.warning(
                f">> Geosite: '{geo_dist}' not found for '{datum.get('id')}', "
                f"Provided data: {get_attr(datum, data_selector)}"
            )
            for geo_dist, data_selector in [
                ('district', 'District'),
                ('palika', 'Gaupalika'),
                ('ward', 'Ward'),
            ] if defaults[geo_dist] is None
        ]

        geosite, _ = GeoSite.objects.update_or_create(
            code=code,
            defaults=defaults,
        )

    def load_household(self, datum):
        code = get_attr(datum, 'DS_II_HH_Code')
        geosite = GeoSite.objects.filter(
            code=get_attr(datum, 'Geohazard_Code')
        ).first()

        if code is None:
            logger.error(
                f"Code isn't present in household id:{datum.get('id')}",
            )
            return

        defaults = {}
        for key, value in self.household_map.items():
            defaults[value] = get_attr(datum, key)
            if not defaults[value]:
                defaults[value] = self.household_defaults.get(key)
            else:
                function = self.household_parse_functions.get(key)
                if function:
                    defaults[value] = function(defaults[value])

        defaults['geosite'] = geosite

        defaults['relocated_lng'] = datum['location'][0]
        defaults['relocated_lat'] = datum['location'][1]
        defaults['solution_type'] = get_attr(datum, 'Solution_Type')

        try:
            defaults['district'] = trigram_name_search(District.objects, get_attr(datum, 'District_of_origin')).first()
            defaults['palika'] = trigram_name_search(
                Palika.objects.filter(district__in=[defaults['district']]),
                get_attr(datum, 'Gaupalika_Municipality'),
            ).first()
            defaults['ward'] = Ward.objects.filter(
                name=str(get_attr(datum, 'Ward')), palika__in=[defaults['palika']]
            ).first()

            [
                logger.warning(
                    f">> Household: '{geo_dist}' not found for '{code}', "
                    f"Provided data: {get_attr(datum, data_selector)}"
                )
                for geo_dist, data_selector in [
                    ('district', 'District_of_origin'),
                    ('palika', 'Gaupalika_Municipality'),
                    ('ward', 'Ward'),
                ] if defaults[geo_dist] is None
            ]
        except Exception:
            logger.error(f'Load Household({code}) Failed!!', exc_info=True)

        household, _ = Household.objects.update_or_create(
            code=code,
            defaults=defaults,
        )
