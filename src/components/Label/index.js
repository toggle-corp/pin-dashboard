import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.oneOf([
        'low',
        'medium',
        'high',
    ]),
};

const defaultProps = {
    className: '',
    children: undefined,
    type: undefined,
    title: '',
    value: '',
};

export default class Label extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const {
            className,
            type,
        } = this.props;

        const classNames = [
            className,
            styles.label,
        ];

        if (type) {
            classNames.push(styles[type]);
        }

        return classNames.join(' ');
    }

    render() {
        const {
            title,
            value,
        } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <div className={styles.title}>
                    { title }
                </div>
                <div className={styles.value}>
                    { value }
                </div>
            </div>
        );
    }
}

