import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.node,
    separator: PropTypes.string,
    type: PropTypes.oneOf([
        'low',
        'medium',
        'high',
    ]),
    extra: PropTypes.string,
};

const defaultProps = {
    className: '',
    type: undefined,
    title: '',
    separator: '-',
    value: '',
    extra: undefined,
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
            separator,
            extra,
        } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                <div className={`${styles.title} title`}>
                    { title }
                </div>
                <div className={`${styles.separator} separator`}>
                    { separator }
                </div>
                <div className={`${styles.value} value`}>
                    { value }
                </div>
                { extra && (
                    <div className={`${styles.extra} extra`}>
                        { extra }
                    </div>
                ) }
            </div>
        );
    }
}

