import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
}

class Legend extends React.PureComponent<Props> {
    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(className, styles.legend)}>
                <div className={_cs(styles.legendItem, styles.cat2)}>
                    <div className={styles.circle} />
                    <div className={styles.label}>
                        Category 2 point
                    </div>
                </div>
                <div className={_cs(styles.legendItem, styles.cat3)}>
                    <div className={styles.circle} />
                    <div className={styles.label}>
                        Category 3 point
                    </div>
                </div>
                <div className={_cs(styles.legendItem, styles.privateLand)}>
                    <div className={styles.circle} />
                    <div className={styles.label}>
                        Relocation point (private land)
                    </div>
                </div>
                <div className={_cs(styles.legendItem, styles.integratedSettlement)}>
                    <div className={styles.diamond} />
                    <div className={styles.label}>
                        Integrated settlement
                    </div>
                </div>
            </div>
        );
    }
}

export default Legend;
