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
    hoveredCat2PointId?: number;
    hoveredCat3PointId?: number;
    hoveredISRelocationPointId?: number;
    hoveredPLRelocationPointId?: number;

    selectedRegionId?: number;
    selectedCat2PointId?: number;
    selectedCat3PointId?: number;
    selectedISRelocationPointId?: number;
    selectedPLRelocationPointId?: number;

    // mapState: MapStateElement[];

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
    private concatArray = memoize((foo: RiskPoint[] | undefined, bar: RiskPoint[] | undefined) => (
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

    private handleCat2PointHoverChange = (id: number | undefined) => {
        this.setState({
            hoveredCat2PointId: id,
            hoveredCat3PointId: undefined,
            hoveredISRelocationPointId: undefined,
            hoveredPLRelocationPointId: undefined,
        });
    }

    private handleCat3PointHoverChange = (id: number | undefined) => {
        this.setState({
            hoveredCat2PointId: undefined,
            hoveredCat3PointId: id,
            hoveredISRelocationPointId: undefined,
            hoveredPLRelocationPointId: undefined,
        });
    }

    private handleISRelocationPointHoverChange = (id: number | undefined) => {
        this.setState({
            hoveredCat2PointId: undefined,
            hoveredCat3PointId: undefined,
            hoveredISRelocationPointId: id,
            hoveredPLRelocationPointId: undefined,
        });
    }

    private handlePLRelocationPointHoverChange = (id: number | undefined) => {
        this.setState({
            hoveredCat2PointId: undefined,
            hoveredCat3PointId: undefined,
            hoveredISRelocationPointId: undefined,
            hoveredPLRelocationPointId: id,
        });
    }

    private handleHoverChange = (id: number | undefined) => {
        this.setState({ hoveredRegionId: id });
    }

    private handleCat2PointSelectedChange = (_: number[], id: number) => {
        const { selectedCat2PointId } = this.state;
        const newId = selectedCat2PointId === id ? undefined : id;
        const newHoveredId = newId ? undefined : selectedCat2PointId;

        this.setState({
            selectedCat2PointId: newId,
            selectedCat3PointId: undefined,
            selectedISRelocationPointId: undefined,
            selectedPLRelocationPointId: undefined,

            hoveredCat2PointId: newHoveredId,
        });
    }

    private handleCat3PointSelectedChange = (_: number[], id: number) => {
        const { selectedCat3PointId } = this.state;
        const newId = selectedCat3PointId === id ? undefined : id;
        const newHoveredId = newId ? undefined : selectedCat3PointId;

        this.setState({
            selectedCat2PointId: undefined,
            selectedCat3PointId: newId,
            selectedISRelocationPointId: undefined,
            selectedPLRelocationPointId: undefined,

            hoveredCat3PointId: newHoveredId,
        });
    }

    private handleISRelocationPointSelectedChange = (_: number[], id: number) => {
        const { selectedISRelocationPointId } = this.state;
        const newId = selectedISRelocationPointId === id ? undefined : id;
        const newHoveredId = newId ? undefined : selectedISRelocationPointId;

        this.setState({
            selectedCat2PointId: undefined,
            selectedCat3PointId: undefined,
            selectedISRelocationPointId: newId,
            selectedPLRelocationPointId: undefined,

            hoveredISRelocationPointId: newHoveredId,
        });
    }

    private handlePLRelocationPointSelectedChange = (_: number[], id: number) => {
        const { selectedPLRelocationPointId } = this.state;
        const newId = selectedPLRelocationPointId === id ? undefined : id;
        const newHoveredId = newId ? undefined : selectedPLRelocationPointId;

        this.setState({
            selectedCat2PointId: undefined,
            selectedCat3PointId: undefined,
            selectedISRelocationPointId: undefined,
            selectedPLRelocationPointId: newId,

            hoveredPLRelocationPointId: newHoveredId,
        });
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
            selectedCat2PointId,
            selectedCat3PointId,
        } = this.state;

        const cat2PointId = selectedCat2PointId || hoveredCat2PointId;
        const cat3PointId = selectedCat3PointId || hoveredCat3PointId;

        if (isNotDefined(metadata)) {
            return null;
        }

        const {
            cat2Points = [],
            cat3Points = [],
        } = metadata;

        if (isDefined(cat3PointId)) {
            return (
                <RiskPointHoverDetails
                    title={`${region.name} / Category 3`}
                    point={cat3Points[cat3PointId]}
                    type="cat3"
                />
            );
        }

        if (isDefined(cat2PointId)) {
            return (
                <RiskPointHoverDetails
                    title={`${region.name} / Category 2`}
                    point={cat2Points[cat2PointId]}
                    type="cat2"
                />
            );
        }

        return null;
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
        // Filter for sub region
        const subRegionFilter = [
            '==',
            ['get', regionLevel],
            id,
        ];

        // data for information pane
        const {
            title,
            metadata,
        } = getInformationDataForSelectedRegion(name, originalMetadata, selectedRegionId);

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

        let mapState: MapStateElement[] | undefined;

        if (isDefined(originalMetadata)) {
            const {
                cat2Points,
                cat3Points,
            } = originalMetadata;

            const catPointList: RiskPoint[] = this.concatArray(
                cat2Points,
                cat3Points,
            );

            const cat2PointId = selectedCat2PointId || hoveredCat2PointId;
            const cat3PointId = selectedCat3PointId || hoveredCat3PointId;
            const relocationISPointId = selectedISRelocationPointId || hoveredISRelocationPointId;
            const relocationPLPointId = selectedPLRelocationPointId || hoveredPLRelocationPointId;

            if (isDefined(cat2PointId)) {
                mapState = getNewMapStateOnRiskPointHoverChange(
                    catPointList,
                    cat2PointId,
                    featureIdentifier,
                    featureFromIdentifier,
                );
            } else if (isDefined(cat3PointId)) {
                mapState = getNewMapStateOnRiskPointHoverChange(
                    catPointList,
                    cat3PointId,
                    featureIdentifier,
                    featureFromIdentifier,
                );
            } else if (isDefined(relocationISPointId)) {
                mapState = getNewMapStateOnRelocationHoverChange(
                    catPointList,
                    relocationISPointId,
                    featureIdentifier,
                    featureFromIdentifier,
                );
            } else if (isDefined(relocationPLPointId)) {
                mapState = getNewMapStateOnRelocationHoverChange(
                    catPointList,
                    relocationPLPointId,
                    featureIdentifier,
                    featureFromIdentifier,
                );
            }
        }

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
                            mapState
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
                        onSelectionChange={this.handleCat2PointSelectedChange}
                        layerKey="cat2-points-circle"
                        type="circle"
                        paint={
                            mapState
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
                        onSelectionChange={this.handleCat3PointSelectedChange}
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={
                            mapState
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
                        onHoverChange={this.handleISRelocationPointHoverChange}
                        onSelectionChange={this.handleISRelocationPointSelectedChange}
                        mapState={mapState}
                        layerKey="relocation-points-circle"
                        type="circle"
                        paint={
                            mapState
                                ? mapStyles.relocationISPointInverted.circle
                                : mapStyles.relocationISPoint.circle
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
                        onHoverChange={this.handlePLRelocationPointHoverChange}
                        onSelectionChange={this.handlePLRelocationPointSelectedChange}
                        mapState={mapState}
                        layerKey="relocation-points-diamond"
                        type="symbol"
                        layout={mapStyles.relocationPLPoint.layout}
                        paint={
                            mapState
                                ? mapStyles.relocationPLPointInverted.text
                                : mapStyles.relocationPLPoint.text
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
