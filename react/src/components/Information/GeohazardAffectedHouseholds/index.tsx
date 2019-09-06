import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import connectWithStyles from '#rsu/styles/connectWithStyles';

import { GeohazardAffected } from '#constants';

import CategoricalTextOutput from '../../CategoricalTextOutput';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';
import DonutChart from '#components/DonutChart';

import { renderNumericValue } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: GeohazardAffected;
    currentStyles: object;
}

const chartValueSelector = (d: { value: number }) => d.value;
const chartLabelSelector = (d: { label: string; value: number }) => `${d.label}: ${d.value}`;
const chartKeySelector = (d: { key: string }) => d.key;
const chartColorSelector = (d: { color: string }) => d.color;

class GeohazardAffectedHouseholdsView extends React.PureComponent<Props> {
    private getChartData = memoize((relocated, inProcess, currentStyle) => {
        const chartData = [
            {
                key: 'inProcess',
                label: 'In process',
                value: inProcess,
                color: currentStyle.colorWarning,
            },
            {
                key: 'relocated',
                label: 'Relocated',
                value: relocated,
                color: currentStyle.colorSuccess,
            },
        ];

        return chartData;
    })

    public render() {
        const {
            className,
            data,
            currentStyles,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            eligible = 0,
            relocated = 0,
        } = data;

        const inProcess = eligible - relocated;
        const chartData = this.getChartData(relocated, inProcess, currentStyles);

        return (
            <div className={_cs(className, styles.geohazardAffectedHouseholds)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text={(
                            <>
                                Geohazard affected
                                <br />
                                households
                            </>
                        )}
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
                            label="Eligible"
                            value={renderNumericValue(eligible)}
                        />
                        <CategoricalTextOutput
                            riskCategory="medium"
                            label="In process"
                            value={renderNumericValue(inProcess)}
                        />
                        <CategoricalTextOutput
                            riskCategory="low"
                            label="Relocated"
                            value={renderNumericValue(relocated)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connectWithStyles(GeohazardAffectedHouseholdsView);
