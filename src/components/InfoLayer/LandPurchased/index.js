import PropTypes from 'prop-types';
import React from 'react';

import Numeral from '../../../vendor/react-store/components/View/Numeral';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    data: PropTypes.string,
};

const defaultProps = {
    className: '',
    data: undefined,
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
        const { data } = this.props;
        const className = this.getClassName();

        const Detail = this.renderDetail;
        const areaInHectares = (+data) * 0.0001;

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Land purchased
                </h4>
                <div className={styles.content}>
                    <Detail
                        value={areaInHectares}
                        description="hectares"
                    />
                </div>
            </div>
        );
    }
}
