import React from 'react';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

import MultiViewContainer from '#rscv/MultiViewContainer';

import NationalOverview from './NationalOverview';
import DistrictOverview from './DistrictOverview';

import { GeoAttribute } from '#constants';

import styles from './styles.scss';

enum ViewLevel {
    National,
    District,
    Ward
}

interface State {
    currentViewLevel: ViewLevel;

    activeDistrict?: GeoAttribute;

    // activePalikaId?: number;
    // palikaBounds: GeoBounds;
}

interface Props {}

const mapStyle = {
    name: 'none',
    style: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
    color: '#dddddd',
};

const countryGeoAttribute: GeoAttribute = {
    id: 0,
    name: 'Nepal',
    centroid: [84.1240, 28.3949],
    bbox: [
        80.05858661752784, 26.347836996368667,
        88.20166918432409, 30.44702867091792,
    ],
};


interface MyType<T> {
    component: React.ComponentType<T>;
    rendererParams?: () => T;
    wrapContainer?: boolean;
    mount?: boolean;
    lazyMount?: boolean;
}

/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            currentViewLevel: ViewLevel.National,
        };

        this.views = {
            [ViewLevel.National]: {
                component: NationalOverview,
                rendererParams: () => ({
                    className: styles.nationalOverview,
                    country: countryGeoAttribute,
                    onDistrictDoubleClick: this.handleDistrictDoubleClick,
                }),
            },
            [ViewLevel.District]: {
                component: DistrictOverview,
                rendererParams: () => {
                    const {
                        activeDistrict,
                    } = this.state;

                    return {
                        className: styles.districtOverview,
                        district: activeDistrict,
                        onBackButtonClick: this.handleDistrictBackButtonClick,
                    };
                },
            },
        };
    }

    private views: {
        [ViewLevel.National]: MyType<React.ComponentProps<typeof NationalOverview>>;
        [ViewLevel.District]: MyType<React.ComponentProps<typeof DistrictOverview>>;
    }

    private handleDistrictBackButtonClick = () => {
        this.setState({
            currentViewLevel: ViewLevel.National,
            activeDistrict: undefined,
        });
    }

    private handleDistrictDoubleClick = (geoAttribute: GeoAttribute) => {
        this.setState({
            currentViewLevel: ViewLevel.District,
            activeDistrict: geoAttribute,
        });
    }

    public render() {
        const {
            currentViewLevel,
        } = this.state;

        return (
            <div className={styles.app}>
                <Map
                    mapStyle={mapStyle.style}
                    fitBoundsDuration={200}
                    minZoom={5}
                    logoPosition="bottom-left"

                    showScaleControl
                    scaleControlPosition="bottom-right"

                    showNavControl
                    navControlPosition="bottom-right"
                >
                    <div className={styles.left}>
                        <MultiViewContainer
                            views={this.views}
                            active={currentViewLevel}
                        />
                    </div>
                    <MapContainer
                        className={styles.right}
                    />
                </Map>
            </div>
        );
    }
}

export default App;
