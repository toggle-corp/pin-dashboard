import React from 'react';
import PropTypes from 'prop-types';

import Label from '../../../components/Label';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class GeoPointInfo extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    renderConditionalLabel = (p) => {
        const {
            title,
            value,
            type,
        } = p;

        if (!value) {
            return null;
        }

        return (
            <Label
                className={styles.label}
                title={title}
                value={value}
                type={type}
            />
        );
    }

    renderGeoPointDetail = () => {
        const {
            geoPoint,
        } = this.props;

        if (!geoPoint) {
            return null;
        }

        const cats = {
            CAT2: 'Category-2',
            CAT3: 'Category-3',
        };

        const {
            landslideCode,
            landslideCat,
            gpName,
            hhAffected,
            riskScore,
            highRiskOf,
            directRiskFor,
            potentialImpact,
            riskProbability,
            mitigationWorkStatus,
            mitigationWorkBy,
            eligibleHouseholds,
            householdsRelocated,
        } = geoPoint;

        const ConditionalLabel = this.renderConditionalLabel;

        return (
            <div className={styles.geoPointDetail}>
                <h3 className={styles.heading}>
                    { landslideCode } { cats[landslideCat] }
                </h3>
                <Label
                    className={styles.label}
                    title="Gaunpalika"
                    value={gpName}
                />
                <Label
                    className={styles.label}
                    title="Affected households"
                    value={hhAffected}
                />
                <Label
                    className={styles.label}
                    title="Risk score"
                    value={riskScore}
                />
                <Label
                    className={styles.label}
                    title="High risk of"
                    value={highRiskOf}
                />
                <Label
                    className={styles.label}
                    title="Direct risk for"
                    value={directRiskFor}
                />
                <Label
                    className={styles.label}
                    title="Potential impact"
                    value={potentialImpact}
                />
                <Label
                    className={styles.label}
                    title="Risk probability"
                    value={riskProbability}
                />
                <ConditionalLabel
                    title="Mitigation work status"
                    value={mitigationWorkStatus}
                />
                <ConditionalLabel
                    title="Mitigation work by"
                    value={mitigationWorkBy}
                />
                <ConditionalLabel
                    title="Eligible households"
                    value={eligibleHouseholds}
                />
                <ConditionalLabel
                    title="Households relocated"
                    value={householdsRelocated}
                />
            </div>
        );
    }

    render() {
        const {
            className: classNameFromProps,
            geoPoint,
        } = this.props;


        const classNames = [
            classNameFromProps,
            'geo-point-info',
            styles.geoPointInfo,
        ];

        if (!geoPoint) {
            classNames.push(styles.hidden);
            classNames.push('hidden');
        }

        const GeoPointDetail = this.renderGeoPointDetail;
        return (
            <div className={classNames.join(' ')}>
                { geoPoint && <GeoPointDetail /> }
            </div>
        );
    }
}
