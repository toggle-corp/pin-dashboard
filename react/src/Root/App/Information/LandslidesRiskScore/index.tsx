import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { LandslidesRiskScore } from '#constants';

import TextOutput from '../../TextOutput';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: LandslidesRiskScore;
}

const riskScoreKeys: (keyof LandslidesRiskScore)[] = [
    '625-501',
    '500-401',
    '400-301',
    '300-201',
    '200-Below',
];

class LandslidesRiskScoreView extends React.PureComponent<Props> {
    public getRendererParams = (_: string, riskScoreKey: keyof LandslidesRiskScore) => {
        const { data } = this.props;

        return {
            label: riskScoreKey,
            value: data ? data[riskScoreKey] : undefined,
        };
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <div className={_cs(className, styles.landslidesSurveyed)}>
                <header className={styles.header}>
                    <h4 className={styles.heading}>
                        Landslides risk score
                    </h4>
                </header>
                <ListView
                    className={styles.content}
                    data={riskScoreKeys}
                    renderer={TextOutput}
                    rendererParams={this.getRendererParams}
                />
            </div>
        );
    }
}

export default LandslidesRiskScoreView;
