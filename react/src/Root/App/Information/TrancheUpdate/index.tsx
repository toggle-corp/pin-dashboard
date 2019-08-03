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

class TrancheUpdate extends React.PureComponent<Props> {
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
            <div className={_cs(className, styles.trancheUpdate)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Tranche update"
                    />
                </Header>
                <div className={styles.content}>
                    <TextOutput
                        label="First"
                        value={this.renderValue(10)}
                    />
                    <TextOutput
                        label="Second"
                        value={this.renderValue(14)}
                    />
                    <TextOutput
                        label="Third"
                        value={this.renderValue(17)}
                    />
                </div>
            </div>
        );
    }
}

export default TrancheUpdate;
