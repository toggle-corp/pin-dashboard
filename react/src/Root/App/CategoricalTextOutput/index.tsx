import React from 'react';
import { _cs } from '@togglecorp/fujs';

import TextOutput from '../TextOutput';

import styles from './styles.scss';

interface Props {
    className?: string;
    riskCategory?: string;
    labelClassName?: string;
    valueClassName?: string;
    label?: React.Component | string | number;
    value?: React.Component | string | number;
}

const riskCategoryStyleMap: { [key: string]: string } = {
    high: styles.high,
    medium: styles.medium,
    low: styles.low,
};

class CategoricalTextOutput extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            riskCategory,
            labelClassName,
            valueClassName,
            ...otherProps
        } = this.props;

        return (
            <TextOutput
                className={_cs(
                    styles.textOutput,
                    riskCategory && riskCategoryStyleMap[riskCategory],
                    className,
                )}
                {...otherProps}
                labelClassName={_cs(styles.label, labelClassName)}
                valueClassName={_cs(styles.value, valueClassName)}
            />
        );
    }
}

export default CategoricalTextOutput;
