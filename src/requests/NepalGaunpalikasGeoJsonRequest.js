import * as topojson from 'topojson-client';
import Request from '../utils/Request.js';

import {
    createParamsForGet,
    urlForNepalGaunpalikasGeoJson,
} from '../rest';

export default class NepalGaunpalikasGeoJsonRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingGaunpalikas: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingGaunpalikas: false });
    }

    handleSuccess = (response) => {
        const geoJson = topojson.feature(
            response.json,
            response.json.objects[response.defaultObject],
        );

        this.parent.setState({
            gaunpalikasGeoJson: geoJson,
        });
    }

    init = () => {
        this.createDefault({
            url: urlForNepalGaunpalikasGeoJson,
            createParams: createParamsForGet,
        });
    }
}