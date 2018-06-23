import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import MapLayer from '../../components/MapLayer';
import InfoLayer from '../../components/InfoLayer';
import styles from './styles.scss';

import LayerInfo from './LayerInfo';
import MetadataRequest from './requests/MetadataRequest';

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

    handleMapFeature = (feature, layer) => {
        layer.setStyle({
            weight: 1,
            color: '#000',
            fillColor: '#fff',
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

    handleLayerMouseOut = (e) => {
        const { target: layer } = e;
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
                    distName,
                },
            },
        } = layer;

        if (activeLayer) {
            activeLayer.setStyle({ fillColor: '#fff' });
        }

        if (distName && activeDistrictName !== distName) {
            layer.setStyle({ fillColor: '#099' });
            this.setState({
                activeDistrictName: distName,
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
                    distName,
                },
            },
        } = layer;

        const { onLayerDoubleClick } = this.props;
        onLayerDoubleClick(distName);
    }

    render() {
        const className = this.getClassName();
        const { geoJson } = this.props;
        const {
            activeDistrictName,
            hoverOverLayer,
            metadata,
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
            landslidesRisk = emptyObject,
            landPurchased,
            geohazardAffected = emptyObject,
            landless = emptyObject,
            peopleRelocated = emptyObject,
        } = infoLayerSource;

        const { districts } = metadata;

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
                    <MapLayer
                        map={this.map}
                        geoJson={geoJson}
                        options={this.mapLayerOptions}
                        zoomOnLoad
                    />
                </div>
                <LayerInfo
                    layer={hoverOverLayer}
                    layerData={districts}
                    offset={this.mapContainerOffset}
                />
            </div>
        );
    }
}