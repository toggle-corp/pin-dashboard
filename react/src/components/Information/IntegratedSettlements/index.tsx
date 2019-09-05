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

import { IntegratedSettlementMeta } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: IntegratedSettlementMeta;
    currentStyles: {
        colorWarning: string;
        colorSuccess: string;
        colorBlue: string;
    };
}

const emptyIntegratedSettlement: IntegratedSettlementMeta = {};

const chartValueSelector = (d: { value: number }) => d.value;
const chartLabelSelector = (d: { label: string; value: number }) => `${d.label}: ${d.value}`;
const chartKeySelector = (d: { key: string }) => d.key;
const chartColorSelector = (d: { color: string }) => d.color;


class IntegratedSettlements extends React.PureComponent<Props> {
    private getChartData = memoize((
        phase1: number | undefined,
        phase2: number | undefined,
        underConstruction: number | undefined,
        currentStyle: Props['currentStyles'],
    ) => {
        const chartData = [
            {
                key: 'phase1',
                label: 'Preliminary approved',
                value: phase1 || 0,
                color: currentStyle.colorSuccess,
            },
            {
                key: 'phase2',
                label: 'DPR approved',
                value: phase2 || 0,
                color: currentStyle.colorBlue,
            },
            {
                key: 'underConstruction',
                label: 'Under construction',
                value: underConstruction || 0,
                color: currentStyle.colorWarning,
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
            data = emptyIntegratedSettlement,
            className,
            currentStyles,
        } = this.props;

        const {
            phase1,
            phase2,
            phase3,
            completed,
            total,
        } = data;

        const underConstruction = phase3 && completed ? phase3 + completed : undefined;

        const chartData = this.getChartData(phase1, phase2, underConstruction, currentStyles);

        return (
            <div className={_cs(className, styles.integratedSettlements)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Integrated settlements"
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
                            className={styles.preliminaryApproved}
                            label="Preliminary approved"
                            value={this.renderValue(phase1)}
                        />
                        <TextOutput
                            className={styles.dprApproved}
                            label="DPR approved"
                            value={this.renderValue(phase2)}
                        />
                        <TextOutput
                            className={styles.underConstruction}
                            label="Under construction"
                            value={this.renderValue(underConstruction)}
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

export default connectWithStyles(IntegratedSettlements);
