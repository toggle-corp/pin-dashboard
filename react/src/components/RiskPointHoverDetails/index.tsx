import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import { RiskPoint } from '#constants/typeDefinitions';
import TextOutput from '../TextOutput';
import styles from './styles.scss';

interface Props {
    className?: string;
    title?: string;
    type?: 'cat2' | 'cat3';
    point?: RiskPoint;
}

interface KeyLabel {
    key: keyof RiskPoint;
    label: string;
}

const detailKeySelector = (d: KeyLabel) => d.key;

const cat2RenderValueList: KeyLabel[] = [
    { key: 'landslideCode', label: 'Code' },
    { key: 'gpName', label: 'Gaunpalika' },
    { key: 'hhAffected', label: 'Affected households' },
    { key: 'riskScore', label: 'Risk score' },
    { key: 'highRiskOf', label: 'High risk of' },
    { key: 'directRiskFor', label: 'Direct risk for' },
    { key: 'potentialImpact', label: 'Potential impact' },
    { key: 'riskProbability', label: 'Risk probability' },
    { key: 'mitigationWorkStatus', label: 'Mitigation work status' },
    { key: 'mitigationWorkBy', label: 'Mitigation work by' },
];

const cat3RenderValueList: KeyLabel[] = [
    { key: 'landslideCode', label: 'Code' },
    { key: 'gpName', label: 'Gaunpalika' },
    { key: 'hhAffected', label: 'Affected households' },
    { key: 'riskScore', label: 'Risk score' },
    { key: 'highRiskOf', label: 'High risk of' },
    { key: 'directRiskFor', label: 'Direct risk for' },
    { key: 'potentialImpact', label: 'Potential impact' },
    { key: 'riskProbability', label: 'Risk probability' },
    { key: 'eligibleHouseholds', label: 'Eligible households' },
    { key: 'householdsRelocated', label: 'Households relocated' },
];


class RiskPointHoverDetails extends React.PureComponent<Props> {
    private getDetailRendererParams = (_: string, data: KeyLabel) => {
        const {
            point,
        } = this.props;

        return {
            label: data.label,
            value: point ? point[data.key] : undefined,
            valueClassName: styles.value,
            labelClassName: styles.label,
        };
    }

    public render() {
        const {
            className,
            title,
            type = 'cat2',
        } = this.props;

        const valueRenderList = type === 'cat3'
            ? cat3RenderValueList
            : cat2RenderValueList;

        const catStyles = {
            cat2: styles.cat2,
            cat3: styles.cat3,
        };

        return (
            <div className={_cs(
                className,
                styles.catPointHoverDetails,
                catStyles[type],
            )}
            >
                <div className={styles.title}>
                    { title }
                </div>
                <ListView
                    data={valueRenderList}
                    keySelector={detailKeySelector}
                    renderer={TextOutput}
                    rendererParams={this.getDetailRendererParams}
                />
            </div>
        );
    }
}

export default RiskPointHoverDetails;
