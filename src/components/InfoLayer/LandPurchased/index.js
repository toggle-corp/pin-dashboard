import PropTypes from 'prop-types';
import React from 'react';

import Numeral from '../../../vendor/react-store/components/View/Numeral';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object,
};

const defaultProps = {
    className: '',
    data: {},
};

export default class LandPurchased extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.landPurchased,
        ];

        return classNames.join(' ');
    }

    renderDetail = (p) => {
        const {
            value,
            description,
        } = p;

        return (
            <div className={styles.detail}>
                <Numeral
                    className={styles.value}
                    value={+value}
                    precision={2}
                />
                <div className={styles.description}>
                    { description }
                </div>
            </div>
        );
    }

    render() {
        const {
            data: {
                landPurchased,
                totalHouseholds,
            },
        } = this.props;
        const className = this.getClassName();

        const Detail = this.renderDetail;
        const areaInHectares = (+landPurchased) * 0.0001;
        const average = (+landPurchased) / (+totalHouseholds);

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Land purchased
                </h4>
                <div className={styles.content}>
                    <Detail
                        value={areaInHectares}
                        description="Total hectares purchased for relocation"
                    />
                    <Detail
                        value={average}
                        description={<div>m<sup>2</sup> purchased per household (average)</div>}
                    />
                </div>
            </div>
        );
    }
}
