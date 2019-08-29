import React from 'react';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

import MultiViewContainer from '#rscv/MultiViewContainer';
import Button from '#rsca/Button';
import List from '#rscv/List';
import DropdownMenu from '#rsca/DropdownMenu';

import NationalOverview from './NationalOverview';
import RegionOverview from './RegionOverview';

import { GeoAttribute } from '#constants';

import styles from './styles.scss';

enum ViewLevel {
    National,
    District,
    Palika
}

interface State {
    currentViewLevel: ViewLevel;
    activeDistrict?: GeoAttribute;
    activePalika?: GeoAttribute;
    mapStyle: string;
}

interface Props {}

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

interface Layer {
    style: string;
    label: string;
}

const layers: Layer[] = [
    {
        label: 'Blank',
        style: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
    },
    {
        label: 'Light',
        style: 'mapbox://styles/mapbox/light-v10',
    },
    /*
    {
        label: 'Street',
        style: 'mapbox://styles/mapbox/streets-v11',
    },
    {
        label: 'Roads',
        style: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
    },
    {
        label: 'Outdoor',
        style: 'mapbox://styles/mapbox/outdoors-v11',
    },
     */
    {
        label: 'Satellite',
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
    },
];

const layerKeySelector = (layer: Layer) => layer.style;

/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            currentViewLevel: ViewLevel.National,
            // mapStyle: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
            mapStyle: 'mapbox://styles/mapbox/light-v10',
        };

        this.views = {
            [ViewLevel.National]: {
                component: NationalOverview,
                rendererParams: () => ({
                    className: styles.nationalOverview,
                    region: countryGeoAttribute,
                    onSubRegionDoubleClick: this.handleDistrictDoubleClick,
                }),
            },
            [ViewLevel.District]: {
                component: RegionOverview,
                rendererParams: () => {
                    const {
                        activeDistrict,
                    } = this.state;

                    return {
                        className: styles.districtOverview,
                        region: activeDistrict,
                        onBackButtonClick: this.handleDistrictBackButtonClick,
                        onSubRegionDoubleClick: this.handlePalikaDoubleClick,
                        regionLevel: 'district',
                        subRegionLevel: 'palika',
                    };
                },
            },
            [ViewLevel.Palika]: {
                component: RegionOverview,
                rendererParams: () => {
                    const {
                        activePalika,
                    } = this.state;

                    return {
                        className: styles.palikaOverview,
                        region: activePalika,
                        onBackButtonClick: this.handlePalikaBackButtonClick,
                        onSubRegionDoubleClick: () => {},
                        regionLevel: 'palika',
                        subRegionLevel: 'ward',
                    };
                },
            },
        };
    }

    private views: {
        [ViewLevel.National]: MyType<React.ComponentProps<typeof NationalOverview>>;
        [ViewLevel.District]: MyType<React.ComponentProps<typeof RegionOverview>>;
        [ViewLevel.Palika]: MyType<React.ComponentProps<typeof RegionOverview>>;
    }

    private handleDistrictBackButtonClick = () => {
        this.setState({
            currentViewLevel: ViewLevel.National,
            activeDistrict: undefined,
        });
    }

    private handlePalikaBackButtonClick = () => {
        this.setState({
            currentViewLevel: ViewLevel.District,
            activePalika: undefined,
        });
    }

    private handleDistrictDoubleClick = (geoAttribute: GeoAttribute) => {
        this.setState({
            currentViewLevel: ViewLevel.District,
            activeDistrict: geoAttribute,
        });
    }

    private handlePalikaDoubleClick = (geoAttribute: GeoAttribute) => {
        this.setState({
            currentViewLevel: ViewLevel.Palika,
            activePalika: geoAttribute,
        });
    }

    private handleLayerSwitcherDropdownItemClick = ({ params }: {
        params: {
            style: string;
        };
    }) => {
        this.setState({ mapStyle: params.style });
    }

    private handleMapClick = (e: any) => {
        const eventData = {
            detail: {
                mapEvent: e,
            },
        };

        const mapClickEvent = new CustomEvent('onmapclick', eventData);
        document.dispatchEvent(mapClickEvent);
    }

    private getLayerSwitcherDropdownItemRendererParams = (_: string, d: Layer) => ({
        data: d,
        onClick: this.handleLayerSwitcherDropdownItemClick,
        className: styles.dropdownItem,
    })

    private renderLayerSwitcherDropdownItem = ({
        data,
        onClick,
        className,
    }: {
        data: Layer;
        className?: string;
        onClick: (d: {
            params: {
                style: string;
            };
        }) => void;
    }) => (
        <Button
            // FIXME: should create a wrapper component instead
            onClickParams={{ style: data.style }}
            onClick={onClick}
            transparent
            className={className}
        >
            { data.label }
        </Button>
    )

    public render() {
        const {
            mapStyle,
            currentViewLevel,
        } = this.state;

        return (
            <div className={styles.app}>
                <DropdownMenu
                    className={styles.layerSwitcher}
                    iconName="layers"
                    hideDropdownIcon
                    dropdownClassName={styles.dropdown}
                    closeOnClick
                >
                    <List
                        data={layers}
                        renderer={this.renderLayerSwitcherDropdownItem}
                        rendererParams={this.getLayerSwitcherDropdownItemRendererParams}
                        keySelector={layerKeySelector}
                    />
                </DropdownMenu>
                <Map
                    mapStyle={mapStyle}
                    fitBoundsDuration={200}
                    minZoom={5}

                    logoPosition="bottom-right"

                    showScaleControl
                    scaleControlPosition="top-left"

                    showNavControl
                    navControlPosition="top-left"
                    onClick={this.handleMapClick}
                    enableDoubleClickZoom
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
