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
    palika?: GeoAttribute;
    onBackButtonClick?: () => void;
}

interface Params {}

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
        url: ({ props }) => `/metadata/palika/${props.palika && props.palika.id}/`,
        method: methods.GET,
        onMount: ({ props }) => !!props.palika && !!props.palika.id,
    },
};

type MyProps = NewProps<Props, Params>;

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
            palika = {
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
                    title={`${palika.name} / Category 3`}
                    point={cat3Points[hoveredCat3PointId]}
                    type="cat3"
                />
            );
        }

        if (hoveredCat2PointId) {
            return (
                <RiskPointHoverDetails
                    title={`${palika.name} / Category 2`}
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

    private handleCat2PointHoverChange = (id: number) => {
        this.setState({ hoveredCat2PointId: id });
    }

    private handleCat3PointHoverChange = (id: number) => {
        this.setState({ hoveredCat3PointId: id });
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

        // FIXME: handle null condition
        const palikaMetadata = response as Metadata || {};

        const {
            cat2Points,
            cat3Points,
            relocationPoints,
        } = palikaMetadata;

        const cat2PointsGeoJson = this.convertRiskPointToGeoJson(cat2Points);
        const cat3PointsGeoJson = this.convertRiskPointToGeoJson(cat3Points);
        const {
            pla: plaRelocationPointGeoJson,
            is: isRelocationPointGeoJson,
        } = this.convertRelocationPointToGeoJson(relocationPoints);

        const lineStringGeoJson = getLineStringGeoJson(cat2Points, cat3Points, relocationPoints);
        const labelGeoJson = this.getLabelGeoJson(palikaMetadata);

        return (
            <div className={_cs(className, styles.palikaOverview)}>
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
                    sourceKey="ward-label"
                    geoJson={labelGeoJson}
                >
                    <MapLayer
                        layerKey="ward-label"
                        type="symbol"
                        property="adminLevelId"
                        paint={mapStyles.wardLabel.paint}
                        layout={mapStyles.wardLabel.layout}
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
                    sourceKey="palika-cat2-points"
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
                    sourceKey="palika-cat3-points"
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
        PalikaOverview,
    ),
);
