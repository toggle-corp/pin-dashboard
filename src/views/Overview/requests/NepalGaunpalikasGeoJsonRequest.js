import * as topojson from 'topojson-client';
import Request from '../../../utils/Request.js';

import {
    createParamsForGet,
    urlForNepalGaunpalikasGeoJson,
} from '../../../rest';

export default class NepalGaunpalikasGeoJsonRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingNepalGaunpalikaGeoJson: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingNepalGaunpalikaGeoJson: false });
    }

    handleSuccess = (response) => {
        const geoJson = topojson.feature(
            response.json,
            response.json.objects[response.defaultObject],
        );

        this.parent.setState({
            nepalGaunpalikas: geoJson,
        });
    }

    init = () => {
        this.createDefault({
            url: urlForNepalGaunpalikasGeoJson,
            createParams: createParamsForGet,
        });
    }
}
