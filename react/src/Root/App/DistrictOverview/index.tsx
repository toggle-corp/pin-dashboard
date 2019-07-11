import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import {
    Metadata,
    mapSources,
    mapStyles,
    GeoAttribute,
} from '#constants';
import Information from '../Information';

import styles from './styles.scss';

interface State {
    hoveredId?: number;
    selectedId?: number;
}

interface Props {
    className?: string;
    district?: GeoAttribute;
    onBackButtonClick?: () => void;
}

interface Params {}

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
        url: ({ props }) => `/metadata/district/${props.district && props.district.id}`,
        method: methods.GET,
        onMount: ({ props }) => !!props.district && !!props.district.id,
    },
};

type MyProps = NewProps<Props, Params>;

function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }

    return [item];
}

class DistrictOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {};
    }

    private getInformationDataForSelectedRegion = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
            district,
        } = this.props;

        if (!district) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        const metadata = response as Metadata;

        const { selectedId } = this.state;

        if (!selectedId) {
            return {
                title: district.name,
                metadata,
            };
        }

        const palikaData = metadata && metadata.regions
            ? metadata.regions.find(region => region.geoAttribute.id === selectedId)
            : undefined;

        if (!palikaData) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        return ({
            title: palikaData.geoAttribute.name,
            metadata: palikaData,
        });
    }

    private wrapInArray = memoize(wrapInArray);

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleDoubleClick = (id: number) => {
        console.warn('double click', id);
    }

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedId } = this.state;
        const newId = selectedId === id ? undefined : id;
        this.setState({ selectedId: newId });
    }

    public render() {
        const {
            className,
            requests: {
                metadaRequest: {
                    pending: pendingMetadataRequest,
                },
            },
            onBackButtonClick,
            district,
        } = this.props;

        const {
            selectedId,
            hoveredId,
        } = this.state;

        const {
            title,
            metadata,
        } = this.getInformationDataForSelectedRegion();

        let filter;
        if (district) {
            filter = [
                '==',
                ['get', 'district'],
                district.id,
            ];
        }

        return (
            <div className={_cs(className, styles.districtOverview)}>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                    showBackButton
                    onBackButtonClick={onBackButtonClick}
                />
                <MapSource
                    sourceKey="district-geo"
                    url={mapSources.nepal.url}
                    bounds={district ? district.bbox : undefined}
                >
                    <MapLayer
                        layerKey="palika-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.palika}
                        paint={mapStyles.palika.fill}
                        filter={filter}
                        enableHover
                        hoveredId={hoveredId}
                        onHoverChange={this.handleHoverChange}
                        onDoubleClick={this.handleDoubleClick}
                        enableSelection
                        selectedIds={this.wrapInArray(selectedId)}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        layerKey="palika-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.palika}
                        paint={mapStyles.palika.outline}
                        filter={filter}
                    />
                </MapSource>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        DistrictOverview,
    ),
);
