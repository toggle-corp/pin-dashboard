import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import { LandslidesSurveyed } from '#constants/typeDefinitions';
import CategoricalTextOutput from '../CategoricalTextOutput';
import styles from './styles.scss';

interface Props {
    className?: string;
    landslidesSurveyed?: LandslidesSurveyed;
    districtName?: string;
}

class HoverDetails extends React.PureComponent<Props> {
    public render() {
        const {
            districtName,
            landslidesSurveyed,
            className,
        } = this.props;

        if (!landslidesSurveyed) {
            return null;
        }

        const {
            CAT1: cat1 = 0,
            CAT2: cat2 = 0,
            CAT3: cat3 = 0,
        } = landslidesSurveyed;

        return (
            <div className={_cs(className, styles.hoverDetails)}>
                <div className={styles.districtName}>
                    { districtName }
                </div>
                <div className={styles.details}>
                    <CategoricalTextOutput
                        riskCategory="low"
                        label="Cat 1"
                        value={(
                            <React.Fragment>
                                <Numeral
                                    value={cat1}
                                    precision={null}
                                    showSeparator
                                />
                                <div className={styles.extra}>
                                    assessed landslides
                                </div>
                            </React.Fragment>
                        )}
                    />
                    <CategoricalTextOutput
                        riskCategory="medium"
                        label="Cat 2"
                        value={(
                            <React.Fragment>
                                <Numeral
                                    value={cat2}
                                    precision={null}
                                    showSeparator
                                />
                                <div className={styles.extra}>
                                    assessed landslides
                                </div>
                            </React.Fragment>
                        )}
                    />
                    <CategoricalTextOutput
                        riskCategory="high"
                        label="Cat 3"
                        value={(
                            <React.Fragment>
                                <Numeral
                                    value={cat3}
                                    precision={null}
                                    showSeparator
                                />
                                <div className={styles.extra}>
                                    assessed landslides
                                </div>
                            </React.Fragment>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default HoverDetails;
