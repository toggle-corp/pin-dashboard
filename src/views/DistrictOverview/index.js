import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import LoadingAnimation from '../../vendor/react-store/components/View/LoadingAnimation';

import AccentButton from '../../vendor/react-store/components/Action/Button/AccentButton';

import MapLayer from '../../components/MapLayer';
import InfoLayer from '../../components/InfoLayer';

import LayerInfo from './LayerInfo';
import GeoPointInfo from './GeoPointInfo';
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
            pendingMetadata: false,
        };

        const setState = d => this.setState(d);
        this.districtMetadataRequest = new DistrictMetadataRequest({
            setState,
            getMap: () => this.map,
            handleGeoPointMouseOut: this.handleGeoPointMouseOut,
            handleCat2PointMouseOver: this.handleCat2PointMouseOver,
            handleCat3PointMouseOver: this.handleCat3PointMouseOver,
        });

        this.mapContainer = React.createRef();

        this.mapLayerOptions = {
            onEachFeature: this.handleMapFeature,
        };

        this.currentDistrictLayers = [];
        this.circles = [];
    }

    componentWillMount() {
        const { districtName } = this.props;
        this.districtMetadataRequest.init(districtName);
        this.districtMetadataRequest.start();
    }

    componentDidMount() {
        const { current: mapContainer } = this.mapContainer;

        this.map = L.map(mapContainer, {
            zoomControl: true,
        }).setView([51.505, -0.09], 13);

        this.mapContainerOffset = mapContainer.getBoundingClientRect();
    }

    componentWillUnmount() {
        this.districtMetadataRequest.stop();
        clearTimeout(this.zoomTimeout);
    }

    handleMapLoad = () => {
        const featureGroup = L.featureGroup(this.currentDistrictLayers);
        const bounds = featureGroup.getBounds();
        this.map.fitBounds(bounds);

        this.zoomTimeout = setTimeout(() => {
            this.map.options.minZoom = this.map.getZoom();
        }, 300);
    }

    handleMapFeature = (feature, layer) => {
        const {
            properties: {
                FIRST_DIST: districtName,
            },
        } = feature;

        const { districtName: districtNameFromProps } = this.props;

        if (districtName.toLowerCase() === districtNameFromProps.toLowerCase()) {
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

        this.setState({ hoverOverLayer: layer });
    }

    handleLayerMouseOut = () => {
        this.setState({ hoverOverLayer: undefined });
    }

    handleCat2PointMouseOver = (p) => {
        this.setState({
            activeGeoPoint: p,
            activeGeoPointCat: 'cat2',
        });
    }

    handleCat3PointMouseOver = (p) => {
        this.setState({
            activeGeoPoint: p,
            activeGeoPointCat: 'cat3',
        });
    }

    handleGeoPointMouseOut = () => {
        this.setState({
            activeGeoPoint: undefined,
            activeGeoPointCat: undefined,
        });
    }

    handleLayerClick = (e) => {
        const { target: layer } = e;
        const {
            activeGaunpalikaName,
            activeLayer,
            metadata,
        } = this.state;

        const {
            feature: {
                properties: {
                    FIRST_GaPa: gaunpalikaName,
                },
            },
        } = layer;

        if (activeLayer) {
            activeLayer.setStyle({ fillColor: '#fff' });
        }

        if (gaunpalikaName && activeGaunpalikaName !== gaunpalikaName) {
            layer.setStyle({ fillColor: '#ccc' });
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
            pendingMetadata,
            activeGeoPoint,
            activeGeoPointCat,
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
            // landslidesRiskRating = emptyObject,
            landslidesRiskScore = emptyObject,
            landPurchased = 0,
            totalHouseholds = 0,
            geohazardAffected = emptyObject,
            landless = emptyObject,
            peopleRelocated = emptyObject,
        } = infoLayerSource;

        // console.warn(infoLayerSource);

        return (
            <div className={className}>
                {pendingMetadata && (
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
                    <AccentButton
                        className={styles.backButton}
                        onClick={this.handleBackButtonClick}
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
                    <GeoPointInfo
                        className={styles.geoPointInfo}
                        geoPoint={activeGeoPoint}
                        cat={activeGeoPointCat}
                    />
                </div>
            </div>
        );
    }
}

