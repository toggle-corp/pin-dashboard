import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Metadata } from '#constants';
import Information from '../Information';

import styles from './styles.scss';

interface Props {
    className?: string;
    metadata?: Metadata;
    title?: string;
}

class DistrictOverview extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            metadata,
            title,
        } = this.props;

        return (
            <div className={_cs(className, styles.districtOverview)}>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                />
                {/*
                    <MapSource />
                */}
            </div>
        );
    }
}

export default DistrictOverview;
