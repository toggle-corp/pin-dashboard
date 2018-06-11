import PropTypes from 'prop-types';
import React from 'react';

import Label from '../../Label';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
};

export default class GeohazardAffectedHouseholds extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.geohazardAffectedHouseholds,
        ];

        return classNames.join(' ');
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Geohazard affected households
                </h4>
                <div className={styles.content}>
                    <div className={styles.chart}>
                        Chart
                    </div>
                    <div className={styles.details}>
                        <Label
                            type="low"
                            title="Eligible"
                            value={data.eligible}
                        />
                        <Label
                            type="medium"
                            title="Applied"
                            value={data.applied}
                        />
                        <Label
                            type="high"
                            title="Relocated"
                            value={data.relocated}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
