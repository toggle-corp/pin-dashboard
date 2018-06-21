import React from 'react';
import L from 'leaflet';


export default class MapLayer extends React.PureComponent {
    componentDidMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const {
            map: nextMap,
            geoJson: nextGeoJson,
        } = nextProps;

        const {
            map,
            geoJson,
        } = this.props;

        if (nextMap !== map || nextGeoJson !== geoJson) {
            this.destroy();
            this.load(nextProps);
        }
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy = () => {
        if (this.layer) {
            this.layer.remove();
        }
    }

    load = (props) => {
        const {
            map,
            geoJson,
            zoomOnLoad,
            options,
        } = props;

        if (!map || !geoJson) {
            return;
        }

        this.layer = L.geoJSON(geoJson, options).addTo(map);

        if (zoomOnLoad) {
            map.fitBounds(this.layer.getBounds());
        }
    }

    render() {
        return null;
    }
}
