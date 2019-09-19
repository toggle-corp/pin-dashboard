import React from 'react';
import { _cs } from '@togglecorp/fujs';

import { LandslidesSurveyed } from '#constants/typeDefinitions';
import CategoricalTextOutput from '#components/CategoricalTextOutput';
import Badge from '#components/Badge';
import { renderNumericValue } from '#utils/common';
import { GeoAttributeType } from '#constants';
import styles from './styles.scss';

interface Props {
    className?: string;
    landslidesSurveyed?: LandslidesSurveyed;
    name?: string;
    geoAttributeType?: GeoAttributeType;
}

const attributeTypeMap: {
    [key in GeoAttributeType]: string;
} = {
    Gaunpalika: 'GP',
    Nagarpalika: 'NP',
};

class HoverDetails extends React.PureComponent<Props> {
    public render() {
        const {
            name,
            landslidesSurveyed,
            className,
            geoAttributeType,
        } = this.props;

        if (!landslidesSurveyed) {
            return null;
        }

        const {
            CAT1: cat1,
            CAT2: cat2,
            CAT3: cat3,
        } = landslidesSurveyed;

        return (
            <div className={_cs(className, styles.hoverDetails)}>
                <div className={styles.name}>
                    <div
                        title={name}
                        className={styles.title}
                    >
                        { name }
                    </div>
                    { geoAttributeType && (
                        <>
                            &nbsp;
                            <Badge
                                className={styles.geoAttributeType}
                                title={geoAttributeType}
                            >
                                { attributeTypeMap[geoAttributeType] }
                            </Badge>
                        </>
                    )}
                </div>
                <div className={styles.details}>
                    <CategoricalTextOutput
                        riskCategory="low"
                        label="Cat 1"
                        value={(
                            <>
                                { renderNumericValue(cat1) }
                                { cat1 && (
                                    <div className={styles.extra}>
                                        assessed landslides
                                    </div>
                                )}
                            </>
                        )}
                    />
                    <CategoricalTextOutput
                        riskCategory="medium"
                        label="Cat 2"
                        value={(
                            <>
                                { renderNumericValue(cat2) }
                                { cat2 && (
                                    <div className={styles.extra}>
                                        assessed landslides
                                    </div>
                                )}
                            </>
                        )}
                    />
                    <CategoricalTextOutput
                        riskCategory="high"
                        label="Cat 3"
                        value={(
                            <>
                                { renderNumericValue(cat3) }
                                { cat3 && (
                                    <div className={styles.extra}>
                                        assessed landslides
                                    </div>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>
        );
    }
}

export default HoverDetails;
