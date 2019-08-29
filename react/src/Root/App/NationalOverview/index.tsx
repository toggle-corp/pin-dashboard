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

import Icon from '#rscg/Icon';
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
    setRegionMetadata: (response: Metadata) => void;
}

const regionLevel = 'country';
const subRegionLevel = 'district';

const mostAffectedColor = '#0010A1';
const affectedColor = '#3656f6';

const requestOptions: { [key: string]: ClientAttributes<Props, Params> } = {
    metadataRequest: {
        url: `/metadata/${regionLevel}/`,
        method: methods.GET,
        onMount: true,
        onSuccess: (val) => {
            const { params, response } = val;
            if (params && params.setRegionMetadata) {
                params.setRegionMetadata(response as Metadata);
            }
        },
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

class CountryOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            mapState: districtsAffected,
        };

        const {
            requests,
        } = this.props;
        requests.metadataRequest.setDefaultParams({
            setRegionMetadata: this.setRegionMetadata,
        });
    }

    private wrapInArray = memoize(wrapInArray);

    private setRegionMetadata = (metadata: Metadata) => {
        this.setState({ metadata });
    }

    // FIXME: reusable
    private getLabelGeoJson = memoize((metadata: Metadata | undefined) => {
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
        } = getInformationDataForSelectedRegion(
            name,
            originalMetadata,
            selectedId,
        );

        // const labelGeoJson = this.getLabelGeoJson(originalMetadata);

        return (
            <div className={_cs(className, styles.overview)}>
                <div className={styles.topRightDetails}>
                    <div className={styles.helpText}>
                        <Icon
                            name="info"
                            className={styles.icon}
                        />
                        <div className={styles.text}>
                            Double-click on any district for more information
                        </div>
                    </div>
                    { this.renderHoverDetail() }
                </div>
                <div className={styles.legend}>
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
                </div>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                />
                <MapSource
                    sourceKey={`${regionLevel}-source-for-${subRegionLevel}`}
                    url={mapSources.nepal.url}
                    bounds={bbox}
                >
                    <MapLayer
                        type="fill"
                        disableInteraction
                        enableHover={!pendingMetadataRequest}
                        enableSelection={!pendingMetadataRequest}
                        layerKey={`${subRegionLevel}-fill`}
                        sourceLayer={mapSources.nepal.layers[subRegionLevel]}
                        paint={mapStyles[subRegionLevel].fill}
                        mapState={mapState}
                        hoveredId={hoveredId}
                        onHoverChange={this.handleHoverChange}
                        onDoubleClick={this.handleDoubleClick}
                        selectedIds={this.wrapInArray(selectedId)}
                        onSelectionChange={this.handleSelectionChange}
                    />
                    <MapLayer
                        type="line"
                        layerKey={`${subRegionLevel}-outline`}
                        sourceLayer={mapSources.nepal.layers[subRegionLevel]}
                        paint={mapStyles[subRegionLevel].outline}
                    />
                </MapSource>
                {/*
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
                */}
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requestOptions)(
        CountryOverview,
    ),
);
