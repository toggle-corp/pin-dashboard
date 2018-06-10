import {
    GET,
    DELETE,
    commonHeaderForGet,
    commonHeaderForPost,
} from '../config/rest';

export * from './geoJson';

export const createParamsForGet = () => ({
    method: GET,
    headers: commonHeaderForGet,
});

export const createParamsForDelete = () => ({
    method: DELETE,
    header: commonHeaderForPost,
});

