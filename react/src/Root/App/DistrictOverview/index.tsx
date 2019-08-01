import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

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
} from '#utils/common';

import {
    Metadata,
    mapSources,
    mapStyles,
    GeoAttribute,
    Base,
    RelocationSite,
    RiskPoint,
    FeatureIdentifiers,
    FeatureFromIdentifier,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';
import RiskPointHoverDetails from '../RiskPointHoverDetails';

import styles from './styles.scss';

interface MapStateElement {
    id?: number;
    value?: {
        dim?: boolean;
        show?: boolean;
    };
}

interface State {
    hoveredRegionId?: number;
    selectedRegionId?: number;
    hoveredCat2PointId?: number;
    hoveredCat3PointId?: number;
    mapState: MapStateElement[];
}

interface Props {
    className?: string;
    district?: GeoAttribute;
    onBackButtonClick?: () => void;
    onPalikaDoubleClick?: (geoAttribute: GeoAttribute) => void;
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

const getNewMapStateOnRiskPointHoverChange = (
    mapState: MapStateElement[],
    catPointList: RiskPoint[] = [],
    id: number | undefined,
    featureIdentifier: FeatureIdentifiers,
    featureFromIdentifier: FeatureFromIdentifier,
    lineStringIdentifier,
) => {
    const newMapState = [] as MapStateElement[];
    const geosite = id ? featureFromIdentifier[id] : undefined;

    const setAsLight: {
        [key: number]: boolean;
    } = {};

    catPointList.forEach((catPoint) => {
        const shouldDim = id ? catPoint.geosite !== geosite : false;
        const rs = catPoint.relocationSites;

        let relocationSites = [] as RelocationSite[];
        if (rs) {
            relocationSites = rs;
        }

        if (!shouldDim) {
            newMapState.push({
                id: featureIdentifier[catPoint.geosite],
                value: { dim: shouldDim },
            });

            setAsLight[featureIdentifier[catPoint.geosite]] = true;
        }

        if (shouldDim && !setAsLight[featureIdentifier[catPoint.geosite]]) {
            newMapState.push({
                id: featureIdentifier[catPoint.geosite],
                value: { dim: shouldDim },
            });
        }

        relocationSites
            .filter(r => featureIdentifier[r.code])
            .forEach((r) => {
                if (!shouldDim) {
                    newMapState.push({
                        id: featureIdentifier[r.code],
                        value: { dim: shouldDim },
                    });
                    newMapState.push({
                        id: lineStringIdentifier[`${catPoint.geosite}:${r.code}`],
                        value: { dim: shouldDim },
                    });

                    setAsLight[featureIdentifier[r.code]] = true;
                    setAsLight[lineStringIdentifier[`${catPoint.geosite}:${r.code}`]] = true;
                }

                if (shouldDim && !setAsLight[featureIdentifier[r.code]]) {
                    newMapState.push({
                        id: featureIdentifier[r.code],
                        value: { dim: shouldDim },
                    });
                }

                if (shouldDim && !setAsLight[lineStringIdentifier[`${catPoint.geosite}:${r.code}`]]) {
                    newMapState.push({
                        id: lineStringIdentifier[`${catPoint.geosite}:${r.code}`],
                        value: { dim: shouldDim },
                    });
                }
            });
    });

    return newMapState;
};

class DistrictOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            mapState: [],
        };
    }

    private featureIdentifier = {}

    private featureFromIdentifier = {}

    private lineStringIdentifier = {}

    private getCatPointList = memoize((cat2PointList: RiskPoint[], cat3PointList: RiskPoint[]) => ([
        ...cat2PointList,
        ...cat3PointList,
    ]))

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

        const { selectedRegionId } = this.state;

        if (!selectedRegionId) {
            return {
                title: district.name,
                metadata,
            };
        }

        const palikaData = metadata && metadata.regions
            ? metadata.regions.find(region => region.geoAttribute.id === selectedRegionId)
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

    private getLabelGeoJson = memoize((metadata?: Metadata) => {
        const { regions = [] } = metadata || {};
        const geoAttributes = regions.map(
            (r: Base) => r.geoAttribute,
        );

        const geoJson = this.getGeoJsonFromGeoAttributeList(geoAttributes);
        return geoJson;
    })

    private wrapInArray = memoize(wrapInArray);

    private getPlottableMapLayersFromRiskPoints = memoize(getPlottableMapLayersFromRiskPoints);

    private getGeoJsonFromGeoAttributeList = memoize(getGeoJsonFromGeoAttributeList);

    private renderCatPointHoverDetail = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
            district = {
                name: 'Unknown',
            },
        } = this.props;

        const {
            hoveredCat2PointId,
            hoveredCat3PointId,
        } = this.state;

        const metadata = response as Metadata;
        if (!metadata) {
            return null;
        }

        const {
            cat2Points = [],
            cat3Points = [],
        } = metadata;

        if (hoveredCat3PointId) {
            return (
                <RiskPointHoverDetails
                    title={`${district.name} / Category 3`}
                    point={cat3Points[hoveredCat3PointId]}
                    type="cat3"
                />
            );
        }

        if (hoveredCat2PointId) {
            return (
                <RiskPointHoverDetails
                    title={`${district.name} / Category 2`}
                    point={cat2Points[hoveredCat2PointId]}
                    type="cat2"
                />
            );
        }

        return null;
    }

    private renderHoverDetail = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
        } = this.props;

        const {
            hoveredRegionId,
            hoveredCat2PointId,
            hoveredCat3PointId,
        } = this.state;

        if (!hoveredRegionId || hoveredCat2PointId || hoveredCat3PointId) {
            return null;
        }

        // FIXME: prepare district map in constants
        const metadata = response as Metadata;
        const palikaData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === hoveredRegionId,
        );

        if (!palikaData) {
            return null;
        }

        const {
            landslidesSurveyed,
            geoAttribute: {
                name: palikaName,
            },
        } = palikaData;

        return (
            <HoverDetails
                name={palikaName}
                landslidesSurveyed={landslidesSurveyed}
            />
        );
    }

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredRegionId: id });
    }

    private getNewMapStateForRiskPointHoverChange = (id: number) => {
        const { mapState } = this.state;
        const {
            requests: {
                metadaRequest: {
                    response,
                },
            },
        } = this.props;

        const districtMetadata = (response as Metadata) || {};
        const {
            cat2Points = [],
            cat3Points = [],
        } = districtMetadata;

        const catPointList = this.getCatPointList(cat2Points, cat3Points);

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

    private handleRelocationPointHoverChange = (id: number) => {
        // console.warn(id);
    }

    private handleDoubleClick = (id: number) => {
        const { onPalikaDoubleClick } = this.props;

        const {
            requests: {
                metadaRequest: { response },
            },
        } = this.props;

        const metadata = response as Metadata;
        // FIXME: prepare district map in constants
        const palikaData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === id,
        );

        if (!palikaData) {
            return;
        }

        if (onPalikaDoubleClick) {
            onPalikaDoubleClick(palikaData.geoAttribute);
        }
    }

    private handleSelectionChange = (_: number[], id: number) => {
        const { selectedRegionId } = this.state;
        const newId = selectedRegionId === id ? undefined : id;
        this.setState({ selectedRegionId: newId });
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
            district,
        } = this.props;

        const {
            selectedRegionId,
            hoveredRegionId,
            mapState,
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

        const districtMetadata = (response as Metadata) || {};

        const {
            cat2Points,
            cat3Points,
        } = districtMetadata;

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

        const labelGeoJson = this.getLabelGeoJson(districtMetadata);

        return (
            <div className={_cs(className, styles.districtOverview)}>
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
                        hoveredId={hoveredRegionId}
                        onHoverChange={this.handleHoverChange}
                        onDoubleClick={this.handleDoubleClick}
                        enableSelection
                        selectedIds={this.wrapInArray(selectedRegionId)}
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
                <MapSource
                    sourceKey="palika-label"
                    geoJson={labelGeoJson}
                >
                    <MapLayer
                        layerKey="palika-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.palikaLabel.paint}
                        layout={mapStyles.palikaLabel.layout}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-line-string"
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
                    sourceKey="district-cat2-points"
                    geoJson={cat2PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover
                        onHoverChange={this.handleCat2PointHoverChange}
                        layerKey="cat2-points-circle"
                        type="circle"
                        paint={mapStyles.cat2Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-cat3-points"
                    geoJson={cat3PointsGeoJson}
                >
                    <MapLayer
                        mapState={mapState}
                        enableHover
                        onHoverChange={this.handleCat3PointHoverChange}
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={mapStyles.cat3Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-pl-relocation-points"
                    geoJson={privateLandRelocationPointsGeoJson}
                >
                    <MapLayer
                        enableHover
                        onHoverChange={this.handleRelocationPointHoverChange}
                        mapState={mapState}
                        layerKey="relocation-points-circle"
                        type="circle"
                        paint={mapStyles.relocationPoint.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-is-relocation-points"
                    geoJson={integratedSettelementRelocationPointsGeoJson}
                >
                    <MapLayer
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
    createRequestClient(requests)(
        DistrictOverview,
    ),
);
