import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    isNotDefined,
} from '@togglecorp/fujs';
import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import {
    Metadata,
    mapSources,
    mapStyles,
    districtsAffected,
    GeoAttribute,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';

import styles from './styles.scss';

interface Props {
    className?: string;
    metadata?: Metadata;
    country: GeoAttribute;
    onDistrictDoubleClick?: (geoAttribute: GeoAttribute) => void;
}

interface Params {}

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
        url: '/metadata/country/',
        method: methods.GET,
        onMount: true,
        /*
        extras: {
            schemaName: 'alertResponse',
        },
        */
    },
};

type MyProps = NewProps<Props, Params>;

interface State {
    mapState: {
        id: number;
        value: { type: string };
    }[];
    hoveredId?: number;
    selectedId?: number;
}

function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }
    return [item];
}

class NationalOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            mapState: districtsAffected,
        };
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleDoubleClick = (id: number) => {
        const { onDistrictDoubleClick } = this.props;

        const {
            requests: {
                metadaRequest: { response },
            },
        } = this.props;

        const metadata = response as Metadata;
        // FIXME: prepare district map in constants
        const districtData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === id,
        );

        if (!districtData) {
            return;
        }

        if (onDistrictDoubleClick) {
            onDistrictDoubleClick(districtData.geoAttribute);
        }
    }

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedId } = this.state;
        const newId = selectedId === id ? undefined : id;
        this.setState({ selectedId: newId });
    }

    private wrapInArray = memoize(wrapInArray);

    private renderHoverDetail = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
        } = this.props;

        const { hoveredId } = this.state;

        if (!hoveredId) {
            return null;
        }

        // FIXME: prepare district map in constants
        const metadata = response as Metadata;
        const districtData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === hoveredId,
        );

        if (!districtData) {
            return null;
        }

        const {
            landslidesSurveyed,
            geoAttribute: {
                name: districtName,
            },
        } = districtData;

        return (
            <HoverDetails
                districtName={districtName}
                landslidesSurveyed={landslidesSurveyed}
            />
        );
    }

    private getInformationDataForSelectedRegion = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
            country,
        } = this.props;

        const metadata = response as Metadata;

        const { selectedId } = this.state;

        if (!selectedId) {
            return {
                metadata,
                title: country.name,
            };
        }

        // FIXME: prepare district map in constants
        const districtData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === selectedId,
        );

        if (!districtData) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        const {
            geoAttribute: {
                name: districtName,
            },
        } = districtData;

        return ({
            title: districtName,
            metadata: districtData,
        });
    }

    public render() {
        const {
            className,
            requests: {
                metadaRequest: {
                    pending: pendingMetadataRequest,
                },
            },
            country,
        } = this.props;

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
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                />
                <MapSource
                    sourceKey="national-geo"
                    url={mapSources.nepal.url}
                    bounds={country.bbox}
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
                        onDoubleClick={this.handleDoubleClick}
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

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        NationalOverview,
    ),
);
