import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import { LandlessHousehold } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: LandlessHousehold;
}

const emptyLandlessData: LandlessHousehold = {};

class EarthaquakeAffectedLandlessHouseholds extends React.PureComponent<Props> {
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
        } = this.props;

        const {
            approved,
            relocated,
            total,
        } = data;

        return (
            <div className={_cs(className, styles.earthquakeAffectedLandlessHouseholds)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Earthquake affected landless households"
                    />
                </Header>
                <div className={styles.content}>
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
        );
    }
}

export default EarthaquakeAffectedLandlessHouseholds;
