import React from 'react';
import { _cs } from '@togglecorp/fujs';

import SelectInput from '#rsci/SelectInput';

import RiskPointDetails from '#components/RiskPointDetails';
import RelocationSiteDetails from '#components/RelocationSiteDetails';

import TextOutput from '#components/TextOutput';

import {
    RiskPointWithType,
    RelocationSite,
} from '#constants';

import styles from './styles.scss';

interface Props {
    catPointList?: RiskPointWithType[];
    relocationSiteList?: RelocationSite[];
    onRelocationSiteSelectionChange: (d: string) => void;
    onCatPointSelectionChange: (d: string) => void;
}

interface State {
    catPointSelectInputValue?: string;
    relocationSiteSelectInputValue?: string;
}

const emptyList: [] = [];

const emptyCatPointList: RiskPointWithType[] = emptyList;
const emptyRelocationSiteList: RelocationSite[] = emptyList;

// const riskPointKeySelector = (d: RiskPointWithType) => d.geosite;
// const relocationSiteKeySelector = (d: RelocationSite) => d.code;

const catPointKeySelector = (d: RiskPointWithType) => d.geosite;
const catPointLabelSelector = (d: RiskPointWithType) => d.place;

const relocationSiteKeySelector = (d: RelocationSite) => d.code;
const relocationSiteLabelSelector = (d: RelocationSite) => d.place;

const CatPointListDetails = ({
    selectedCatPointGeosite,
    catPointList,
}: {
    selectedCatPointGeosite: string | undefined;
    catPointList: RiskPointWithType[];
}) => {
    if (catPointList.length === 1) {
        return <RiskPointDetails data={catPointList[0]} />;
    }

    if (catPointList.length > 1) {
        if (selectedCatPointGeosite) {
            const catPoint = catPointList.find(d => d.geosite === selectedCatPointGeosite);
            return <RiskPointDetails data={catPoint} />;
        }

        const totalAffectedHouseholds = catPointList.reduce(
            (acc, val) => acc + (val ? val.hhAffected || 0 : 0),
            0,
        );

        return (
            <div className={styles.relocationSiteListSummary}>
                <div className={styles.title}>
                    Geosite summary
                </div>
                <TextOutput
                    label="Number of geosites"
                    value={catPointList.length}
                />
                <TextOutput
                    label="Total number of affected househods"
                    value={totalAffectedHouseholds}
                />
            </div>
        );
    }

    return null;
};

const RelocationSiteListDetails = ({
    selectedRelocationSiteCode,
    relocationSiteList,
}: {
    selectedRelocationSiteCode: string | undefined;
    relocationSiteList: RelocationSite[];
}) => {
    if (relocationSiteList.length === 1) {
        return <RelocationSiteDetails data={relocationSiteList[0]} />;
    }

    if (relocationSiteList.length > 1) {
        if (selectedRelocationSiteCode) {
            const relocationSite = relocationSiteList.find(
                d => d.code === selectedRelocationSiteCode,
            );

            return <RelocationSiteDetails data={relocationSite} />;
        }

        const totalNumberOfHouseholds = relocationSiteList.reduce(
            (acc, val) => acc + (val ? val.numberOfHouseholds || 0 : 0),
            0,
        );

        return (
            <div className={styles.relocationSiteListSummary}>
                <div className={styles.title}>
                    Relocation summary
                </div>
                <TextOutput
                    label="Number of relocation sites"
                    value={relocationSiteList.length}
                />
                <TextOutput
                    label="Total number of househods"
                    value={totalNumberOfHouseholds}
                />
            </div>
        );
    }

    return null;
};


class PointDetails extends React.PureComponent<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {};
    }

    private getRiskPointRendererParams = (_: string, catPoint: RiskPointWithType) => ({
        data: catPoint,
    })

    private getRelocationSiteRendererParams = (_: string, riskPoint: RelocationSite) => ({
        data: riskPoint,
    })

    private handleBackButtonClick = () => {
        console.warn('back button click');
    }

    private handleCatPointSelectInputChange = (value: string) => {
        this.setState({ catPointSelectInputValue: value });

        const { onCatPointSelectionChange } = this.props;
        onCatPointSelectionChange(value);
    }

    private handleRelocationSiteSelectInputChange = (value: string) => {
        this.setState({ relocationSiteSelectInputValue: value });

        const { onRelocationSiteSelectionChange } = this.props;
        onRelocationSiteSelectionChange(value);
    }

    public render() {
        const {
            catPointList = emptyCatPointList,
            relocationSiteList = emptyRelocationSiteList,
        } = this.props;

        if (catPointList.length === 0 && relocationSiteList.length === 0) {
            return null;
        }

        const {
            catPointSelectInputValue,
            relocationSiteSelectInputValue,
        } = this.state;

        const cat2PointsLen = catPointList.filter(d => d.type === 'cat2');
        const cat3PointsLen = catPointList.filter(d => d.type === 'cat3');

        return (
            <div className={styles.pointDetails}>
                <div className={
                    _cs(
                        styles.catPointListDetails,
                        cat2PointsLen > cat3PointsLen ? styles.cat2 : styles.cat3,
                    )}
                >
                    { catPointList.length > 1 && (
                        <SelectInput
                            className={styles.riskPointSelectInput}
                            label="Select geosite"
                            options={catPointList}
                            onChange={this.handleCatPointSelectInputChange}
                            value={catPointSelectInputValue}
                            keySelector={catPointKeySelector}
                            showHintAndError={false}
                            labelSelector={catPointLabelSelector}
                            optionsClassName={styles.options}
                        />
                    )}
                    <CatPointListDetails
                        catPointList={catPointList}
                        selectedCatPointGeosite={catPointSelectInputValue}
                    />
                </div>
                { relocationSiteList.length > 0 && (
                    <div className={styles.relocationSiteListDetails}>
                        { relocationSiteList.length > 1 && (
                            <SelectInput
                                className={styles.relocationSiteSelectInput}
                                keySelector={relocationSiteKeySelector}
                                label="Select relocation site"
                                labelSelector={relocationSiteLabelSelector}
                                onChange={this.handleRelocationSiteSelectInputChange}
                                options={relocationSiteList}
                                showHintAndError={false}
                                value={relocationSiteSelectInputValue}
                                optionsClassName={styles.options}
                            />
                        )}
                        <RelocationSiteListDetails
                            relocationSiteList={relocationSiteList}
                            selectedRelocationSiteCode={relocationSiteSelectInputValue}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default PointDetails;
