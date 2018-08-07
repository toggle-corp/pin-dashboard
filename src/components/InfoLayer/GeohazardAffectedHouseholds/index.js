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

const colorScheme = ['#FF9800', '#4CAF50'];

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

        const inProcess = (+data.Eligible || 0) - (+data.Relocated || 0);

        const chartData = [
            { label: 'In process', value: inProcess },
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
                            title="Eligible"
                            value={data.Eligible || 0}
                        />
                        <Label
                            type="medium"
                            title="In process"
                            value={inProcess}
                        />
                        <Label
                            type="low"
                            title="Relocated"
                            value={data.Relocated || 0}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
