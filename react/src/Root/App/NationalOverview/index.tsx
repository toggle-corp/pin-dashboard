import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    isNotDefined,
    listToMap,
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
    Base,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';

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
    metadaRequest: {
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

function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }
    return [item];
}

// TODO: Move to commmon utils
function getGeoJsonFromGeoAttributeList(geoAttributeList: GeoAttribute[]) {
    const geojson = {
        type: 'FeatureCollection',
        features: geoAttributeList
            .map(level => ({
                id: level.id,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        ...(level.centroid || []),
                    ],
                },
                properties: {
                    adminLevelId: level.id,
                    title: level.name,
                },
            })),
    };

    return geojson;
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

        requests.metadaRequest.setDefaultParams({
            setCountryData: this.setCountryData,
        });
    }

    // FIXME: this is a common method
    private getSubRegionsMap = memoize((metadata: Metadata | undefined) => {
        if (!metadata) {
            return {};
        }

        const { regions } = metadata;
        return listToMap(
            regions,
            region => region.geoAttribute.id,
            region => region,
        );
    })

    private getSubRegion = (metadata: Metadata | undefined, id: number) => {
        const subRegionMap = this.getSubRegionsMap(metadata);
        return subRegionMap[id];
    }

    private setCountryData = (metadata: Metadata) => {
        this.setState({ metadata });
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleDoubleClick = (id: number) => {
        const { onSubRegionDoubleClick } = this.props;
        const { metadata } = this.state;

        const subRegion = this.getSubRegion(metadata, id);
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

    private wrapInArray = memoize(wrapInArray);

    private renderHoverDetail = () => {
        const {
            hoveredId,
            metadata,
        } = this.state;

        if (!hoveredId) {
            return null;
        }

        const subRegion = this.getSubRegion(metadata, hoveredId);
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

    private getInformationDataForSelectedRegion = (
        title: string,
        metadata: Metadata | undefined,
        selectedId: number | undefined,
    ) => {
        if (!selectedId) {
            return {
                title,
                metadata,
            };
        }

        const subRegion = this.getSubRegion(metadata, selectedId);
        if (!subRegion) {
            return {};
        }

        const {
            geoAttribute: {
                name,
            },
        } = subRegion;

        return ({
            title: name,
            metadata: subRegion,
        });
    }

    private getLabelGeoJson = memoize((metadata?: Metadata) => {
        const { regions = [] } = metadata || {};
        const geoAttributes = regions.map(
            (r: Base) => r.geoAttribute,
        );

        const geoJson = getGeoJsonFromGeoAttributeList(geoAttributes);
        return geoJson;
    })

    private renderLegend = () => {
        const mostAffectedColor = '#0010A1';
        const affectedColor = '#3656f6';

        return (
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div
                        style={{
                            backgroundColor: affectedColor,
                        }}
                        className={styles.attr}
                    />
                    <div className={styles.label}>
                        Affected by earthquake
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
        );
    }

    public render() {
        const {
            className,
            requests: {
                metadaRequest: {
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
        } = this.getInformationDataForSelectedRegion(name, originalMetadata, selectedId);

        const labelGeoJson = this.getLabelGeoJson(originalMetadata);
        const subRegion = 'district';

        return (
            <div className={_cs(className, styles.nationalOverview)}>
                <div className={styles.hoverDetails}>
                    { this.renderHoverDetail() }
                </div>
                { this.renderLegend() }
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                />
                <MapSource
                    sourceKey={`national-source-for-${subRegion}`}
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
                    sourceKey="district-label"
                    geoJson={labelGeoJson}
                >
                    <MapLayer
                        layerKey="district-label"
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
