import PropTypes from 'prop-types';
import React from 'react';

import LandslidesSurveyed from './LandslidesSurveyed';
import LandslidesRisk from './LandslidesRisk';
import LandPurchased from './LandPurchased';
import GeohazardAffectedHouseholds from './GeohazardAffectedHouseholds';
import LandlessHouseholds from './LandlessHouseholds';
import NumberOfPeopleRelocated from './NumberOfPeopleRelocated';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    landslidesSurveyed: PropTypes.object.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    landslidesRisk: PropTypes.object.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    landPurchased: PropTypes.object.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    geohazardAffectedHouseholds: PropTypes.object.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    landlessHouseholds: PropTypes.object.isRequired,

    // eslint-disable-next-line react/forbid-prop-types
    numberOfPeopleRelocated: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
};

export default class InfoLayer extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;

        const classNames = [
            className,
            styles.infoLayer,
        ];

        return classNames.join(' ');
    }

    render() {
        const className = this.getClassName();
        const {
            title,
            landslidesSurveyed,
            landslidesRisk,
            landPurchased,
            geohazardAffectedHouseholds,
            landlessHouseholds,
            numberOfPeopleRelocated,
        } = this.props;

        return (
            <div className={className}>
                <h3 className={styles.title}>
                    {title}
                </h3>
                <div className={styles.content}>
                    <LandslidesSurveyed
                        className={styles.landslidesSurveyed}
                        data={landslidesSurveyed}
                    />
                    <LandslidesRisk
                        className={styles.landslidesRisk}
                        data={landslidesRisk}
                    />
                    <LandPurchased
                        className={styles.landPurchased}
                        data={landPurchased}
                    />
                    <GeohazardAffectedHouseholds
                        className={styles.geohazardAffectedHouseholds}
                        data={geohazardAffectedHouseholds}
                    />
                    {/*
                    <LandlessHouseholds
                        className={styles.landlessHouseholds}
                        data={landlessHouseholds}
                    />
                    */}
                    <NumberOfPeopleRelocated
                        className={styles.numberOfPeopleRelocated}
                        data={numberOfPeopleRelocated}
                    />
                </div>
            </div>
        );
    }
}
