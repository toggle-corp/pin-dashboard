import os
import json
import click


CODE_BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


DATA_EXTRACTOR = {
    'province': lambda prop: {
        'name': prop['title'],
    },
    'district': lambda prop: {
        'name': prop['title'],
        'province': prop['province'],
    },
    'palika': lambda prop: {
        'name': prop['title'],
        'district': prop['district'],
    },
    'ward': lambda prop: {
        'name': prop['title'],
        'palika': prop['municipality'],
    },
}


def parse_geo_data(division_type, geodata):
    collections = []
    for feature in geodata['features']:
        collections.append({
            'model': f'geo.{division_type}',
            'pk': feature['id'],
            'fields': DATA_EXTRACTOR[division_type](feature['properties']),
        })
    collections.sort(key=lambda d: d['pk'])
    return collections


DIVISIONS = DATA_EXTRACTOR.keys()
@click.command()
@click.argument('division-type', type=click.Choice(DIVISIONS))
@click.argument('geo-file', type=click.File('r'))
@click.option('--output-file')
def run(division_type, geo_file, output_file=None):
    data = parse_geo_data(division_type, json.load(geo_file))
    output_file = output_file or os.path.join(
        CODE_BASE_DIR, 'apps/geo/fixtures', f'{division_type}.json',
    )
    with open(output_file, 'w') as fp:
        json.dump(data, fp, indent=4)


if __name__ == '__main__':
    run()
