import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';
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
    Base,
} from '#constants';
import {
    getGeoJsonFromGeoAttributeList,
    getSubRegion,
    wrapInArray,
    getInformationDataForSelectedRegion,
} from '#utils/common';

import Information from '#components/Information';
import HoverDetails from '#components/HoverDetails';

import styles from './styles.scss';

interface Props {
    className?: string;
    metadata?: Metadata;
    region: GeoAttribute;
    onSubRegionDoubleClick?: (geoAttribute: GeoAttribute) => void;
}

interface Params {
    setCountryData: (response: Metadata) => void;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    metadataRequest: {
        url: '/metadata/country/',
        method: methods.GET,
        onMount: true,
        onSuccess: (val) => {
            const { params, response } = val;
            if (params && params.setCountryData) {
                params.setCountryData(response as Metadata);
            }
        },
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

    metadata?: Metadata;
}

class NationalOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            mapState: districtsAffected,
        };

        const {
            requests,
        } = this.props;

        requests.metadataRequest.setDefaultParams({
            setCountryData: this.setCountryData,
        });
    }

    private wrapInArray = memoize(wrapInArray);

    private setCountryData = (metadata: Metadata) => {
        this.setState({ metadata });
    }

    private getLabelGeoJson = memoize((metadata?: Metadata) => {
        const { regions = [] } = metadata || {};
        const geoAttributes = regions.map(
            (r: Base) => r.geoAttribute,
        );

        const geoJson = getGeoJsonFromGeoAttributeList(geoAttributes);
        return geoJson;
    })

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleDoubleClick = (id: number) => {
        const { onSubRegionDoubleClick } = this.props;
        const { metadata } = this.state;

        const subRegion = getSubRegion(metadata, id);
        if (!subRegion) {
            return;
        }

        const { geoAttribute } = subRegion;

        if (onSubRegionDoubleClick) {
            onSubRegionDoubleClick(geoAttribute);
        }
    }

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedId } = this.state;
        const newId = selectedId === id ? undefined : id;
        this.setState({ selectedId: newId });
    }

    private renderHoverDetail = () => {
        const {
            hoveredId,
            metadata,
        } = this.state;

        if (!hoveredId) {
            return null;
        }

        const subRegion = getSubRegion(metadata, hoveredId);
        if (!subRegion) {
            return null;
        }

        const {
            landslidesSurveyed,
            geoAttribute: {
                name,
            },
        } = subRegion;

        return (
            <HoverDetails
                name={name}
                landslidesSurveyed={landslidesSurveyed}
            />
        );
    }

    public render() {
        const {
            className,
            requests: {
                metadataRequest: {
                    pending: pendingMetadataRequest,
                },
            },
            region: {
                bbox,
                name,
            },
        } = this.props;

        const {
            mapState,
            metadata: originalMetadata,
            selectedId,
            hoveredId,
        } = this.state;

        const {
            title,
            metadata,
        } = getInformationDataForSelectedRegion(name, originalMetadata, selectedId);

        const labelGeoJson = this.getLabelGeoJson(originalMetadata);
        const region = 'national';
        const subRegion = 'district';
        const mostAffectedColor = '#0010A1';
        const affectedColor = '#3656f6';

        return (
            <div className={_cs(className, styles.overview)}>
                <div className={styles.hoverDetails}>
                    { this.renderHoverDetail() }
                </div>
                <div className={styles.legend}>
                    <div className={styles.legendItem}>
                        <div
                            style={{
                                backgroundColor: affectedColor,
                            }}
                            className={styles.attr}
                        />
                        <div className={styles.label}>
                            Less affected by earthquake
                        </div>
                    </div>
                    <div className={styles.legendItem}>
                        <div
                            style={{
                                backgroundColor: mostAffectedColor,
                            }}
                            className={styles.attr}
                        />
                        <div className={styles.label}>
                            Most affected by earthquake
                        </div>
                    </div>
                </div>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                />
                <MapSource
                    sourceKey={`${region}-source-for-${subRegion}`}
                    url={mapSources.nepal.url}
                    bounds={bbox}
                >
                    <MapLayer
                        layerKey={`${subRegion}-fill`}
                        type="fill"
                        sourceLayer={mapSources.nepal.layers[subRegion]}
                        paint={mapStyles[subRegion].fill}
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
                        layerKey={`${subRegion}-outline`}
                        type="line"
                        sourceLayer={mapSources.nepal.layers[subRegion]}
                        paint={mapStyles[subRegion].outline}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegion}-label`}
                    geoJson={labelGeoJson}
                >
                    <MapLayer
                        layerKey={`${subRegion}-label`}
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.districtLabel.paint}
                        layout={mapStyles.districtLabel.layout}
                    />
                </MapSource>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requestOptions)(
        NationalOverview,
    ),
);
