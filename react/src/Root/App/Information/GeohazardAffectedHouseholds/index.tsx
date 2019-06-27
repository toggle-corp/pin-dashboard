import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import { currentStyle } from '#rsu/styles';
import DonutChart from '#rscz/DonutChart';

import { GeohazardAffected } from '#constants';

import CategoricalTextOutput from '../../CategoricalTextOutput';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: GeohazardAffected;
}

// FIXME: write typings for currentStyle ?
const colorScheme = [
    currentStyle.colorWarning,
    currentStyle.colorSuccess,
];

const chartValueSelector = (d: { value: string }) => d.value;
const chartLabelSelector = (d: { label: string }) => d.label;

class GeohazardAffectedHouseholdsView extends React.PureComponent<Props> {
    private getChartData = memoize((relocated, inProcess) => {
        const chartData = [
            { label: 'In process', value: inProcess },
            { label: 'Relocated', value: relocated },
        ];

        return chartData;
    })

    public render() {
        const {
            className,
            data,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            Eligible: eligible = 0,
            Relocated: relocated = 0,
        } = data;

        const inProcess = eligible - relocated;
        const chartData = this.getChartData(relocated, inProcess);

        return (
            <div className={_cs(className, styles.geohazardAffectedHouseholds)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Geohazard affected households"
                    />
                </Header>
                <div className={styles.content}>
                    <div className={styles.chart}>
                        chart
                        {/*
                        <DonutChart
                            colorScheme={colorScheme}
                            className={styles.chart}
                            data={chartData}
                            valueAccessor={chartValueSelector}
                            labelAccessor={chartLabelSelector}
                        />
                        */}
                    </div>
                    <div className={styles.details}>
                        <TextOutput
                            label="Eligible"
                            value={eligible}
                        />
                        <CategoricalTextOutput
                            riskCategory="medium"
                            label="In process"
                            value={inProcess}
                        />
                        <CategoricalTextOutput
                            riskCategory="low"
                            label="Relocated"
                            value={relocated}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default GeohazardAffectedHouseholdsView;
