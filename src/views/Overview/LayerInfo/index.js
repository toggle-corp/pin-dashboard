import React from 'react';
import PropTypes from 'prop-types';

import Label from '../../../components/Label';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

export default class LayerInfo extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    renderConditionalLabel = (p) => {
        const {
            title,
            value,
            type,
        } = p;

        if (!value) {
            return null;
        }

        return (
            <Label
                className={styles.label}
                title={title}
                value={`${value} assessed landslides`}
                type={type}
            />
        );
    }

    renderDistrictInfo = () => {
        const {
            layer,
            layerData = {},
        } = this.props;

        if (!layer) {
            return null;
        }

        const {
            feature: {
                properties: {
                    DISTRICT: districtName,
                },
            },
        } = layer;

        const ConditionalLabel = this.renderConditionalLabel;
        const { landslidesSurveyed = {} } = layerData[districtName] || {};

        const {
            CAT1,
            CAT2,
            CAT3,
        } = landslidesSurveyed;

        const noDataAvailable = !(CAT1 || CAT2 || CAT3);

        return (
            <div className={styles.districtInfo}>
                <h2 className={styles.heading}>
                    { districtName }
                </h2>
                <ConditionalLabel
                    title="Cat 1"
                    value={CAT1}
                    type="low"
                />
                <ConditionalLabel
                    title="Cat 2"
                    value={CAT2}
                    type="medium"
                />
                <ConditionalLabel
                    title="Cat 3"
                    value={CAT3}
                    type="high"
                />
                { noDataAvailable && (
                    <p className={styles.noDataAvailable}>
                        No data available
                    </p>
                )}
            </div>
        );
    }

    render() {
        const {
            className: classNameFromProps,
            layer,
        } = this.props;

        const classNames = [
            classNameFromProps,
            'layer-info',
            styles.layerInfo,
        ];

        if (!layer) {
            classNames.push(styles.hidden);
            classNames.push('hidden');
        }

        const DistrictInfo = this.renderDistrictInfo;

        return (
            <div className={classNames.join(' ')}>
                { layer && <DistrictInfo /> }
            </div>
        );
    }
}
