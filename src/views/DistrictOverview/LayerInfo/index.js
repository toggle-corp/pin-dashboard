import React from 'react';
import PropTypes from 'prop-types';

import Label from '../../../components/Label';
import Float from '../../../vendor/react-store/components/View/Float';

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

    renderGaunpalikaInfo = () => {
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
                    FIRST_GaPa: gaunpalikaName,
                },
            },
        } = layer;

        const ConditionalLabel = this.renderConditionalLabel;
        const { landslidesSurveyed = {} } = layerData[gaunpalikaName] || {};

        const {
            CAT1,
            CAT2,
            CAT3,
        } = landslidesSurveyed;

        const noDataAvailable = !(CAT1 || CAT2 || CAT3);

        return (
            <div className={styles.districtInfo}>
                <h5 className={styles.heading}>
                    { gaunpalikaName }
                </h5>
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
            offset,
        } = this.props;


        const className = `
            ${classNameFromProps}
            layer-info
            ${styles.layerInfo}
        `;

        if (!layer) {
            return null;
        }

        const GaunpalikaInfo = this.renderGaunpalikaInfo;

        // eslint-disable-next-line no-underscore-dangle
        const map = layer._map;
        const bounds = layer.getBounds();
        const centerLatLng = bounds.getCenter();

        const center = map.latLngToLayerPoint([centerLatLng.lat, centerLatLng.lng]);

        const style = {
            left: `${center.x + offset.left}px`,
            top: `${center.y + offset.top}px`,
        };

        return (
            <Float>
                <div
                    style={style}
                    className={className}
                >
                    <GaunpalikaInfo />
                </div>
            </Float>
        );
    }
}
