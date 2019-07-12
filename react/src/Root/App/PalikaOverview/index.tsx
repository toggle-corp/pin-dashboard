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
    RelocationPoint,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';

import styles from './styles.scss';

interface State {
    hoveredId?: number;
    selectedId?: number;
}

interface Props {
    className?: string;
    palika?: GeoAttribute;
    onBackButtonClick?: () => void;
}

interface Params {}

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
        // url: ({ props }) => `/metadata/plaika/${props.palika && props.palika.id}`,
        // TODO: remove this when palika API is done
        url: '/metadata/district/44',
        method: methods.GET,
        onMount: ({ props }) => !!props.palika && !!props.palika.id,
    },
};

type MyProps = NewProps<Props, Params>;

// TODO: Move to commmon utils
function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }

    return [item];
}

// TODO: Move to commmon utils
function convertToGeoJson(catPoints: RelocationPoint[] | undefined = []) {
    const geojson = {
        type: 'FeatureCollection',
        features: catPoints
            .map((catPoint, i) => ({
                id: i,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        catPoint.longitude,
                        catPoint.latitude,
                    ],
                },
                properties: {
                    ...catPoint,
                },
            })),
    };
    return geojson;
}

class PalikaOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {};
    }

    private getInformationDataForSelectedRegion = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
            palika,
        } = this.props;

        if (!palika) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        const metadata = response as Metadata;

        const { selectedId } = this.state;

        if (!selectedId) {
            return {
                title: palika.name,
                metadata,
            };
        }

        const wardData = metadata && metadata.regions
            ? metadata.regions.find(region => region.geoAttribute.id === selectedId)
            : undefined;

        if (!wardData) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        return ({
            title: wardData.geoAttribute.name,
            metadata: wardData,
        });
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

        // FIXME: prepare palika map in constants
        const metadata = response as Metadata;
        const wardData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === hoveredId,
        );

        if (!wardData) {
            return null;
        }

        const {
            landslidesSurveyed,
            geoAttribute: {
                name: wardName,
            },
        } = wardData;

        return (
            <HoverDetails
                name={wardName}
                landslidesSurveyed={landslidesSurveyed}
            />
        );
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
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
                    response,
                },
            },
            onBackButtonClick,
            palika,
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
        if (palika) {
            filter = [
                '==',
                ['get', 'municipality'],
                palika.id,
            ];
        }

        const palikaMetadata = response as Metadata;
        const cat2PointsGeoJson = convertToGeoJson(
            palikaMetadata ? palikaMetadata.cat2Points : undefined,
        );

        const cat3PointsGeoJson = convertToGeoJson(
            palikaMetadata ? palikaMetadata.cat3Points : undefined,
        );

        return (
            <div className={_cs(className, styles.palikaOverview)}>
                {this.renderHoverDetail()}
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                    showBackButton
                    onBackButtonClick={onBackButtonClick}
                />
                <MapSource
                    sourceKey="ward-geo"
                    url={mapSources.nepal.url}
                    bounds={palika ? palika.bbox : undefined}
                >
                    <MapLayer
                        layerKey="ward-fill"
                        type="fill"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.fill}
                        filter={filter}
                        enableHover
                        hoveredId={hoveredId}
                        onHoverChange={this.handleHoverChange}
                        enableSelection
                        selectedIds={this.wrapInArray(selectedId)}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        layerKey="ward-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.ward}
                        paint={mapStyles.ward.outline}
                        filter={filter}
                    />
                </MapSource>
                <MapSource
                    sourceKey="palika-cat2-points"
                    geoJson={cat2PointsGeoJson}
                >
                    <MapLayer
                        layerKey="cat2-points-circle"
                        type="circle"
                        paint={mapStyles.cat2Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="palika-cat3-points"
                    geoJson={cat3PointsGeoJson}
                >
                    <MapLayer
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={mapStyles.cat3Point.circle}
                    />
                </MapSource>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        PalikaOverview,
    ),
);
