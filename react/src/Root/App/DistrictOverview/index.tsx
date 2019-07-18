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
    convertRiskPointToGeoJson,
    convertRelocationPointToGeoJson,
    getGeoJsonFromGeoAttributeList,
    getLineStringGeoJson,
} from '#utils/common';

import {
    Metadata,
    mapSources,
    mapStyles,
    GeoAttribute,
    Base,
} from '#constants';

import Information from '../Information';
import HoverDetails from '../HoverDetails';
import RiskPointHoverDetails from '../RiskPointHoverDetails';

import styles from './styles.scss';

interface State {
    hoveredId?: number;
    selectedId?: number;
    hoveredCat2PointId?: number;
    hoveredCat3PointId?: number;
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

    private getLabelGeoJson = memoize((metadata?: Metadata) => {
        const { regions = [] } = metadata || {};
        const geoAttributes = regions.map(
            (r: Base) => r.geoAttribute,
        );

        const geoJson = this.getGeoJsonFromGeoAttributeList(geoAttributes);
        return geoJson;
    })

    private wrapInArray = memoize(wrapInArray);

    private convertRiskPointToGeoJson = memoize(convertRiskPointToGeoJson);

    private convertRelocationPointToGeoJson = memoize(convertRelocationPointToGeoJson);

    private getGeoJsonFromGeoAttributeList = memoize(getGeoJsonFromGeoAttributeList);

    private getLineStringGeoJson = memoize(getLineStringGeoJson);

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
            hoveredId,
            hoveredCat2PointId,
            hoveredCat3PointId,
        } = this.state;

        if (!hoveredId || hoveredCat2PointId || hoveredCat3PointId) {
            return null;
        }

        // FIXME: prepare district map in constants
        const metadata = response as Metadata;
        const palikaData = metadata && metadata.regions.find(
            region => region.geoAttribute.id === hoveredId,
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
        this.setState({ hoveredId: id });
    }

    private handleCat2PointHoverChange = (id: number) => {
        this.setState({ hoveredCat2PointId: id });
    }

    private handleCat3PointHoverChange = (id: number) => {
        this.setState({ hoveredCat3PointId: id });
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

        const districtMetadata = (response as Metadata) || {};

        const {
            cat2Points,
            cat3Points,
            relocationPoints,
        } = districtMetadata;

        const cat2PointsGeoJson = this.convertRiskPointToGeoJson(cat2Points);
        const cat3PointsGeoJson = this.convertRiskPointToGeoJson(cat3Points);
        const {
            pla: plaRelocationPointGeoJson,
            is: isRelocationPointGeoJson,
        } = this.convertRelocationPointToGeoJson(relocationPoints);

        const lineStringGeoJson = this.getLineStringGeoJson(
            cat2Points,
            cat3Points,
            relocationPoints,
        );

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
                    geoJson={lineStringGeoJson}
                >
                    <MapLayer
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
                        enableHover
                        onHoverChange={this.handleCat3PointHoverChange}
                        layerKey="cat3-points-circle"
                        type="circle"
                        paint={mapStyles.cat3Point.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-pla-relocation-points"
                    geoJson={plaRelocationPointGeoJson}
                >
                    <MapLayer
                        layerKey="relocation-points-circle"
                        type="circle"
                        paint={mapStyles.relocationPoint.circle}
                    />
                </MapSource>
                <MapSource
                    sourceKey="district-is-relocation-points"
                    geoJson={isRelocationPointGeoJson}
                >
                    <MapLayer
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
