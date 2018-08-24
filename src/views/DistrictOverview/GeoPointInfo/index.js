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

const getStupidVal = v => (
    (!v || v === '0') ? '' : v
);

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
            cat,
        } = this.props;

        if (!geoPoint) {
            return null;
        }

        const cats = {
            CAT2: 'Category 2',
            CAT3: 'Category 3',
        };

        const {
            place,
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

        const className = `
            ${styles.geoPointDetail}
            ${styles[cat]}
        `;

        return (
            <div className={className}>
                <h3 className={styles.heading}>
                    { place } <span className={styles.separator}>|</span> { cats[landslideCat] }
                </h3>
                <Label
                    className={styles.label}
                    title="Code"
                    value={landslideCode}
                />
                <Label
                    className={styles.label}
                    title="Gaunpalika"
                    value={gpName}
                />
                <Label
                    className={styles.label}
                    title="Affected households"
                    value={getStupidVal(hhAffected)}
                />
                <Label
                    className={styles.label}
                    title="Risk score"
                    value={getStupidVal(riskScore)}
                />
                <Label
                    className={styles.label}
                    title="High risk of"
                    value={getStupidVal(highRiskOf)}
                />
                <Label
                    className={styles.label}
                    title="Direct risk for"
                    value={getStupidVal(directRiskFor)}
                />
                <Label
                    className={styles.label}
                    title="Potential impact"
                    value={getStupidVal(potentialImpact)}
                />
                <Label
                    className={styles.label}
                    title="Risk probability"
                    value={getStupidVal(riskProbability)}
                />
                {cat === 'cat2' && (
                    <React.Fragment>
                        <Label
                            className={styles.label}
                            title="Mitigation work status"
                            value={getStupidVal(mitigationWorkStatus)}
                        />
                        <Label
                            className={styles.label}
                            title="Mitigation work by"
                            value={getStupidVal(mitigationWorkBy)}
                        />
                    </React.Fragment>
                )}
                {cat === 'cat3' && (
                    <React.Fragment>
                        <Label
                            className={styles.label}
                            title="Eligible households"
                            value={getStupidVal(eligibleHouseholds)}
                        />
                        <Label
                            className={styles.label}
                            title="Households relocated"
                            value={getStupidVal(householdsRelocated)}
                        />
                    </React.Fragment>
                )}
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
