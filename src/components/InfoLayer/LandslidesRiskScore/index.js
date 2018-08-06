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
                        title="See Geohazard Categorization section for more information"
                    />
                </h4>
                <div className={styles.content}>
                    <Label
                        separator=":"
                        className={styles.label}
                        type="high"
                        title="625 - 501"
                        value={data['625-501'] || 0}
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        type="high"
                        title="500 - 401"
                        value={data['500-401'] || 0}
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        type="medium"
                        title="400 - 301"
                        value={data['400-301'] || 0}
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        type="medium"
                        title="300 - 201"
                        value={data['300-201'] || 0}
                    />
                    <Label
                        separator=":"
                        className={styles.label}
                        type="low"
                        title="200 -"
                        value={data['200-Below'] || 0}
                    />
                </div>
            </div>
        );
    }
}
