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
        this.parent.setState({ nepalDistricts: response });
    }

    init = () => {
        this.createDefault({
            url: urlForNepalDistrictsGeoJson,
            createParams: createParamsForGet,
        });
    }
}
