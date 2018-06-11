import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
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
                        value={4056}
                        description="Hectares purchased"
                    />
                    <Detail
                        value={250}
                        description="m2 per household average"
                    />
                </div>
            </div>
        );
    }
}
