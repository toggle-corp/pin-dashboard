import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    text?: string;
}

class Heading extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            text,
        } = this.props;

        return (
            <h3 className={_cs(className, styles.heading)}>
                { text }
            </h3>
        );
    }
}

export default Heading;
