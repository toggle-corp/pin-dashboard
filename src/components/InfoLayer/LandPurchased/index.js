import PropTypes from 'prop-types';
import React from 'react';

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
                <div className={styles.value}>
                    { value }
                </div>
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

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Land purchased
                </h4>
                <div className={styles.content}>
                    <Detail
                        value={data || '--'}
                        description="m2"
                    />
                </div>
            </div>
        );
    }
}
