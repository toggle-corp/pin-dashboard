import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Icon from '#rscg/Icon';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import { renderNumericValue } from '#utils/common';
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
        colorBlue: string;
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
                color: currentStyles.colorBlue,
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
                        text="Housing reconstruction tranche details"
                    />
                    <Icon
                        title="See Relocation section for more information"
                        className={styles.icon}
                        name="help"
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
                            className={styles.first}
                            label="First"
                            value={renderNumericValue(first)}
                        />
                        <TextOutput
                            className={styles.second}
                            label="Second"
                            value={renderNumericValue(second)}
                        />
                        <TextOutput
                            className={styles.third}
                            label="Third"
                            value={renderNumericValue(third)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connectWithStyles(TrancheUpdate);
