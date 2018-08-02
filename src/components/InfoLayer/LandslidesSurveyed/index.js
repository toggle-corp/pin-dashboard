import PropTypes from 'prop-types';
import React from 'react';

import Label from '../../Label';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
};

export default class LandslidesSurveyed extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.landslidesSurveyed,
        ];

        return classNames.join(' ');
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Landslides surveyed
                </h4>
                <div className={styles.content}>
                    <Label
                        type="high"
                        title="Cat 3"
                        value={data.CAT3 || 0}
                    />
                    <Label
                        type="medium"
                        title="Cat 2"
                        value={data.CAT2 || 0}
                    />
                    <Label
                        type="low"
                        title="Cat 1"
                        value={data.CAT1 || 0}
                    />
                </div>
            </div>
        );
    }
}
