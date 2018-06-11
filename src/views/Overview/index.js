import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

import MapLayer from '../../components/MapLayer';
import InfoLayer from '../../components/InfoLayer';
import styles from './styles.scss';

import NepalDistrictsGeoJsonRequest from './requests/NepalDistrictsGeoJsonRequest';

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

const emptyList = [];
const emptyObject = {};

export default class Overview extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    constructor(props) {
        super(props);

        this.defaultInfo = {
            title: 'Nepal',
        };
        this.state = {
            info: this.defaultInfo,
            nepalDistricts: undefined,
            number: 100,
        };

        setTimeout(() => {
            this.setState({ number: 1000 });
        }, 1000);

        this.nepalDistrictRequest = new NepalDistrictsGeoJsonRequest({
            setState: d => this.setState(d),
        });

        this.mapContainer = React.createRef();
    }

    componentWillMount() {
        this.nepalDistrictRequest.init();
        this.nepalDistrictRequest.start();
    }

    componentDidMount() {
        this.map = L.map(this.mapContainer.current, {
            zoomControl: false,
        }).setView([51.505, -0.09], 13);

        this.map.dragging.disable();
        this.map.touchZoom.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.boxZoom.disable();
        this.map.keyboard.disable();
    }

    getClassName = () => {
        const { className } = this.props;

        const classNames = [
            className,
            styles.overview,
        ];

        return classNames.join(' ');
    }

    setInfo = (info) => {
        this.setState({ info });
    }

    handleMapFeature = (feature, layer) => {
        layer.setStyle({
            weight: 1,
            color: '#000',
            fillColor: '#fff',
            fillOpacity: '0.55',
        });

        layer.on('mouseover', () => {
            layer.setStyle({
                fillColor: '#a0a0a0',
            });
            this.setInfo({
                title: feature.properties.DISTRICT,
            });
        });

        layer.on('mouseout', () => {
            layer.setStyle({
                fillColor: '#fff',
            });
            this.setInfo(this.defaultInfo);
        });
    }


    render() {
        const className = this.getClassName();
        const {
            info,
            nepalDistricts,
            number,
        } = this.state;

        const mapLayerOptions = {
            onEachFeature: this.handleMapFeature,
        };

        const data = {
            landslidesSurveyed: {
                cat1: 261,
                cat2: 451,
                cat3: 366,
            },
            landslidesRisk: emptyObject,
            landPurchased: emptyObject,
            geohazardAffectedHouseholds: emptyObject,
            landlessHouseholds: emptyObject,
            numberOfPeopleRelocated: {
                male: 679,
                female: 720,
                maleChild: 554,
                femaleChild: 420,
                maleOld: 599,
                femaleOld: 523,
            },
        };

        return (
            <div className={className}>
                <InfoLayer
                    landslidesSurveyed={data.landslidesSurveyed}
                    landslidesRisk={data.landslidesRisk}
                    landPurchased={data.landPurchased}
                    geohazardAffectedHouseholds={data.geohazardAffectedHouseholds}
                    landlessHouseholds={data.landlessHouseholds}
                    numberOfPeopleRelocated={data.numberOfPeopleRelocated}
                    className={styles.info}
                    info={info}
                />
                <div
                    className={styles.mapContainer}
                    ref={this.mapContainer}
                >
                    <MapLayer
                        map={this.map}
                        geoJson={nepalDistricts}
                        options={mapLayerOptions}
                        zoomOnLoad
                    />
                </div>
            </div>
        );
    }
}
