import React from 'react';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

import MultiViewContainer from '#rscv/MultiViewContainer';
import Button from '#rsca/Button';
import List from '#rscv/List';
import DropdownMenu from '#rsca/DropdownMenu';

import NationalOverview from './NationalOverview';
import DistrictOverview from './DistrictOverview';

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

interface Layer {
    key: string;
    label: string;
}

const layers: Layer[] = [
    { key: 'layer1', label: 'Layer 1' },
    { key: 'layer2', label: 'Layer 2' },
    { key: 'layer3', label: 'Layer 3' },
];

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
                    region: countryGeoAttribute,
                    onSubRegionDoubleClick: this.handleDistrictDoubleClick,
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
                        region: activeDistrict,
                        onBackButtonClick: this.handleDistrictBackButtonClick,
                        onSubRegionDoubleClick: this.handlePalikaDoubleClick,
                        regionLevel: 'district',
                        subRegionLevel: 'palika',
                    };
                },
            },
            [ViewLevel.Palika]: {
                component: DistrictOverview,
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
        [ViewLevel.District]: MyType<React.ComponentProps<typeof DistrictOverview>>;
        [ViewLevel.Palika]: MyType<React.ComponentProps<typeof DistrictOverview>>;
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
            key: string;
        };
    }) => {
        console.warn(params.key);
    }

    private getLayerSwitcherDropdownItemRendererParams = (_: keyof(Layer), d: Layer) => ({
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
                key: string;
            };
        }) => {};
    }) => (
        <Button
            onClickParams={{ key: data.key }}
            onClick={onClick}
            transparent
            className={className}
        >
            { data.label }
        </Button>
    )

    public render() {
        const {
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
                        keySelector={d => d.key}
                    />
                </DropdownMenu>
                <Map
                    mapStyle={mapStyle.style}
                    fitBoundsDuration={200}
                    minZoom={5}

                    logoPosition="bottom-right"

                    showScaleControl
                    scaleControlPosition="top-left"

                    showNavControl
                    navControlPosition="top-left"
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
