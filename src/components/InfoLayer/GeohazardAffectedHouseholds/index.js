import PropTypes from 'prop-types';
import React from 'react';

import DonutChart from '../../../vendor/react-store/components/Visualization/DonutChart';

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

const colorScheme = ['#4CAF50', '#FF9800', '#F44336'];

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

        const chartData = [
            { label: 'Eligible', value: data.Eligible },
            // { label: 'Applied', value: data.Applied },
            { label: 'Relocated', value: data.Relocated },
        ];

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Geohazard affected households
                </h4>
                <div className={styles.content}>
                    <DonutChart
                        colorScheme={colorScheme}
                        className={styles.chart}
                        data={chartData}
                        valueAccessor={d => d.value}
                        labelAccessor={d => d.label}
                    />
                    <div className={styles.details}>
                        <Label
                            type="low"
                            title="Eligible"
                            value={data.Eligible}
                        />
                        {/*
                        <Label
                            type="medium"
                            title="Applied"
                            value={data.Applied}
                        />
                        */}
                        <Label
                            type="high"
                            title="Relocated"
                            value={data.Relocated}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
