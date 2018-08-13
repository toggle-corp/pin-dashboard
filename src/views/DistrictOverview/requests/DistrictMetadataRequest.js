import L from 'leaflet';
import Request from '../../../utils/Request.js';

import {
    createParamsForGet,
    createUrlForDistrictMetadata,
} from '../../../rest';

const cat2CircleOptions = {
    radius: 6,
    fillColor: '#FF9801',
    stroke: false,
    fillOpacity: 1,
};

const cat3CircleOptions = {
    radius: 6,
    fillColor: '#F44336',
    stroke: false,
    fillOpacity: 1,
};

export default class MetadataRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingMetadata: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingMetadata: false });
    }

    handleSuccess = (response) => {
        this.parent.setState({
            metadata: response,
        });

        const map = this.parent.getMap();

        response.cat2_points.forEach((p) => {
            const circle = L.circleMarker([p.latitude, p.longitude], cat2CircleOptions);
            circle.on('mouseover', () => { this.parent.handleCat2PointMouseOver(p); });
            circle.on('mouseout', this.parent.handleGeoPointMouseOut);
            circle.addTo(map);
        });

        response.cat3_points.forEach((p) => {
            const circle = L.circleMarker([p.latitude, p.longitude], cat3CircleOptions);
            circle.on('mouseover', () => { this.parent.handleCat3PointMouseOver(p); });
            circle.on('mouseout', this.parent.handleGeoPointMouseOut);
            circle.addTo(map);
        });
    }

    init = (districtName) => {
        const url = createUrlForDistrictMetadata(districtName);
        this.createDefault({
            url,
            createParams: createParamsForGet,
        });
    }
}
