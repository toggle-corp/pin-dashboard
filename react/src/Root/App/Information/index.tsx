import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import { Metadata } from '#constants';

import LandslidesSurveyed from './LandslidesSurveyed';
import LandslidesRiskScore from './LandslidesRiskScore';
import GeohazardAffectedHouseholds from './GeohazardAffectedHouseholds';
import LandPurchased from './LandPurchased';
import PeopleRelocated from './PeopleRelocated';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: Metadata;
    title?: string;
}

class Information extends React.PureComponent<Props> {
    private getLandPurchasedData = memoize((landPurchased, totalHouseholds) => ({
        landPurchased,
        totalHouseholds,
    }))

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
            geohazardAffected,
            landPurchased,
            totalHouseholds,
            peopleRelocated,
        } = data;

        const landPurchasedData = this.getLandPurchasedData(landPurchased, totalHouseholds);

        return (
            <div className={_cs(className, styles.information)}>
                <header className={styles.header}>
                    <h2 className={styles.heading}>
                        { title }
                    </h2>
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
                    <GeohazardAffectedHouseholds
                        className={styles.geohazardAffectedHouseholds}
                        data={geohazardAffected}
                    />
                    <LandPurchased
                        className={styles.landPurchased}
                        data={landPurchasedData}
                    />
                    <PeopleRelocated
                        className={styles.peopleRelocated}
                        data={peopleRelocated}
                    />
                </div>
            </div>
        );
    }
}

export default Information;
