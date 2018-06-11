import PropTypes from 'prop-types';
import React from 'react';

import DonutChart from '../../../vendor/react-store/components/Visualization/DonutChart';

import styles from './styles.scss';
import Label from '../../Label';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
};

export default class LandlessHouseholds extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.landlessHouseholds,
        ];

        return classNames.join(' ');
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();
        const chartData = [
            { label: 'Hello', value: '10' },
            { label: 'Hello from the other side', value: '13' },
        ];

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Landless households
                </h4>
                <div className={styles.content}>
                    <DonutChart
                        className={styles.chart}
                        data={chartData}
                        valueAccessor={d => d.value}
                        labelAccessor={d => d.label}
                    />
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
