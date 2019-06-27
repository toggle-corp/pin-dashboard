import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    label?: React.Component | string | number;
    labelClassName?: string;
    value?: React.Component | string | number;
    valueClassName?: string;
    separator?: string;
    separatorClassName?: string;
}

class Information extends React.PureComponent<Props> {
    public static defaultProps = {
        separator: ':',
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
        } = this.props;

        return (
            <div className={_cs(className, styles.textOutput)}>
                <div className={_cs(labelClassName, styles.label)}>
                    { label }
                </div>
                <div className={_cs(separatorClassName, styles.separator)}>
                    { separator }
                </div>
                <div className={_cs(valueClassName, styles.value)}>
                    { value }
                </div>
            </div>
        );
    }
}

export default Information;
