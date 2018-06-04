import React from 'react';
// import PropTypes from 'prop-types';

import styles from './styles.scss';

const propTypes = {
};

const defaultProps = {
};

class App extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => styles.app

    render() {
        const className = this.getClassName();

        return (
            <div className={className}>
                Hello
            </div>
        );
    }
}

export default App;
