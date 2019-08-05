import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { RelocationSite } from '#constants/typeDefinitions';
import TextOutput from '../TextOutput';
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
            siteType,
            status,
            districtName,
            palikaName,
            wardName,
            code,
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
                    />
                    <TextOutput
                        label="Number of households"
                        value={10}
                    />
                    <TextOutput
                        label="Protection support"
                        value={protectionSupport}
                    />
                </div>
            </div>
        );
    }
}

export default RelocationSiteDetails;
