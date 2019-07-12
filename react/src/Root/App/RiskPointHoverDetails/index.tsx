import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import ListView from '#rscv/List/ListView';
import { RelocationPoint } from '#constants/typeDefinitions';
import TextOutput from '../TextOutput';
import styles from './styles.scss';

interface Props {
    className?: string;
    cat2Point?: RelocationPoint;
    title?: string;
}

const detailKeySelector = d => d.key;

const cat2RenderValueList = [
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

const cat3RenderValueList = [
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
    private getDetailRendererParams = (_, data) => {
        const {
            point,
        } = this.props;

        return {
            label: data.label,
            value: point[data.key],
        };
    }

    public render() {
        const {
            className,
            title,
            type,
        } = this.props;

        const valueRenderList = type === 'cat3'
            ? cat3RenderValueList
            : cat2RenderValueList;


        return (
            <div className={_cs(className, styles.cat2PointHoverDetails)}>
                <div className={styles.title}>
                    { title }
                </div>
                <ListView
                    className={styles.details}
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
