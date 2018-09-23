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

export default class LandslidesRiskScore extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.landslidesRisk,
        ];

        return classNames.join(' ');
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Landslides risk score
                    <i
                        className={`${styles.helpIcon} ion-help-circled`}
                        title="See Geohazard Unit section for more information"
                    />
                </h4>
                <div className={styles.content}>
                    <Label
                        separator=":"
                        className={styles.label}
                        title="625 - 501"
                        value={
                            <Numeral
                                value={data['625-501'] || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        title="500 - 401"
                        value={
                            <Numeral
                                value={data['500-401'] || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        title="400 - 301"
                        value={
                            <Numeral
                                value={data['400-301'] || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        title="300 - 201"
                        value={
                            <Numeral
                                value={data['300-201'] || 0}
                                precision={0}
                            />
                        }
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        title="200 -"
                        value={
                            <Numeral
                                value={data['200-Below'] || 0}
                                precision={0}
                            />
                        }
                    />
                </div>
            </div>
        );
    }
}
