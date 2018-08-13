import PropTypes from 'prop-types';
import React from 'react';

import Numeral from '../../../vendor/react-store/components/View/Numeral';

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

        const total = (data.CAT3 || 0) + (data.CAT2 || 0) + (data.CAT1 || 0);

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Landslides surveyed
                </h4>
                <div className={styles.content}>
                    <Label
                        className={styles.label}
                        separator=":"
                        type="high"
                        title="Cat 3"
                        value={
                            <Numeral
                                value={data.CAT3 || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        className={styles.label}
                        separator=":"
                        type="medium"
                        title="Cat 2"
                        value={
                            <Numeral
                                value={data.CAT2 || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        className={styles.label}
                        separator=":"
                        type="low"
                        title="Cat 1"
                        value={
                            <Numeral
                                value={data.CAT1 || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        className={styles.label}
                        separator=":"
                        title="Total"
                        value={
                            <Numeral
                                value={total || 0}
                                precision={0}
                            />
                        }
                    />
                </div>
            </div>
        );
    }
}
