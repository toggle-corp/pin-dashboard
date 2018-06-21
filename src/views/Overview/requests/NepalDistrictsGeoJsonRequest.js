import * as topojson from 'topojson-client';
import Request from '../../../utils/Request.js';

import {
    createParamsForGet,
    urlForNepalDistrictsGeoJson,
} from '../../../rest';

export default class NepalDistrictsGeoJsonRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingNepalDistrictGeoJson: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingNepalDistrictGeoJson: false });
    }

    handleSuccess = (response) => {
        const geoJson = topojson.feature(
            response.json,
            response.json.objects[response.defaultObject],
        );

        this.parent.setState({
            nepalDistricts: geoJson,
        });
    }

    init = () => {
        this.createDefault({
            url: urlForNepalDistrictsGeoJson,
            createParams: createParamsForGet,
        });
    }
}
