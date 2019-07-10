import React from 'react';
import memoize from 'memoize-one';
import { _cs, isNotDefined } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import {
    Metadata,
    mapSources,
    mapStyles,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';

import styles from './styles.scss';

interface Props {
    className?: string;
    metadata?: Metadata;
    title?: string;
}


interface State {
    mapState: {
        id: number;
        value: { type: string };
    }[];
    hoveredId?: number;
    selectedId?: number;
}

// FIXME: get this from server later
const affectedDistricts: number[] = [
    40,
    50,
    29,
    9,
    35,
    26,
    7,
    22,
    44,
    41,
    46,
    27,
    30,
    12,
    28,
    45,
    31,
    49,
    481,
    482,
    25,
    13,
    39,
    51,
    21,
    23,
    10,
    20,
    24,
    11,
    42,
    43,
];

// FIXME: get this from server later
const mostAffectedDistricts: number[] = [
    29,
    26,
    22,
    44,
    27,
    30,
    28,
    31,
    25,
    13,
    21,
    23,
    20,
    24,
];

// FIXME: this is temporary layer
const districts: { [key: string]: string } = {
    1: 'Taplejung',
    2: 'Panchthar',
    3: 'Ilam',
    4: 'Jhapa',
    5: 'Morang',
    6: 'Sunsari',
    7: 'Dhankuta',
    8: 'Terhathum',
    9: 'Bhojpur',
    10: 'Sankhuwasabha',
    11: 'Solukhumbu',
    12: 'Khotang',
    13: 'Okhaldhunga',
    14: 'Udayapur',
    15: 'Siraha',
    16: 'Saptari',
    17: 'Dhanusa',
    18: 'Mahottari',
    19: 'Sarlahi',
    20: 'Sindhuli',
    21: 'Ramechhap',
    22: 'Dolakha',
    23: 'Rasuwa',
    24: 'Sindhupalchok',
    25: 'Nuwakot',
    26: 'Dhading',
    27: 'Kathmandu',
    28: 'Lalitpur',
    29: 'Bhaktapur',
    30: 'Kavrepalanchok',
    31: 'Makwanpur',
    32: 'Rautahat',
    33: 'Bara',
    34: 'Parsa',
    35: 'Chitwan',
    37: 'Rupandehi',
    38: 'Kapilbastu',
    39: 'Palpa',
    40: 'Arghakhanchi',
    41: 'Gulmi',
    42: 'Syangja',
    43: 'Tanahu',
    44: 'Gorkha',
    45: 'Lamjung',
    46: 'Kaski',
    47: 'Manang',
    48: 'Mustang',
    49: 'Myagdi',
    50: 'Baglung',
    51: 'Parbat',
    52: 'Dang',
    53: 'Pyuthan',
    54: 'Rolpa',
    55: 'Salyan',
    57: 'Dolpa',
    58: 'Mugu',
    59: 'Humla',
    60: 'Jumla',
    61: 'Kalikot',
    62: 'Jajarkot',
    63: 'Dailekh',
    64: 'Surkhet',
    65: 'Bardiya',
    66: 'Banke',
    67: 'Kailali',
    68: 'Doti',
    69: 'Achham',
    70: 'Bajura',
    71: 'Bajhang',
    72: 'Darchula',
    73: 'Baitadi',
    74: 'Dadeldhura',
    75: 'Kanchanpur',
    481: 'Nawalpur',
    482: 'Parasi',
    541: 'Rukum East',
    542: 'Rukum West',
};

function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }
    return [item];
}

class NationalOverview extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        const mapState = [
            ...affectedDistricts.map(key => ({
                id: key,
                value: { type: 'affected-district' },
            })),
            ...mostAffectedDistricts.map(key => ({
                id: key,
                value: { type: 'most-affected-district' },
            })),
        ];

        this.state = {
            mapState,
        };
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedId } = this.state;
        const newId = selectedId === id ? undefined : id;
        this.setState({ selectedId: newId });
    }

    private wrapInArray = memoize(wrapInArray);

    private renderHoverDetail = () => {
        const {
            metadata,
        } = this.props;

        const { hoveredId } = this.state;

        if (!hoveredId) {
            return null;
        }

        // FIXME: this is temporary layer
        const districtName = hoveredId
            ? districts[hoveredId]
            : undefined;
        const districtData = districtName && metadata && metadata.districts
            ? metadata.districts[districtName]
            : undefined;

        if (!districtData) {
            return null;
        }

        return (
            <HoverDetails
                districtName={districtName}
                landslidesSurveyed={districtData.landslidesSurveyed}
            />
        );
    }

    private getInformationDataForSelectedRegion = () => {
        const {
            title,
            metadata,
        } = this.props;

        const { selectedId } = this.state;

        if (!selectedId) {
            return {
                metadata,
                title,
            };
        }

        const districtName = selectedId
            ? districts[selectedId]
            : undefined;

        const districtData = districtName && metadata && metadata.districts
            ? metadata.districts[districtName]
            : undefined;

        if (!districtData) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        return ({
            title: districtName,
            metadata: districtData,
        });
    }

    public render() {
        const {
            className,
            // metadata,
            // title,
        } = this.props;

        const sourceKey = 'national-overview';

        const {
            mapState,
            selectedId,
            hoveredId,
        } = this.state;

        const {
            title,
            metadata,
        } = this.getInformationDataForSelectedRegion();

        return (
            <div className={_cs(className, styles.nationalOverview)}>
                {this.renderHoverDetail()}
                <Information
                    className={styles.information}
                    data={metadata as Metadata}
                    title={title}
                />
                <MapSource
                    sourceKey={`${sourceKey}-geo-outline`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="district-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.fill}
                        mapState={mapState}
                        enableHover
                        hoveredId={hoveredId}
                        onHoverChange={this.handleHoverChange}
                        enableSelection
                        selectedIds={this.wrapInArray(selectedId)}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                    />
                </MapSource>
            </div>
        );
    }
}

export default NationalOverview;
