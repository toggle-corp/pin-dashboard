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

export default class LandslidesRisk extends React.PureComponent {
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
                    Landslides risk rating
                </h4>
                <div className={styles.content}>
                    <Label
                        type="low"
                        title="Critical"
                        value={data.Critical}
                    />
                    <Label
                        type="medium"
                        title="Highly critical"
                        value={data['Highly Critical']}
                    />
                    <Label
                        type="high"
                        title="Severe"
                        value={data.Severe}
                    />
                </div>
            </div>
        );
    }
}
