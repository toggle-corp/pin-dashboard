import Request from '../../../utils/Request.js';

import {
    createParamsForGet,
    createUrlForDistrictMetadata,
} from '../../../rest';

export default class MetadataRequest extends Request {
    handlePreLoad = () => {
        this.parent.setState({ pendingMetadata: true });
    }

    handlePostLoad = () => {
        this.parent.setState({ pendingMetadata: false });
    }

    handleSuccess = (response) => {
        this.parent.setState({ metadata: response });
    }

    init = (districtName) => {
        const url = createUrlForDistrictMetadata(districtName);
        this.createDefault({
            url,
            createParams: createParamsForGet,
        });
    }
}
