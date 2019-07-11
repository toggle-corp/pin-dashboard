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

import styles from './styles.scss';

interface State {
    hoveredId?: number;
    selectedId?: number;
}

interface Props {
    className?: string;
    title?: string;
    palikaId?: number;
    onBackButtonClick?: () => {};
}

interface Params {}

/*
const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
        url: ({ props }) => {
            if (!props.palikaId) {
                return '/metadata/';
            }

            return `/palika/${palikas[props.districtId]}`;
        },
        method: methods.GET,
        onMount: true,
    },
};
 */

type MyProps = NewProps<Props, Params>;

function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }

    return [item];
}

class DistrictOverview extends React.PureComponent<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
        };
    }

    /*
    private getInformationDataForSelectedRegion = () => {
        const {
            requests: {
                metadaRequest: { response },
            },
            districtId,
        } = this.props;

        const metadata = response as Metadata;

        const { selectedId } = this.state;

        const districtName = districtId
            ? districts[districtId]
            : undefined;

        if (!selectedId) {
            return {
                title: districtName,
                metadata,
            };
        }

        const palikaName = selectedId
            ? palikas[selectedId]
            : undefined;

        const palikaData = palikaName && metadata && metadata.gaupalikas
            ? metadata.gaupalikas[palikaName]
            : undefined;

        if (!palikaData) {
            return {
                title: undefined,
                metadata: undefined,
            };
        }

        return ({
            title: palikaName,
            metadata: palikaData,
        });
    }
     */

    private wrapInArray = memoize(wrapInArray);

    private handleHoverChange = (id: number) => {
        this.setState({ hoveredId: id });
    }

    private handleDoubleClick = (id: number) => {
        console.warn('double click', id);
        // const { onDistrictDoubleClick } = this.props;

        // if (onDistrictDoubleClick) {
        //     onDistrictDoubleClick(id);
        // }
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
                },
            },
            palikaId,
            onBackButtonClick,
        } = this.props;

        const {
            selectedId,
            hoveredId,
        } = this.state;

        const sourceKey = 'palika-overview';

        const {
            title,
            metadata,
        } = this.getInformationDataForSelectedRegion();

        const wardIdList = wardList
            .filter(p => p.district === districtId)
            .map(p => p.id);

        const filter = [
            'match',
            ['id'],
            wardIdList,
            true,
            false,
        ];

        return (
            <div className={_cs(className, styles.districtOverview)}>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                    pending={pendingMetadataRequest}
                    showBackButton
                    onBackButtonClick={onBackButtonClick}
                />
                <MapSource
                    sourceKey={`${sourceKey}-geo-outline`}
                    url={mapSources.nepal.url}
                >
                    <MapLayer
                        layerKey="district-fill"
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
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.palika}
                        paint={mapStyles.palika.outline}
                        filter={filter}
                    />
                </MapSource>
            </div>
        );
    }
}
