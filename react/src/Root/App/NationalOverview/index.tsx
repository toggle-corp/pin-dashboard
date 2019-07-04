import React from 'react';
import { _cs } from '@togglecorp/fujs';

import MapSource from '#rscz/Map/MapSource';
import MapLayer from '#rscz/Map/MapLayer';

import { Metadata, mapSources, mapStyles } from '#constants';
import Information from '../Information';

import styles from './styles.scss';

interface Props {
    className?: string;
    metadata?: Metadata;
    title?: string;
}

class NationalOverview extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            metadata,
            title,
        } = this.props;

        const sourceKey = 'national-overview';

        return (
            <div className={_cs(className, styles.nationalOverview)}>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                />
                <MapSource
                    sourceKey={`${sourceKey}-geo-outline`}
                    url={mapSources.nepal.url}
                    // bounds={bounds}
                    // boundsPadding={boundsPadding}
                >
                    <MapLayer
                        layerKey="district-outline"
                        type="line"
                        sourceLayer={mapSources.nepal.layers.district}
                        paint={mapStyles.district.outline}
                        // layout={showDistrict ? visibleLayout : noneLayout}
                        // filter={districtFilter}
                    />
                </MapSource>
                {/*
                    <MapSource />
                */}
            </div>
        );
    }
}

export default NationalOverview;
