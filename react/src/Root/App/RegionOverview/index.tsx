import React from 'react';
import memoize from 'memoize-one';
import {
    _cs,
    isDefined,
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
    wrapInArray,
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
    RiskPointWithType,
    FeatureIdentifiers,
    FeatureFromIdentifier,
    MapStateElement,
} from '#constants';

import Legend from '#components/Legend';
import Information from '#components/Information';
import HoverDetails from '#components/HoverDetails';

import PointDetails from './PointDetails';
import styles from './styles.scss';

function addTypeToCat(point: RiskPoint, type: 'cat2' | 'cat3'): RiskPointWithType {
    return {
        ...point,
        type,
    };
}

interface State {
    hoveredRegionId?: number;
    hoveredCat2PointId?: number;
    hoveredCat3PointId?: number;
    hoveredISRelocationPointId?: number;
    hoveredPLRelocationPointId?: number;

    selectedRegionId?: number;
    selectedCat2PointId?: number;
    selectedCat3PointId?: number;
    selectedISRelocationPointId?: number;
    selectedPLRelocationPointId?: number;

    metadata?: Metadata;

    selectedPoint?: string;
}

interface Props {
    className?: string;
    region?: GeoAttribute;
    onBackButtonClick?: () => void;
    onSubRegionDoubleClick?: (geoAttribute: GeoAttribute) => void;
    regionLevel: 'district' | 'palika';
    subRegionLevel: 'palika' | 'ward';
}

interface Params {
    setRegionMetadata: (response: Metadata) => void;
}

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    metadataRequest: {
        url: ({ props }) => `/metadata/${props.regionLevel}/${props.region && props.region.id}/`,
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

        this.state = {};

        const {
            requests,
        } = this.props;
        requests.metadataRequest.setDefaultParams({
            setRegionMetadata: this.setRegionMetadata,
        });
    }

    private wrapInArray = memoize(wrapInArray);

    // NOTE: memoize and generics don't go well
    private concatCatPoints = memoize((
        foo: RiskPoint[] | undefined = [],
        bar: RiskPoint[] | undefined = [],
    ) => ([
        ...foo.map(d => addTypeToCat(d, 'cat2')),
        ...bar.map(d => addTypeToCat(d, 'cat3')),
    ]))

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

    private getMapState = memoize((
        originalMetadata: Metadata | undefined,
        selectedCat2PointId: number | undefined,
        selectedCat3PointId: number | undefined,
        selectedISRelocationPointId: number | undefined,
        selectedPLRelocationPointId: number | undefined,
        hoveredCat2PointId: number | undefined,
        hoveredCat3PointId: number | undefined,
        hoveredISRelocationPointId: number | undefined,
        hoveredPLRelocationPointId: number | undefined,
        featureIdentifier: FeatureIdentifiers,
        featureFromIdentifier: FeatureFromIdentifier,
    ) => {
        if (isNotDefined(originalMetadata)) {
            return {
                mapState: [],
                catPoints: [],
                relocationSites: [],
            };
        }

        const {
            cat2Points,
            cat3Points,
        } = originalMetadata;

        const catPointList = this.concatCatPoints(
            cat2Points,
            cat3Points,
        );

        const cat2PointId = selectedCat2PointId || hoveredCat2PointId;
        const cat3PointId = selectedCat3PointId || hoveredCat3PointId;
        const relocationISPointId = selectedISRelocationPointId || hoveredISRelocationPointId;
        const relocationPLPointId = selectedPLRelocationPointId || hoveredPLRelocationPointId;

        if (isDefined(cat2PointId)) {
            return getNewMapStateOnRiskPointHoverChange(
                catPointList,
                cat2PointId,
                featureIdentifier,
                featureFromIdentifier,
            );
        }
        if (isDefined(cat3PointId)) {
            return getNewMapStateOnRiskPointHoverChange(
                catPointList,
                cat3PointId,
                featureIdentifier,
                featureFromIdentifier,
            );
        }
        if (isDefined(relocationISPointId)) {
            return getNewMapStateOnRelocationHoverChange(
                catPointList,
                relocationISPointId,
                featureIdentifier,
                featureFromIdentifier,
            );
        }
        if (isDefined(relocationPLPointId)) {
            return getNewMapStateOnRelocationHoverChange(
                catPointList,
                relocationPLPointId,
                featureIdentifier,
                featureFromIdentifier,
            );
        }
        return {
            mapState: [],
            catPoints: [],
            relocationSites: [],
        };
    })

    private getMapStateOnSelectedPoints = (
        mapState: MapStateElement[],
        selectedPoint: string | undefined,
        featureIdentifier: FeatureIdentifiers,
    ) => {
        if (!selectedPoint) {
            return mapState;
        }

        const id = featureIdentifier[selectedPoint];
        const newMapState = mapState.map((d) => {
            if (d.id !== id) {
                return d;
            }

            return {
                id,
                value: {
                    ...d.value,
                    outline: true,
                },
            };
        });

        return newMapState;
    }

    private createHoverChangeHandler = (key: keyof State) => (id: number | undefined) => {
        this.setState({
            hoveredCat2PointId: undefined,
            hoveredCat3PointId: undefined,
            hoveredISRelocationPointId: undefined,
            hoveredPLRelocationPointId: undefined,
            selectedPoint: undefined,
            [key]: id,
        });
    };

    private createSelectionChangeHandler = (
        selectedKey: keyof State,
        hoveredKey: keyof State,
    ) => (_: number[], id: number) => {
        const {
            [selectedKey]: selectedId,
        } = this.state;
        const newSelectedId = selectedId === id ? undefined : id;
        const newHoveredId = newSelectedId ? undefined : selectedId;

        this.setState({
            selectedCat2PointId: undefined,
            selectedCat3PointId: undefined,
            selectedISRelocationPointId: undefined,
            selectedPLRelocationPointId: undefined,
            [selectedKey]: newSelectedId,
            [hoveredKey]: newHoveredId,
        });
    }

    private handleCat2PointHoverChange = this.createHoverChangeHandler('hoveredCat2PointId');

    private handleCat3PointHoverChange = this.createHoverChangeHandler('hoveredCat3PointId');

    private handleISRelocationPointHoverChange = this.createHoverChangeHandler('hoveredISRelocationPointId');

    private handlePLRelocationPointHoverChange = this.createHoverChangeHandler('hoveredPLRelocationPointId');

    private handleCat2PointSelectionChange = this.createSelectionChangeHandler('selectedCat2PointId', 'hoveredCat2PointId');

    private handleCat3PointSelectionChange = this.createSelectionChangeHandler('selectedCat3PointId', 'hoveredCat3PointId');

    private handleISRelocationPointSelectionChange = this.createSelectionChangeHandler('selectedISRelocationPointId', 'hoveredISRelocationPointId');

    private handlePLRelocationPointSelectionChange = this.createSelectionChangeHandler('selectedPLRelocationPointId', 'hoveredPLRelocationPointId');

    private handleHoverChange = (id: number | undefined) => {
        this.setState({
            hoveredRegionId: id,
        });
    };

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedRegionId } = this.state;
        const newId = selectedRegionId === id ? undefined : id;
        this.setState({ selectedRegionId: newId });
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

    private renderHoverDetail = () => {
        const {
            metadata,
            hoveredRegionId,

            hoveredCat2PointId,
            hoveredCat3PointId,
            hoveredISRelocationPointId,
            hoveredPLRelocationPointId,
            selectedCat2PointId,
            selectedCat3PointId,
            selectedISRelocationPointId,
            selectedPLRelocationPointId,
        } = this.state;

        if (
            isNotDefined(hoveredRegionId)
            || isDefined(hoveredCat2PointId)
            || isDefined(hoveredCat3PointId)
            || isDefined(hoveredISRelocationPointId)
            || isDefined(hoveredPLRelocationPointId)
            || isDefined(selectedCat2PointId)
            || isDefined(selectedCat3PointId)
            || isDefined(selectedISRelocationPointId)
            || isDefined(selectedPLRelocationPointId)
        ) {
            return null;
        }

        const subRegion = getSubRegion(metadata, hoveredRegionId);
        if (!subRegion) {
            return null;
        }

        const {
            region,
            regionLevel,
        } = this.props;

        if (!region) {
            return null;
        }

        const {
            name: regionName,
        } = region;

        const {
            landslidesSurveyed,
            geoAttribute: {
                name,
            },
        } = subRegion;

        return (
            <HoverDetails
                name={regionLevel === 'palika' ? `${regionName} - ${name}` : name}
                landslidesSurveyed={landslidesSurveyed}
            />
        );
    }

    private handlePointSelectionChange = (value: string) => {
        this.setState({ selectedPoint: value });
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
            regionLevel,
            subRegionLevel,
        } = this.props;

        const {
            selectedRegionId,
            hoveredRegionId,
            metadata: originalMetadata,

            hoveredCat2PointId,
            hoveredCat3PointId,
            hoveredISRelocationPointId,
            hoveredPLRelocationPointId,
            selectedCat2PointId,
            selectedCat3PointId,
            selectedISRelocationPointId,
            selectedPLRelocationPointId,

            selectedPoint,
        } = this.state;

        if (!region) {
            return null;
        }

        const {
            id,
            name,
            bbox,
        } = region;

        // FIXME: memoize this
        // FIXME: change municipality to palika in vector tile
        // Filter for sub region
        const subRegionFilter = [
            '==',
            ['get', regionLevel === 'palika' ? 'municipality' : regionLevel],
            id,
        ];

        // data for information pane
        const {
            title,
            metadata,
        } = getInformationDataForSelectedRegion(
            name,
            originalMetadata,
            selectedRegionId,
            regionLevel,
        );

        // geojson data from cat points
        const {
            featureFromIdentifier,
            featureIdentifier,

            cat2PointsGeoJson,
            cat3PointsGeoJson,
            integratedSettlementRelocationPointsGeoJson,
            privateLandRelocationPointsGeoJson,
            lineStringsGeoJson,
        } = this.getPlottableMapLayersFromRiskPoints(
            originalMetadata ? originalMetadata.cat2Points : undefined,
            originalMetadata ? originalMetadata.cat3Points : undefined,
        );

        const hoverEnable = isNotDefined(selectedCat2PointId)
            && isNotDefined(selectedCat3PointId)
            && isNotDefined(selectedISRelocationPointId)
            && isNotDefined(selectedPLRelocationPointId);

        const {
            mapState: unselectedMapState,
            catPoints,
            relocationSites,
        } = this.getMapState(
            originalMetadata,
            selectedCat2PointId,
            selectedCat3PointId,
            selectedISRelocationPointId,
            selectedPLRelocationPointId,
            hoveredCat2PointId,
            hoveredCat3PointId,
            hoveredISRelocationPointId,
            hoveredPLRelocationPointId,
            featureIdentifier,
            featureFromIdentifier,
        );

        const mapState = this.getMapStateOnSelectedPoints(
            unselectedMapState,
            selectedPoint,
            featureIdentifier,
        );

        return (
            <div className={_cs(className, styles.overview)}>
                <Legend className={styles.legend} />
                <div className={styles.hoverDetails}>
                    {this.renderHoverDetail()}
                    { (catPoints.length > 0 || relocationSites.length > 0) && (
                        <PointDetails
                            catPointList={catPoints}
                            relocationSiteList={relocationSites}
                            onCatPointSelectionChange={this.handlePointSelectionChange}
                            onRelocationSiteSelectionChange={this.handlePointSelectionChange}
                        />
                    )}
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
                        filter={subRegionFilter}
                        enableHover={!pendingMetadataRequest && hoverEnable}
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
                        filter={subRegionFilter}
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-label`}
                    geoJson={this.getLabelGeoJson(originalMetadata)}
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
                        layout={mapStyles.connectionLine.layout}
                        paint={
                            mapState.length > 0
                                ? mapStyles.connectionLineInverted.line
                                : mapStyles.connectionLine.line
                        }
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-cat2-points`}
                    geoJson={cat2PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover={!pendingMetadataRequest && hoverEnable}
                        enableSelection={!pendingMetadataRequest}
                        onHoverChange={this.handleCat2PointHoverChange}
                        onSelectionChange={this.handleCat2PointSelectionChange}
                        layerKey="cat2-points-circle"
                        type="circle"
                        paint={
                            mapState.length > 0
                                ? mapStyles.cat2PointInverted.circle
                                : mapStyles.cat2Point.circle
                        }
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-cat3-points`}
                    geoJson={cat3PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover={!pendingMetadataRequest && hoverEnable}
                        enableSelection={!pendingMetadataRequest}
                        onHoverChange={this.handleCat3PointHoverChange}
                        onSelectionChange={this.handleCat3PointSelectionChange}
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={
                            mapState.length > 0
                                ? mapStyles.cat3PointInverted.circle
                                : mapStyles.cat3Point.circle
                        }
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-pl-relocation-points`}
                    geoJson={privateLandRelocationPointsGeoJson}
                >
                    <MapLayer
                        enableHover={!pendingMetadataRequest && hoverEnable}
                        enableSelection={!pendingMetadataRequest}
                        onHoverChange={this.handlePLRelocationPointHoverChange}
                        onSelectionChange={this.handlePLRelocationPointSelectionChange}
                        mapState={mapState}
                        layerKey="relocation-points-circle"
                        type="circle"
                        paint={
                            mapState.length > 0
                                ? mapStyles.relocationPLPointInverted.circle
                                : mapStyles.relocationPLPoint.circle
                        }
                    />
                </MapSource>
                <MapSource
                    sourceKey={`${subRegionLevel}-is-relocation-points`}
                    geoJson={integratedSettlementRelocationPointsGeoJson}
                >
                    <MapLayer
                        enableHover={!pendingMetadataRequest && hoverEnable}
                        enableSelection={!pendingMetadataRequest}
                        onHoverChange={this.handleISRelocationPointHoverChange}
                        onSelectionChange={this.handleISRelocationPointSelectionChange}
                        mapState={mapState}
                        layerKey="relocation-points-diamond"
                        type="symbol"
                        layout={mapStyles.relocationISPoint.layout}
                        paint={
                            mapState.length > 0
                                ? mapStyles.relocationISPointInverted.text
                                : mapStyles.relocationISPoint.text
                        }
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
