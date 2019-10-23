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
    RelocationSite,
    LandlessHousehold,
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


def clean_palika_name(palika_name):
    name = str(palika_name).lower()
    for remove_string in ['rural', 'municipality', 'r.m']:
        name = name.replace(remove_string, '')
    return name.strip().title()


def clean_ward_number(ward_number):
    name = str(ward_number)
    if name.find(',') != -1:
        name = name[:name.find(',')]
    return name.strip()


def log_geo_warning(data_type, code, datum, defaults, selectors):
    missing_warning_message = [
        f"  >> '{geo_dist}' not found"
        f", Provided data: {get_attr(datum, data_selector)}"
        f", used data: {query_name}"
        for geo_dist, data_selector, query_name in selectors
        if defaults[geo_dist] is None and query_name not in [None, '', 'None', '0']
    ]
    if missing_warning_message:
        logger.warning(f">> Missing Geo Attribute for {data_type} ID: {code}")
        logger.warning(
            '  -> ' +
            ' -> '.join([
                (
                    defaults[geo_dist] and f'(pk={defaults[geo_dist].pk}){defaults[geo_dist].name}'
                ) or 'None'
                for geo_dist, _, _ in selectors
            ])
        )
        [logger.warning(message) for message in missing_warning_message]


def trigram_name_search(queryset, name_query):
    return queryset.annotate(
        similarity=search.TrigramSimilarity('name', str(name_query or '')),
    ).filter(similarity__gt=0.3).order_by('-similarity')


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

    relocation_site_map = {
        'Site_Type': 'site_type',
        'Protection_Support': 'protection_support',
        'Technical Support': 'technical_support',
        'Name_of_Place': 'place',
        'Status': 'status',
    }

    landless_household_map = {
        'Result': 'result',
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
        'Tranches': 'tranches',
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

    def fetch_relocation_sites(self, force=False):
        data = self.fetch_data('ds2_pprisnd', force)
        for datum in data:
            try:
                logger.info('Collecting Relocation Sites!!')
                self.load_relocation_site(datum)
            except Exception:
                logger.error('Fetch Relocation Sites Failed!!', exc_info=True)

    def fetch_households(self, force=False):
        data = self.fetch_data('hh_registry', force)
        for datum in data:
            try:
                logger.info('Collecting Households!!')
                self.load_household(datum)
            except Exception:
                logger.error('Fetch Households Failed!!', exc_info=True)

    def fetch_landless_households(self, force=False):
        data = self.fetch_data('ds_landless', force)
        for datum in data:
            try:
                logger.info('Collecting Landless Households!!')
                self.load_landless_household(datum)
            except Exception:
                logger.error('Fetch Landless Households Failed!!', exc_inf=True)

    def load_relocation_site(self, datum):
        code = get_attr(datum, 'Relocation_Place_Code')
        defaults = {}

        for key, value in self.relocation_site_map.items():
            defaults[value] = get_attr(datum, key)

        defaults['latitude'] = get_attr(datum, 'Geo_point_Lat') or \
            datum['location'][1]
        defaults['longitude'] = get_attr(datum, 'Geo_point_Long') or \
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
                f">> Relocation Site: '{geo_dist}' not found for '{datum.get('id')}', "
                f"Provided data: {get_attr(datum, data_selector)}"
            )
            for geo_dist, data_selector in [
                ('district', 'District'),
                ('palika', 'Gaupalika'),
                ('ward', 'Ward'),
            ] if defaults[geo_dist] is None
        ]

        relocation_site, _ = RelocationSite.objects.update_or_create(
            code=code,
            defaults=defaults,
        )

    def load_geosite(self, datum):
        code = get_attr(datum, 'Geohazard_code')
        defaults = {}
        for key, value in self.geosite_map.items():
            defaults[value] = get_attr(datum, key)

        defaults['category'] = 'CAT{}'.format(get_attr(datum, 'Category'))
        defaults['latitude'] = get_attr(datum, 'latitude') or datum['location'][1]
        defaults['longitude'] = get_attr(datum, 'longitude') or datum['location'][0]

        district_name = get_attr(datum, 'District')
        palika_name = clean_palika_name(get_attr(datum, 'Gaupalika'))
        ward_name = clean_ward_number(get_attr(datum, 'Ward'))

        defaults['district'] = trigram_name_search(District.objects, district_name).first()
        defaults['palika'] = trigram_name_search(
            Palika.objects.filter(district__in=[defaults['district']]),
            palika_name,
        ).first()
        defaults['ward'] = Ward.objects.filter(name=ward_name, palika__in=[defaults['palika']]).first()

        log_geo_warning(
            'Geosite', datum.get('id'), datum, defaults, [
                ('district', 'District', district_name),
                ('palika', 'Gaupalika', palika_name),
                ('ward', 'Ward', ward_name),
            ],
        )

        geosite, _ = GeoSite.objects.update_or_create(
            code=code,
            defaults=defaults,
        )

    def load_landless_household(self, datum):
        identifier = get_attr(datum, 'LL HH Code')

        defaults = {}
        for key, value in self.landless_household_map.items():
            defaults[value] = get_attr(datum, key)
            if not defaults[value]:
                defaults[value] = self.household_defaults.get(key)
            else:
                function = self.household_parse_functions.get(key)
                if function:
                    defaults[value] = function(defaults[value])

        defaults['identifier'] = identifier

        try:
            district_name = get_attr(datum, 'District of Place of Origin')
            palika_name = clean_palika_name(get_attr(datum, 'GP NP of Place of Origin'))
            ward_name = clean_ward_number(get_attr(datum, 'Ward of Place of Origin'))

            defaults['district'] = trigram_name_search(District.objects, district_name).first()
            defaults['palika'] = trigram_name_search(
                Palika.objects.filter(district__in=[defaults['district']]),
                palika_name,
            ).first()
            defaults['ward'] = Ward.objects.filter(
                name=ward_name, palika__in=[defaults['palika']]
            ).first()

            log_geo_warning(
                'Household', identifier, datum, defaults, [
                    ('district', 'District of Place of Origin', district_name),
                    ('palika', 'GP NP of Place of Origin', palika_name),
                    ('ward', 'Ward of Place of Origin', ward_name),
                ],
            )

        except Exception:
            logger.error(f'Load Landless Household({identifier}) Failed!!', exc_info=True)

        landless_household, _ = LandlessHousehold.objects.update_or_create(
            identifier=identifier,
            defaults=defaults,
        )

    def load_household(self, datum):
        code = get_attr(datum, 'DS_II_HH_Code')
        geosite = GeoSite.objects.filter(
            code=get_attr(datum, 'Geohazard_Code')
        ).first()
        relocation_site = RelocationSite.objects.filter(
            code=get_attr(datum, 'Relocation_Place_Code')
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
        defaults['relocation_site'] = relocation_site

        try:
            district_name = get_attr(datum, 'District_of_origin')
            palika_name = clean_palika_name(get_attr(datum, 'Gaupalika_Municipality'))
            ward_name = clean_ward_number(get_attr(datum, 'Ward'))

            defaults['district'] = trigram_name_search(District.objects, district_name).first()
            defaults['palika'] = trigram_name_search(
                Palika.objects.filter(district__in=[defaults['district']]),
                palika_name,
            ).first()
            defaults['ward'] = Ward.objects.filter(
                name=ward_name, palika__in=[defaults['palika']]
            ).first()

            log_geo_warning(
                'Household', code, datum, defaults, [
                    ('district', 'District_of_origin', district_name),
                    ('palika', 'Gaupalika_Municipality', palika_name),
                    ('ward', 'Ward', ward_name),
                ],
            )

        except Exception:
            logger.error(f'Load Household({code}) Failed!!', exc_info=True)

        household, _ = Household.objects.update_or_create(
            code=code,
            defaults=defaults,
        )
