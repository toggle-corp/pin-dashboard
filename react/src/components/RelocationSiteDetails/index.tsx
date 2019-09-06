import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { RelocationSite } from '#constants/typeDefinitions';
import TextOutput from '../TextOutput';

import { renderNumericValue } from '#utils/common';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: RelocationSite;
}

class RelocationSiteDetails extends React.PureComponent<Props> {
    public render() {
        const {
            data,
            className,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            place,
            protectionSupport,
            technicalSupport,
            districtName,
            palikaName,
            wardName,
            numberOfHouseholds,
        } = data;

        return (
            <div className={_cs(
                className,
                styles.relocationSiteDetails,
            )}
            >
                <div className={styles.title}>
                    { place }
                </div>
                <div className={styles.content}>
                    <TextOutput
                        label="Address"
                        value={`${districtName}, ${palikaName} - ${wardName}`}
                        className={styles.row}
                        valueClassName={styles.value}
                        labelClassName={styles.label}
                    />
                    <TextOutput
                        label="Number of households"
                        value={renderNumericValue(numberOfHouseholds)}
                        className={styles.row}
                        valueClassName={styles.value}
                        labelClassName={styles.label}
                    />
                    <TextOutput
                        label="Protection support"
                        value={protectionSupport}
                        className={styles.row}
                        valueClassName={styles.value}
                        labelClassName={styles.label}
                    />
                    <TextOutput
                        label="Technical support"
                        value={technicalSupport}
                        className={styles.row}
                        valueClassName={styles.value}
                        labelClassName={styles.label}
                    />
                </div>
            </div>
        );
    }
}

export default RelocationSiteDetails;
