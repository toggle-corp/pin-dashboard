import apiEndPoint from './apiEndPoint';

export const urlForMetadata = `${apiEndPoint}/metadata/`;
export const createUrlForDistrictMetadata = districtName => `${apiEndPoint}/metadata/${districtName}/`;
