import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import { renderNumericValue } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    icon?: string;
    value?: number;
    alt?: string;
}

class People extends React.PureComponent<Props> {
    public render() {
        const {
            icon,
            value,
            className,
            alt,
        } = this.props;

        return (
            <div className={_cs(className, styles.people)}>
                <img
                    alt={alt}
                    className={styles.icon}
                    src={icon}
                />
                <div className={styles.value}>
                    {renderNumericValue(value)}
                </div>
            </div>
        );
    }
}

export default People;
