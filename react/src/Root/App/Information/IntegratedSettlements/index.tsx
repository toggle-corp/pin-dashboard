import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import styles from './styles.scss';

interface Props {
    className?: string;
    // data?: LandslidesRiskScore;
}

class IntegratedSettlements extends React.PureComponent<Props> {
    private renderValue = (value: number) => (
        <Numeral
            value={value}
            precision={null}
            showSeparator
        />
    )

    public render() {
        const {
            className,
        } = this.props;

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
                        value={this.renderValue(1383)}
                    />
                    <TextOutput
                        label="Detailed project report approved"
                        value={this.renderValue(483)}
                    />
                    <TextOutput
                        label="Implementation"
                        value={this.renderValue(300)}
                    />
                    <TextOutput
                        label="Completed"
                        value={this.renderValue(400)}
                    />
                    <TextOutput
                        label="Total"
                        value={this.renderValue(3000)}
                    />
                </div>
            </div>
        );
    }
}

export default IntegratedSettlements;
