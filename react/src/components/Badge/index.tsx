import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    title?: string;
}

export default class Badge extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            children,
            title,
        } = this.props;

        return (
            <div
                className={_cs(className, styles.badge)}
                title={title}
            >
                { children }
            </div>
        );
    }
}
