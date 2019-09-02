import React from 'react';
import memoize from 'memoize-one';
import { _cs } from '@togglecorp/fujs';

import LoadingAnimation from '#rscv/LoadingAnimation';
import Message from '#rscv/Message';

import Button from '#rsca/Button';
import { Base } from '#constants';

import LandslidesSurveyed from './LandslidesSurveyed';
import EarthquakeAffectedLandlessHouseholds from './EarthquakeAffectedLandlessHouseholds';
import IntegratedSettlements from './IntegratedSettlements';
import GeohazardAffectedHouseholds from './GeohazardAffectedHouseholds';
import LandPurchased from './LandPurchased';
import TrancheUpdate from './TrancheUpdate';
import PeopleRelocated from './PeopleRelocated';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: Base;
    title?: string;
    pending?: boolean;
    showBackButton?: boolean;
    onBackButtonClick?: () => void;
}

class Information extends React.PureComponent<Props> {
    private getLandPurchasedData = memoize((landPurchased, totalHouseholds) => ({
        landPurchased,
        totalHouseholds,
    }))

    private renderDetail = () => {
        const {
            data,
            pending,
        } = this.props;

        if (pending) {
            return (
                <LoadingAnimation
                    message="Loading Data"
                />
            );
        }
        if (!data) {
            return (
                <Message>
                    Data not available
                </Message>
            );
        }

        const {
            landslidesSurveyed,
            geohazardAffected,
            landPurchased,
            totalHouseholds,
            peopleRelocated,
            tranches,
            integratedSettlements,
            landlessHouseholds,
        } = data;

        const landPurchasedData = this.getLandPurchasedData(landPurchased, totalHouseholds);

        return (
            <>
                <div className={styles.row}>
                    <LandslidesSurveyed
                        data={landslidesSurveyed}
                        className={styles.landslidesSurveyed}
                    />
                    <GeohazardAffectedHouseholds
                        className={styles.geohazardAffectedHouseholds}
                        data={geohazardAffected}
                    />
                </div>
                <IntegratedSettlements
                    data={integratedSettlements}
                    className={styles.integratedSettlements}
                />
                <div className={styles.row}>
                    <TrancheUpdate
                        className={styles.trancheUpdate}
                        data={tranches}
                    />
                    <LandPurchased
                        className={styles.landPurchased}
                        data={landPurchasedData}
                    />
                </div>
                <PeopleRelocated
                    className={styles.peopleRelocated}
                    data={peopleRelocated}
                />
                <EarthquakeAffectedLandlessHouseholds
                    data={landlessHouseholds}
                    className={styles.earthquakeLandlessHouseholds}
                />
            </>
        );
    }

    public render() {
        const {
            className,
            title = 'Unknown',
            showBackButton,
            onBackButtonClick,
        } = this.props;

        return (
            <div className={_cs(className, styles.information)}>
                <header className={styles.header}>
                    { showBackButton && (
                        <Button
                            transparent
                            smallHorizontalPadding
                            smallVerticalPadding
                            className={styles.backButton}
                            iconName="back"
                            onClick={onBackButtonClick}
                        />
                    )}
                    <h2 className={styles.heading}>
                        { title }
                    </h2>
                </header>
                <div className={styles.content}>
                    {this.renderDetail()}
                </div>
            </div>
        );
    }
}

export default Information;
