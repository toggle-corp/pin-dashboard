import React from 'react';
import memoize from 'memoize-one';
import { _cs, isNotDefined } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { Metadata, mapSources, mapStyles } from '#constants';
import Information from '../Information';

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

    public render() {
        const {
            className,
            metadata,
            title,
        } = this.props;

        const sourceKey = 'national-overview';

        const {
            mapState,
            selectedId,
            hoveredId,
        } = this.state;

        return (
            <div className={_cs(className, styles.nationalOverview)}>
                { selectedId && (
                    <div>
                        Selected
                        {selectedId}
                    </div>
                )}
                { !selectedId && hoveredId && (
                    <div>
                        Hovered
                        {hoveredId}
                    </div>
                )}
                <Information
                    className={styles.information}
                    data={metadata}
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
