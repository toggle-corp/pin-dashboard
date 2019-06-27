import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { Metadata } from '#constants';

import LandslidesSurveyed from './LandslidesSurveyed';
import LandslidesRiskScore from './LandslidesRiskScore';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: Metadata;
    title?: string;
}

class Information extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            data,
            title,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            landslidesSurveyed,
            landslidesRiskScore,
        } = data;

        return (
            <div className={_cs(className, styles.information)}>
                <header className={styles.header}>
                    <h3 className={styles.heading}>
                        { title }
                    </h3>
                </header>
                <div className={styles.content}>
                    <LandslidesSurveyed
                        data={landslidesSurveyed}
                        className={styles.landslidesSurveyed}
                    />
                    <LandslidesRiskScore
                        data={landslidesRiskScore}
                        className={styles.landslidesRiskScore}
                    />
                </div>
            </div>
        );
    }
}

export default Information;
