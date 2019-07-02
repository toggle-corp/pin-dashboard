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

class NationalOverview extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            metadata,
            title,
        } = this.props;

        return (
            <div className={_cs(className, styles.nationalOverview)}>
                <Information
                    className={styles.information}
                    data={metadata}
                    title={title}
                />
                <div className={styles.map}>
                    Map
                </div>
            </div>
        );
    }
}

export default NationalOverview;
