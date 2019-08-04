import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import { Tranches } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: Tranches;
}

const emptyTranches: Tranches = {};

class TrancheUpdate extends React.PureComponent<Props> {
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
        } = this.props;

        const {
            first,
            second,
            third,
        } = data;

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
        );
    }
}

export default TrancheUpdate;
