import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';

import MapLayer from '../../components/MapLayer';
import InfoLayer from '../../components/InfoLayer';
import styles from './styles.scss';

import LayerInfo from './LayerInfo';
import MetadataRequest from './requests/MetadataRequest';

import { affectedDistricts, mostAffectedDistricts } from './affectedDistricts';

const propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    geoJson: PropTypes.object.isRequired,
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

// const emptyList = [];
const emptyObject = {};

export default class Overview extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.defaultTitle = 'Nepal';

        this.state = {
            title: this.defaultTitle,
            nepalDistricts: undefined,
            hoverOverLayer: undefined,
            metadata: {},
            pendingMetadata: false,
        };

        const setState = d => this.setState(d);
        this.metadataRequest = new MetadataRequest({ setState });

        this.mapContainer = React.createRef();

        this.mapLayerOptions = {
            onEachFeature: this.handleMapFeature,
        };
    }

    componentWillMount() {
        this.metadataRequest.init();
        this.metadataRequest.start();
    }

    componentDidMount() {
        const { current: mapContainer } = this.mapContainer;

        this.map = L.map(mapContainer, {
            zoomControl: true,
        }).setView([28.395, 84.124], 13);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap, © CartoDB' }).addTo(this.map);
        this.mapContainerOffset = mapContainer.getBoundingClientRect();
    }

    componentWillUnmount() {
        this.metadataRequest.stop();
    }

    getClassName = () => {
        const { className } = this.props;

        const classNames = [
            className,
            styles.overview,
        ];

        return classNames.join(' ');
    }

    getDistrictColor = (district) => {
        if (mostAffectedDistricts.indexOf(district) >= 0) {
            return '#f00';
        }

        if (affectedDistricts.indexOf(district) >= 0) {
            return '#f77';
        }

        return '#fff';
    }

    handleMapLoad = () => {
        this.map.options.minZoom = this.map.getZoom();
    }

    handleMapFeature = (feature, layer) => {
        const {
            feature: {
                properties: {
                    DISTRICT: district,
                },
            },
        } = layer;

        layer.setStyle({
            weight: 1,
            color: '#000',
            fillColor: this.getDistrictColor(district),
            fillOpacity: '0.6',
        });

        layer.on('mouseover', this.handleLayerMouseOver);
        layer.on('mouseout', this.handleLayerMouseOut);
        layer.on('click', this.handleLayerClick);
        layer.on('dblclick', this.handleLayerDoubleClick);
    }

    handleLayerMouseOver = (e) => {
        const { target: layer } = e;
        this.setState({ hoverOverLayer: layer });
    }

    handleLayerMouseOut = () => {
        this.setState({ hoverOverLayer: undefined });
    }

    handleLayerClick = (e) => {
        const { target: layer } = e;
        const {
            activeDistrictName,
            activeLayer,
        } = this.state;

        const {
            feature: {
                properties: {
                    DISTRICT: district,
                },
            },
        } = layer;

        if (activeLayer) {
            activeLayer.setStyle({ fillColor: this.getDistrictColor(activeDistrictName) });
        }

        if (district && activeDistrictName !== district) {
            layer.setStyle({ fillColor: '#099' });
            this.setState({
                activeDistrictName: district,
                activeLayer: layer,
            });
        } else {
            this.setState({
                activeDistrictName: undefined,
                activeLayer: undefined,
            });
        }
    }

    handleLayerDoubleClick = (e) => {
        const { target: layer } = e;
        const {
            feature: {
                properties: {
                    DISTRICT: district,
                },
            },
        } = layer;

        const { onLayerDoubleClick } = this.props;
        onLayerDoubleClick(district);
    }

    render() {
        const className = this.getClassName();
        const { geoJson } = this.props;

        const {
            activeDistrictName,
            hoverOverLayer,
            metadata,
            pendingMetadata,
        } = this.state;

        let title;
        let infoLayerSource;

        if (activeDistrictName) {
            title = activeDistrictName;
            infoLayerSource = metadata.districts[activeDistrictName] || {};
        } else {
            title = this.defaultTitle;
            infoLayerSource = metadata;
        }

        const {
            landslidesSurveyed = emptyObject,
            // landslidesRiskRating = emptyObject,
            landslidesRiskScore = emptyObject,
            landPurchased = 0,
            totalHouseholds = 0,
            geohazardAffected = emptyObject,
            landless = emptyObject,
            peopleRelocated = emptyObject,
        } = infoLayerSource;

        const { districts } = metadata;

        return (
            <div className={className}>
                {(pendingMetadata || !geoJson) && (
                    <LoadingAnimation
                        className={styles.loadingAnimation}
                        large
                    />
                )}
                <InfoLayer
                    landslidesSurveyed={landslidesSurveyed}
                    landslidesRiskScore={landslidesRiskScore}
                    landPurchased={landPurchased}
                    totalHouseholds={totalHouseholds}
                    geohazardAffectedHouseholds={geohazardAffected}
                    landlessHouseholds={landless}
                    numberOfPeopleRelocated={peopleRelocated}
                    className={styles.info}
                    title={title}
                />
                <div
                    className={styles.mapContainer}
                    ref={this.mapContainer}
                >
                    {!pendingMetadata && (
                        <MapLayer
                            map={this.map}
                            geoJson={geoJson}
                            options={this.mapLayerOptions}
                            onLoad={this.handleMapLoad}
                            zoomOnLoad
                        />
                    )}
                    <LayerInfo
                        className={styles.layerInfo}
                        layer={hoverOverLayer}
                        layerData={districts}
                        offset={this.mapContainerOffset}
                    />
                    <div className={styles.helpText}>
                        <span className={`${styles.icon} ion-information`} />
                        <div className={styles.message}>
                            Double-click on any district for more information
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

