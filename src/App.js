// import PropTypes from 'prop-types';
import React from 'react';

import LoadingAnimation from './vendor/react-store/components/View/LoadingAnimation';

import Overview from './views/Overview';
import DistrictOverview from './views/DistrictOverview';

import DistrictsGeoJsonRequest from './requests/NepalDistrictsGeoJsonRequest';
import GaunpalikasGeoJsonRequest from './requests/NepalGaunpalikasGeoJsonRequest';

const propTypes = {
};

const defaultProps = {
};

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            districtsGeoJson: undefined,
            gaunpalikasGeoJson: undefined,
            pendingDistricts: true,
            pendingGaunpalikas: true,
            selectedDistrictName: undefined,
        };

        const setState = d => this.setState(d);
        this.districtsRequest = new DistrictsGeoJsonRequest({ setState });
        this.gaunpalikasRequest = new GaunpalikasGeoJsonRequest({ setState });
    }

    componentWillMount() {
        this.districtsRequest.init();
        this.gaunpalikasRequest.init();

        this.districtsRequest.start();
        this.gaunpalikasRequest.start();
    }

    handleDistrictLayerDoubleClick = (districtName) => {
        this.setState({
            selectedDistrictName: districtName,
        });
    }

    handleDistrictOverviewBackButtonClick = () => {
        this.setState({
            selectedDistrictName: undefined,
        });
    }

    render() {
        const {
            pendingDistricts,
            pendingGaunpalikas,
            selectedDistrictName,
            districtsGeoJson,
            gaunpalikasGeoJson,
        } = this.state;

        if (pendingDistricts || pendingGaunpalikas) {
            return <LoadingAnimation large />;
        }

        if (selectedDistrictName) {
            return (
                <DistrictOverview
                    districtName={selectedDistrictName}
                    geoJson={gaunpalikasGeoJson}
                    onBackButtonClick={this.handleDistrictOverviewBackButtonClick}
                />
            );
        }

        return (
            <Overview
                geoJson={districtsGeoJson}
                onLayerDoubleClick={this.handleDistrictLayerDoubleClick}
            />
        );
    }
}

export default App;
