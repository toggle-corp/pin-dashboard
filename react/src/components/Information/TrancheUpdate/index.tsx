import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Numeral from '#rscv/Numeral';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import DonutChart from '#components/DonutChart';
import connectWithStyles from '#rsu/styles/connectWithStyles';

import { Tranches } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: Tranches;
    currentStyles: {
        colorWarning: string;
        colorSuccess: string;
        colorPurple: string;
    };
}

const emptyTranches: Tranches = {};

const chartValueSelector = (d: { value: number }) => d.value;
const chartLabelSelector = (d: { label: string; value: number }) => `${d.label}: ${d.value}`;
const chartKeySelector = (d: { key: string }) => d.key;
const chartColorSelector = (d: { color: string }) => d.color;

class TrancheUpdate extends React.PureComponent<Props> {
    private getChartData = memoize((
        first: number | undefined,
        second: number | undefined,
        third: number | undefined,
        currentStyles: Props['currentStyles'],
    ) => {
        const chartData = [
            {
                key: 'first',
                label: 'First',
                value: first || 0,
                color: currentStyles.colorSuccess,
            },
            {
                key: 'second',
                label: 'Second',
                value: second || 0,
                color: currentStyles.colorPurple,
            },
            {
                key: 'third',
                label: 'Third',
                value: third || 0,
                color: currentStyles.colorWarning,
            },
        ];

        return chartData;
    })

    private renderValue = (value: number | undefined) => (
        <Numeral
            value={value}
            precision={null}
            showSeparator
        />
    )

    public render() {
        const {
            className,
            data = emptyTranches,
            currentStyles,
        } = this.props;

        const {
            first,
            second,
            third,
        } = data;

        const chartData = this.getChartData(first, second, third, currentStyles);

        return (
            <div className={_cs(className, styles.trancheUpdate)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Reconstruction housing tranche details"
                    />
                </Header>
                <div className={styles.content}>
                    <div className={styles.chartContainer}>
                        <DonutChart
                            className={styles.chart}
                            data={chartData}
                            labelSelector={chartLabelSelector}
                            valueSelector={chartValueSelector}
                            colorSelector={chartColorSelector}
                            keySelector={chartKeySelector}
                        />
                    </div>
                    <div className={styles.details}>
                        <TextOutput
                            label="First"
                            value={this.renderValue(first)}
                        />
                        <TextOutput
                            label="Second"
                            value={this.renderValue(second)}
                        />
                        <TextOutput
                            label="Third"
                            value={this.renderValue(third)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connectWithStyles(TrancheUpdate);
