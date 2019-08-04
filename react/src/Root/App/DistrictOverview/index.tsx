import React from 'react';
import memoize from 'memoize-one';
import { _cs, isDefined, isNotDefined } from '@togglecorp/fujs';

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
    wrapInArray,
    concatArray,
    getGeoJsonFromGeoAttributeList,
    getPlottableMapLayersFromRiskPoints,
    getNewMapStateOnRiskPointHoverChange,
    getNewMapStateOnRelocationHoverChange,
    getInformationDataForSelectedRegion,
    getSubRegion,
} from '#utils/common';

import {
    Metadata,
    mapSources,
    mapStyles,
    GeoAttribute,
    Base,
    RiskPoint,
    MapStateElement,
} from '#constants';

import Information from '#components/Information';
import HoverDetails from '#components/HoverDetails';
import RiskPointHoverDetails from '#components/RiskPointHoverDetails';

import styles from './styles.scss';

interface State {
    hoveredRegionId?: number;
    selectedRegionId?: number;

    hoveredCat2PointId?: number;
    hoveredCat3PointId?: number;
    hoveredISRelocationPointId?: number;
    hoveredPLRelocationPointId?: number;

    mapState: MapStateElement[];

    metadata?: Metadata;
}

interface Props {
    className?: string;
    region?: GeoAttribute;
    onBackButtonClick?: () => void;
    onSubRegionDoubleClick?: (geoAttribute: GeoAttribute) => void;
}

interface Params {
    setRegionMetadata: (response: Metadata) => void;
}

const regionLevel = 'district';
const subRegionLevel = 'palika';

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    metadataRequest: {
        url: ({ props }) => `/metadata/district/${props.region && props.region.id}/`,
        method: methods.GET,
        onMount: ({ props }) => !!props.region && !!props.region.id,
        onSuccess: (val) => {
            const { params, response } = val;
            if (params && params.setRegionMetadata) {
                params.setRegionMetadata(response as Metadata);
            }
        },
    },
};

type MyProps = NewProps<Props, Params>;

class DistrictOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            mapState: [],
        };

        const {
            requests,
        } = this.props;
        requests.metadataRequest.setDefaultParams({
            setRegionMetadata: this.setRegionMetadata,
        });
    }

    private featureIdentifier = {}

    private featureFromIdentifier = {}

    private lineStringIdentifier = {}

    private wrapInArray = memoize(wrapInArray);

    // NOTE: memoize and generics don't go well
    private concatArray = memoize((foo: RiskPoint[], bar: RiskPoint[]) => (
        concatArray(foo, bar)
    ))

    private setRegionMetadata = (metadata: Metadata) => {
        this.setState({ metadata });
    }

    // FIXME: reusable
    private getLabelGeoJson = memoize((metadata: Metadata | undefined) => {
        const { regions = [] } = metadata || {};
        const geoAttributes = regions.map(
            (r: Base) => r.geoAttribute,
        );

        const geoJson = this.getGeoJsonFromGeoAttributeList(geoAttributes);
        return geoJson;
    })

    private getPlottableMapLayersFromRiskPoints = memoize(getPlottableMapLayersFromRiskPoints);

    private getGeoJsonFromGeoAttributeList = memoize(getGeoJsonFromGeoAttributeList);

    private getNewMapStateForRiskPointHoverChange = (id: number) => {
        const {
            metadata,
            mapState,
        } = this.state;

        if (isNotDefined(metadata)) {
            return [];
        }

        const {
            cat2Points = [],
            cat3Points = [],
        } = metadata;

        const catPointList: RiskPoint[] = this.concatArray(cat2Points, cat3Points);

        const newMapState = getNewMapStateOnRiskPointHoverChange(
            mapState,
            catPointList,
            id,
            this.featureIdentifier,
            this.featureFromIdentifier,
            this.lineStringIdentifier,
        );

        return newMapState;
    }

    private getNewMapStateForRelocationPointHoverChange = (id: number) => {
        const {
            metadata,
            mapState,
        } = this.state;

        if (isNotDefined(metadata)) {
            return [];
        }

        const {
            cat2Points = [],
            cat3Points = [],
        } = metadata;

        const catPointList: RiskPoint[] = this.concatArray(cat2Points, cat3Points);

        const newMapState = getNewMapStateOnRelocationHoverChange(
            mapState,
            catPointList,
            id,
            this.featureIdentifier,
            this.featureFromIdentifier,
            this.lineStringIdentifier,
        );

        return newMapState;
    }

    private handleCat2PointHoverChange = (id: number) => {
        const newMapState = this.getNewMapStateForRiskPointHoverChange(id);

        this.setState({
            hoveredCat2PointId: id,
            mapState: newMapState,
        });
    }

    private handleCat3PointHoverChange = (id: number) => {
        const newMapState = this.getNewMapStateForRiskPointHoverChange(id);

        this.setState({
            hoveredCat3PointId: id,
            mapState: newMapState,
        });
    }

    private handleISRelocationPointHoverChange = (id: number) => {
        const newMapState = this.getNewMapStateForRelocationPointHoverChange(id);

        this.setState({
            hoveredISRelocationPointId: id,
            mapState: newMapState,
        });
    }

    private handlePLRelocationPointHoverChange = (id: number) => {
        const newMapState = this.getNewMapStateForRelocationPointHoverChange(id);

        this.setState({
            hoveredPLRelocationPointId: id,
            mapState: newMapState,
        });
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredRegionId: id });
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
        const { selectedRegionId } = this.state;
        const newId = selectedRegionId === id ? undefined : id;
        this.setState({ selectedRegionId: newId });
    }

    private renderCatPointHoverDetail = () => {
        const {
            region = {
                name: 'Unknown',
            },
        } = this.props;

        const {
            metadata,
            hoveredCat2PointId,
            hoveredCat3PointId,
        } = this.state;

        if (isNotDefined(metadata)) {
            return null;
        }

        const {
            cat2Points = [],
            cat3Points = [],
        } = metadata;

        if (isDefined(hoveredCat3PointId)) {
            return (
                <RiskPointHoverDetails
                    title={`${region.name} / Category 3`}
                    point={cat3Points[hoveredCat3PointId]}
                    type="cat3"
                />
            );
        }

        if (isDefined(hoveredCat2PointId)) {
            return (
                <RiskPointHoverDetails
                    title={`${region.name} / Category 2`}
                    point={cat2Points[hoveredCat2PointId]}
                    type="cat2"
                />
            );
        }

        return null;
    }

    private renderHoverDetail = () => {
        const {
            hoveredRegionId,
            hoveredCat2PointId,
            hoveredCat3PointId,
            hoveredISRelocationPointId,
            hoveredPLRelocationPointId,
            metadata,
        } = this.state;

        if (
            isNotDefined(hoveredRegionId)
            || isDefined(hoveredCat2PointId)
            || isDefined(hoveredCat3PointId)
            || isDefined(hoveredISRelocationPointId)
            || isDefined(hoveredPLRelocationPointId)
        ) {
            return null;
        }

        const subRegion = getSubRegion(metadata, hoveredRegionId);
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
            onBackButtonClick,
            region,
        } = this.props;

        if (!region) {
            return null;
        }

        const {
            selectedRegionId,
            hoveredRegionId,
            mapState,
            metadata: originalMetadata,
        } = this.state;

        const {
            id,
            name,
            bbox,
        } = region;

        // FIXME: memoize this
        const filter = [
            '==',
            ['get', regionLevel],
            id,
        ];

        const {
            title,
            metadata,
        } = getInformationDataForSelectedRegion(name, originalMetadata, selectedRegionId);

        const {
            cat2Points = [],
            cat3Points = [],
        } = originalMetadata || {};

        const {
            featureFromIdentifier,
            featureIdentifier,
            cat2PointsGeoJson,
            cat3PointsGeoJson,
            integratedSettelementRelocationPointsGeoJson,
            privateLandRelocationPointsGeoJson,
            lineStringsGeoJson,
            lineStringIdentifier,
        } = this.getPlottableMapLayersFromRiskPoints(cat2Points, cat3Points);

        this.featureIdentifier = featureIdentifier;
        this.featureFromIdentifier = featureFromIdentifier;
        this.lineStringIdentifier = lineStringIdentifier;

        const labelGeoJson = this.getLabelGeoJson(originalMetadata);

        return (
            <div className={_cs(className, styles.overview)}>
                <div className={styles.hoverDetails}>
                    {this.renderHoverDetail()}
                    {this.renderCatPointHoverDetail()}
                </div>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                    showBackButton
                    onBackButtonClick={onBackButtonClick}
                />
                <MapSource
                    sourceKey={`${regionLevel}-source-for-${subRegionLevel}`}
                    url={mapSources.nepal.url}
                    bounds={bbox}
                >
                    <MapLayer
                        layerKey={`${subRegionLevel}-fill`}
                        type="fill"
                        sourceLayer={mapSources.nepal.layers[subRegionLevel]}
                        paint={mapStyles[subRegionLevel].fill}
                        filter={filter}
                        enableHover={!pendingMetadataRequest}
                        enableSelection={!pendingMetadataRequest}
                        hoveredId={hoveredRegionId}
                        onHoverChange={this.handleHoverChange}
                        onDoubleClick={this.handleDoubleClick}
                        selectedIds={this.wrapInArray(selectedRegionId)}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        type="line"
                        layerKey={`${subRegionLevel}-outline`}
                        sourceLayer={mapSources.nepal.layers[subRegionLevel]}
                        paint={mapStyles[subRegionLevel].outline}
                        filter={filter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-label`}
                    geoJson={labelGeoJson}
                >
                    <MapLayer
                        layerKey={`${subRegionLevel}-label`}
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles[subRegionLevel].label.paint}
                        layout={mapStyles[subRegionLevel].label.layout}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-line-string`}
                    geoJson={lineStringsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        layerKey="line-string"
                        type="line"
                        layout={mapStyles.lineString.layout}
                        paint={mapStyles.lineString.paint}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-cat2-points`}
                    geoJson={cat2PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover={!pendingMetadataRequest}
                        onHoverChange={this.handleCat2PointHoverChange}
                        layerKey="cat2-points-circle"
                        type="circle"
                        paint={mapStyles.cat2Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-cat3-points`}
                    geoJson={cat3PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover={!pendingMetadataRequest}
                        onHoverChange={this.handleCat3PointHoverChange}
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={mapStyles.cat3Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-pl-relocation-points`}
                    geoJson={privateLandRelocationPointsGeoJson}
                >
                    <MapLayer
                        enableHover={!pendingMetadataRequest}
                        onHoverChange={this.handleISRelocationPointHoverChange}
                        mapState={mapState}
                        layerKey="relocation-points-circle"
                        type="circle"
                        paint={mapStyles.relocationPoint.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-is-relocation-points`}
                    geoJson={integratedSettelementRelocationPointsGeoJson}
                >
                    <MapLayer
                        enableHover={!pendingMetadataRequest}
                        onHoverChange={this.handlePLRelocationPointHoverChange}
                        mapState={mapState}
                        layerKey="relocation-points-diamond"
                        type="symbol"
                        layout={mapStyles.relocationPoint.layout}
                        paint={mapStyles.relocationPoint.paint}
                    />
                </MapSource>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requestOptions)(
        DistrictOverview,
    ),
);
