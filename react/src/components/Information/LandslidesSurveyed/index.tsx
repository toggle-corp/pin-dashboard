import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import Icon from '#rscg/Icon';

import { LandslidesSurveyed } from '#constants';

import CategoricalTextOutput from '../../CategoricalTextOutput';
import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';
import { renderNumericValue } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: LandslidesSurveyed;
}

class LandslidesSurveyedView extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            data,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            CAT1: cat1 = 0,
            CAT2: cat2 = 0,
            CAT3: cat3 = 0,
        } = data;

        const total = cat1 + cat2 + cat3;

        return (
            <div className={_cs(className, styles.landslidesSurveyed)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Landslides surveyed"
                    />
                    <Icon
                        title="See Geohazard Unit section for more information"
                        className={styles.icon}
                        name="help"
                    />
                </Header>
                <div className={styles.content}>
                    <CategoricalTextOutput
                        riskCategory="high"
                        label="Cat 3"
                        value={renderNumericValue(cat3)}
                    />
                    <CategoricalTextOutput
                        riskCategory="medium"
                        label="Cat 2"
                        value={renderNumericValue(cat2)}
                    />
                    <CategoricalTextOutput
                        riskCategory="low"
                        label="Cat 1"
                        value={renderNumericValue(cat1)}
                    />
                    <TextOutput
                        label="Total"
                        value={renderNumericValue(total)}
                    />
                </div>
            </div>
        );
    }
}

export default LandslidesSurveyedView;
