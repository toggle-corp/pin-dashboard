import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import AccentButton from '../../vendor/react-store/components/Action/Button/AccentButton';

import MapLayer from '../../components/MapLayer';
import InfoLayer from '../../components/InfoLayer';

import LayerInfo from './LayerInfo';
import DistrictMetadataRequest from './requests/DistrictMetadataRequest.js';
// import LayerInfo from './LayerInfo';

import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const emptyObject = {};

export default class DistrictOverview extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.state = {
            metadata: {},
        };

        const setState = d => this.setState(d);
        this.districtMetadataRequest = new DistrictMetadataRequest({ setState });

        this.mapContainer = React.createRef();

        this.mapLayerOptions = {
            onEachFeature: this.handleMapFeature,
        };

        this.currentDistrictLayers = [];
    }

    componentWillMount() {
        const { districtName } = this.props;
        this.districtMetadataRequest.init(districtName);
        this.districtMetadataRequest.start();
    }

    componentDidMount() {
        const { current: mapContainer } = this.mapContainer;

        this.map = L.map(mapContainer, {
            zoomControl: false,
        }).setView([51.505, -0.09], 13);

        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();

        this.mapContainerOffset = mapContainer.getBoundingClientRect();
    }

    componentWillUnmount() {
        this.districtMetadataRequest.stop();
    }

    handleMapLoad = () => {
        const featureGroup = L.featureGroup(this.currentDistrictLayers);
        const bounds = featureGroup.getBounds();
        this.map.fitBounds(bounds);
    }

    handleMapFeature = (feature, layer) => {
        const {
            properties: {
                DISTRICT: districtName,
            },
        } = feature;

        const { districtName: districtNameFromProps } = this.props;

        if (districtName.toLowerCase() === districtNameFromProps) {
            layer.setStyle({
                weight: 1,
                color: '#000',
                fillColor: '#fff',
                fillOpacity: '0.9',
            });

            this.currentDistrictLayers.push(layer);
            layer.on('mouseover', this.handleLayerMouseOver);
            layer.on('mouseout', this.handleLayerMouseOut);
            layer.on('click', this.handleLayerClick);
        } else {
            layer.setStyle({
                weight: 0.1,
                color: '#000',
                fillColor: '#fff',
                fillOpacity: '0.3',
            });
        }
    }

    handleLayerMouseOver = (e) => {
        const { target: layer } = e;

        // layer.setStyle({ fillColor: '#aaa' });
        this.setState({ hoverOverLayer: layer });
    }

    handleLayerMouseOut = () => {
        this.setState({ hoverOverLayer: undefined });
    }

    handleLayerClick = (e) => {
        const { target: layer } = e;
        const {
            activeGaunpalikaName,
            activeLayer,
        } = this.state;

        const {
            feature: {
                properties: {
                    NAME: gaunpalikaName,
                },
            },
        } = layer;

        if (activeLayer) {
            activeLayer.setStyle({ fillColor: '#fff' });
        }

        if (gaunpalikaName && activeGaunpalikaName !== gaunpalikaName) {
            layer.setStyle({ fillColor: '#099' });
            this.setState({
                activeGaunpalikaName: gaunpalikaName,
                activeLayer: layer,
            });
        } else {
            this.setState({
                activeGaunpalikaName: undefined,
                activeLayer: undefined,
            });
        }
    }

    handleBackButtonClick = () => {
        const { onBackButtonClick } = this.props;
        onBackButtonClick();
    }

    render() {
        const {
            geoJson,
            className: classNameFromProps,
            districtName,
        } = this.props;

        const className = `
            ${classNameFromProps}
            ${styles.districtOverview}
        `;

        const {
            metadata,
            activeGaunpalikaName,
            hoverOverLayer,
        } = this.state;

        let infoLayerSource;
        let title;

        const { gaupalikas: gaunpalikas = {} } = metadata;
        if (activeGaunpalikaName) {
            title = activeGaunpalikaName;
            infoLayerSource = gaunpalikas[activeGaunpalikaName] || {};
        } else {
            title = districtName;
            infoLayerSource = metadata;
        }

        const {
            landslidesSurveyed = emptyObject,
            landslidesRisk = emptyObject,
            landPurchased,
            geohazardAffected = emptyObject,
            landless = emptyObject,
            peopleRelocated = emptyObject,
        } = infoLayerSource;

        return (
            <div className={className}>
                <InfoLayer
                    landslidesSurveyed={landslidesSurveyed}
                    landslidesRisk={landslidesRisk}
                    landPurchased={landPurchased}
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
                    <AccentButton
                        className={styles.backButton}
                        onClick={this.handleBackButtonClick}
                        transparent
                    >
                        Go back
                    </AccentButton>
                    <MapLayer
                        map={this.map}
                        geoJson={geoJson}
                        options={this.mapLayerOptions}
                        onLoad={this.handleMapLoad}
                        zoomOnLoad

                    />
                    <LayerInfo
                        className={styles.layerInfo}
                        layer={hoverOverLayer}
                        layerData={gaunpalikas}
                        offset={this.mapContainerOffset}
                    />
                </div>
            </div>
        );
    }
}

