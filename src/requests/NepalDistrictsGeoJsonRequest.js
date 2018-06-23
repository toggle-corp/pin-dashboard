import * as topojson from 'topojson-client';
import Request from '../utils/Request.js';

import {
    createParamsForGet,
    urlForNepalDistrictsGeoJson,
} from '../rest';

export default class NepalDistrictsGeoJsonRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingDistricts: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingDistricts: false });
    }

    handleSuccess = (response) => {
        const geoJson = topojson.feature(
            response.json,
            response.json.objects[response.defaultObject],
        );

        this.parent.setState({
            districtsGeoJson: geoJson,
        });
    }

    init = () => {
        this.createDefault({
            url: urlForNepalDistrictsGeoJson,
            createParams: createParamsForGet,
        });
    }
}
