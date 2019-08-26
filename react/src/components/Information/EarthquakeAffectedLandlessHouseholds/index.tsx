import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Numeral from '#rscv/Numeral';
import Icon from '#rscg/Icon';

import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import DonutChart from '#components/DonutChart';
import connectWithStyles from '#rsu/styles/connectWithStyles';
import { LandlessHousehold } from '#constants';

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

    private renderValue = (value: number | undefined) => (
        <Numeral
            value={value}
            precision={null}
            showSeparator
        />
    )

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
                        title="See Geohazard Unit section for more information"
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
                            label="Approved to live in the existing place"
                            value={this.renderValue(approved)}
                        />
                        <TextOutput
                            label="Relocated to new location"
                            value={this.renderValue(relocated)}
                        />
                        <TextOutput
                            label="Total"
                            value={this.renderValue(total)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connectWithStyles(EarthaquakeAffectedLandlessHouseholds);
