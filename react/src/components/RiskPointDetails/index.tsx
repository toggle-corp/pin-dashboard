import React from 'react';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';
import { RiskPointWithType } from '#constants/typeDefinitions';
import TextOutput from '../TextOutput';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: RiskPointWithType;
}

interface KeyLabel {
    key: keyof RiskPointWithType;
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

const categoryNameMapping = {
    cat2: 'Category 2',
    cat3: 'Category 3',
};

class RiskPointHoverDetails extends React.PureComponent<Props> {
    private getDetailRendererParams = (_: string, renderValue: KeyLabel) => {
        const {
            data,
        } = this.props;

        return {
            label: renderValue.label,
            value: data ? data[renderValue.key] : undefined,
            valueClassName: styles.value,
            labelClassName: styles.label,
        };
    }

    public render() {
        const {
            className,
            // regionName,
            data,
        } = this.props;

        if (!data) {
            return null;
        }

        const valueRenderList = data.type === 'cat3'
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
                catStyles[data.type],
            )}
            >
                <div className={styles.title}>
                    {`${data.place} / ${categoryNameMapping[data.type]}`}
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
