import * as topojson from 'topojson-client';
import Request from '../../../utils/Request.js';

import {
    createParamsForGet,
    urlForMetadata,
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

    init = () => {
        this.createDefault({
            url: urlForMetadata,
            createParams: createParamsForGet,
        });
    }
}
