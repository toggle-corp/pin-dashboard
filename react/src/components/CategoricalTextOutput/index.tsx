import React from 'react';
import { _cs } from '@togglecorp/fujs';

import TextOutput from '../TextOutput';

import styles from './styles.scss';

interface Props {
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
    riskCategory?: 'high' | 'medium' | 'low';
    label?: React.ReactNode;
    value?: React.ReactNode;
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
