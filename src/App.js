import PropTypes from 'prop-types';
import React from 'react';
import Overview from './views/Overview';

const propTypes = {
};

const defaultProps = {
};

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    render() {
        return (
            <Overview />
        );
    }
}

export default App;
