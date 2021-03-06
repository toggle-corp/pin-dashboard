import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Icon from '#rscg/Icon';

import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import DonutChart from '#components/DonutChart';
import connectWithStyles from '#rsu/styles/connectWithStyles';
import { LandlessHousehold } from '#constants';
import { renderNumericValue } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: LandlessHousehold;
    currentStyles: {
        colorWarning: string;
        colorSuccess: string;
    };
}

const emptyLandlessData: LandlessHousehold = {};

const chartValueSelector = (d: { value: number }) => d.value;
const chartLabelSelector = (d: { label: string; value: number }) => `${d.label}: ${d.value}`;
const chartKeySelector = (d: { key: string }) => d.key;
const chartColorSelector = (d: { color: string }) => d.color;

class EarthaquakeAffectedLandlessHouseholds extends React.PureComponent<Props> {
    private getChartData = memoize((
        relocated: number | undefined,
        approved: number | undefined,
        currentStyles: Props['currentStyles'],
    ) => {
        const chartData = [
            {
                key: 'approved',
                label: 'Approved to live in the existing place',
                value: approved || 0,
                color: currentStyles.colorSuccess,
            },
            {
                key: 'relocated',
                label: 'Relocated to new location',
                value: relocated || 0,
                color: currentStyles.colorWarning,
            },
        ];

        return chartData;
    })

    public render() {
        const {
            data = emptyLandlessData,
            className,
            currentStyles,
        } = this.props;

        const {
            approved,
            relocated,
            total,
        } = data;

        const chartData = this.getChartData(relocated, approved, currentStyles);

        return (
            <div className={_cs(className, styles.earthquakeAffectedLandlessHouseholds)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Earthquake affected landless households"
                    />
                    <Icon
                        title="See Landless section for more information"
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
                            className={styles.approved}
                            label="Approved to live in the existing place"
                            value={renderNumericValue(approved)}
                        />
                        <TextOutput
                            className={styles.relocated}
                            label="Relocated to new location"
                            value={renderNumericValue(relocated)}
                        />
                        <TextOutput
                            label="Total"
                            value={renderNumericValue(total)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connectWithStyles(EarthaquakeAffectedLandlessHouseholds);
