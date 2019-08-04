import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    children?: React.ReactNode | React.ReactNode[];
}

class Header extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            children,
        } = this.props;

        return (
            <header className={_cs(className, styles.header)}>
                { children }
            </header>
        );
    }
}

export default Header;
