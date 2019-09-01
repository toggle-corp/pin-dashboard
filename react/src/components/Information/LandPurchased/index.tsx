import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import Numeral from '#rscv/Numeral';

import { LandPurchased } from '#constants';

import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: LandPurchased;
}

class LandPurchasedView extends React.PureComponent<Props> {
    private getRenderData = memoize((landPurchased: number, totalHouseholds: number) => {
        const landPurchasedInHecters = (landPurchased * 0.0001);
        const averageLandPurchased = (landPurchased / totalHouseholds);

        return {
            landPurchasedInHecters,
            averageLandPurchased,
        };
    });

    public render() {
        const {
            className,
            data,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            landPurchased = 0,
            totalHouseholds = 0,
        } = data;

        const {
            landPurchasedInHecters,
            averageLandPurchased,
        } = this.getRenderData(landPurchased, totalHouseholds);

        return (
            <div className={_cs(className, styles.landPurchased)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Land purchased"
                    />
                </Header>
                <div className={styles.content}>
                    <TextOutput
                        label="Total hectares purchased for relocation"
                        value={(
                            <Numeral
                                value={landPurchasedInHecters}
                                precision={2}
                                showSeparator
                            />
                        )}
                        // invertOrder
                        // hideSeparator
                    />
                    <TextOutput
                        label={(
                            <div>
                                m
                                <sup>2</sup>
                                &nbsp;purchased per household (average)
                            </div>
                        )}
                        value={(
                            <Numeral
                                value={averageLandPurchased}
                                precision={2}
                                showSeparator
                            />
                        )}
                        // invertOrder
                        // hideSeparator
                    />
                </div>
            </div>
        );
    }
}

export default LandPurchasedView;
