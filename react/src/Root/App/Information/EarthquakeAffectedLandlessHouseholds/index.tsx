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

class EarthaquakeAffectedLandlessHouseholds extends React.PureComponent<Props> {
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
                        value={this.renderValue(1383)}
                    />
                    <TextOutput
                        label="Relocated to new location"
                        value={this.renderValue(483)}
                    />
                    <TextOutput
                        label="Total"
                        value={this.renderValue(1900)}
                    />
                </div>
            </div>
        );
    }
}

export default EarthaquakeAffectedLandlessHouseholds;
