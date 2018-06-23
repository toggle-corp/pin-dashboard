import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
};

const defaultProps = {
    className: '',
    value: undefined,
};

export default class Number extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    getClassName = () => {
        const { className } = this.props;

        const classNames = [
            className,
            styles.number,
        ];

        return classNames.join(' ');
    }

    render() {
        const { value } = this.props;
        const className = this.getClassName();

        return (
            <div className={className}>
                { value }
            </div>
        );
    }
}
