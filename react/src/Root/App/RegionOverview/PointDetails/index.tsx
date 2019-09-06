import React from 'react';
import { _cs } from '@togglecorp/fujs';

import SelectInput from '#rsci/SelectInput';

import RiskPointDetails from '#components/RiskPointDetails';
import RelocationSiteDetails from '#components/RelocationSiteDetails';

import AccentButton from '#rsca/Button/AccentButton';
import TextOutput from '#components/TextOutput';

import {
    RiskPointWithType,
    RelocationSite,
} from '#constants';

import styles from './styles.scss';

interface Props {
    catPointList?: RiskPointWithType[];
    relocationSiteList?: RelocationSite[];
    onRelocationSiteSelectionChange: (d: string | undefined) => void;
    onCatPointSelectionChange: (d: string | undefined) => void;
}

interface State {
    catPointSelectInputValue?: string;
    relocationSiteSelectInputValue?: string;
}

const emptyList: [] = [];

const emptyCatPointList: RiskPointWithType[] = emptyList;
const emptyRelocationSiteList: RelocationSite[] = emptyList;

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
            <div className={styles.catPointListSummary}>
                <div className={styles.title}>
                    Place of origin - overview
                </div>
                <TextOutput
                    labelClassName={styles.label}
                    valueClassName={styles.value}
                    label="Number of geosites"
                    value={catPointList.length}
                />
                <TextOutput
                    labelClassName={styles.label}
                    valueClassName={styles.value}
                    label="Total number of affected househods"
                    value={totalAffectedHouseholds || '-'}
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
                    Overview of relocation sites
                </div>
                <TextOutput
                    labelClassName={styles.label}
                    valueClassName={styles.value}
                    label="Number of relocation sites"
                    value={relocationSiteList.length}
                />
                <TextOutput
                    labelClassName={styles.label}
                    valueClassName={styles.value}
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

    private handleRiskPointBackButtonClick = () => {
        this.setState({ catPointSelectInputValue: undefined });

        const { onCatPointSelectionChange } = this.props;
        onCatPointSelectionChange(undefined);
    }

    private handleRelocationSiteBackButtonClick = () => {
        this.setState({ relocationSiteSelectInputValue: undefined });

        const { onRelocationSiteSelectionChange } = this.props;
        onRelocationSiteSelectionChange(undefined);
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
                    <CatPointListDetails
                        catPointList={catPointList}
                        selectedCatPointGeosite={catPointSelectInputValue}
                    />
                    { catPointList.length > 1 && (
                        <div className={styles.riskPointSelectContainer}>
                            <SelectInput
                                className={styles.riskPointSelectInput}
                                label="Select place of origin"
                                options={catPointList}
                                onChange={this.handleCatPointSelectInputChange}
                                value={catPointSelectInputValue}
                                keySelector={catPointKeySelector}
                                showHintAndError={false}
                                labelSelector={catPointLabelSelector}
                                optionsClassName={styles.options}
                                hideClearButton
                            />
                            { catPointSelectInputValue && (
                                <AccentButton
                                    className={styles.backButton}
                                    onClick={this.handleRiskPointBackButtonClick}
                                >
                                    Back to summary
                                </AccentButton>
                            )}
                        </div>
                    )}
                </div>
                { relocationSiteList.length > 0 && (
                    <div className={styles.relocationSiteListDetails}>
                        <RelocationSiteListDetails
                            relocationSiteList={relocationSiteList}
                            selectedRelocationSiteCode={relocationSiteSelectInputValue}
                        />
                        { relocationSiteList.length > 1 && (
                            <div className={styles.relocationSiteSelectContainer}>
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
                                { relocationSiteSelectInputValue && (
                                    <AccentButton
                                        className={styles.backButton}
                                        onClick={this.handleRelocationSiteBackButtonClick}
                                    >
                                        Back to summary
                                    </AccentButton>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default PointDetails;
