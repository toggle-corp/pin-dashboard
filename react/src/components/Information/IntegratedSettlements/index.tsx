import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import { IntegratedSettlementMeta } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: IntegratedSettlementMeta;
}

const emptyIntegratedSettlement: IntegratedSettlementMeta = {};

class IntegratedSettlements extends React.PureComponent<Props> {
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
        } = this.props;

        const {
            phase1,
            phase2,
            phase3,
            completed,
            total,
        } = data;

        return (
            <div className={_cs(className, styles.integratedSettlements)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Integrated settlements"
                    />
                </Header>
                <div className={styles.content}>
                    <TextOutput
                        label="Preliminary approved"
                        value={this.renderValue(phase1)}
                    />
                    <TextOutput
                        label="Detailed project report approved"
                        value={this.renderValue(phase2)}
                    />
                    <TextOutput
                        label="Implementation"
                        value={this.renderValue(phase3)}
                    />
                    <TextOutput
                        label="Completed"
                        value={this.renderValue(completed)}
                    />
                    <TextOutput
                        label="Total"
                        value={this.renderValue(total)}
                    />
                </div>
            </div>
        );
    }
}

export default IntegratedSettlements;
