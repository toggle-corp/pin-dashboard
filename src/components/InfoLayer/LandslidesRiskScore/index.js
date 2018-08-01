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
                        type="low"
                        title="200 or below"
                        value={data['200 - below']}
                    />
                    <Label
                        type="medium"
                        title="300 - 201"
                        value={data['300-201']}
                    />
                    <Label
                        type="medium"
                        title="400 - 301"
                        value={data['400-301']}
                    />
                    <Label
                        type="medium"
                        title="500 - 401"
                        value={data['500-401']}
                    />
                    <Label
                        type="high"
                        title="625 - 501"
                        value={data['625-501']}
                    />
                </div>
            </div>
        );
    }
}
