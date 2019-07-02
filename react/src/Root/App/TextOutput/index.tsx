import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    label?: React.ReactNode | string | number;
    labelClassName?: string;
    value?: React.ReactNode | string | number;
    valueClassName?: string;
    separator?: string;
    separatorClassName?: string;
    invertOrder?: boolean;
    hideSeparator?: boolean;
}

class Information extends React.PureComponent<Props> {
    public static defaultProps = {
        separator: ':',
        hideSeparator: false,
        invertOrder: false,
    }

    public render() {
        const {
            className,
            label,
            labelClassName,
            separator,
            separatorClassName,
            value,
            valueClassName,
            hideSeparator,
            invertOrder,
        } = this.props;

        return (
            <div className={_cs(
                className,
                styles.textOutput,
                invertOrder && styles.invertOrder,
            )}
            >
                <div className={_cs(labelClassName, styles.label)}>
                    { label }
                </div>
                { !hideSeparator && (
                    <div className={_cs(separatorClassName, styles.separator)}>
                        { separator }
                    </div>
                )}
                <div className={_cs(valueClassName, styles.value)}>
                    { value }
                </div>
            </div>
        );
    }
}

export default Information;
