import { listToMap } from '@togglecorp/fujs';

export { default as iconNames } from './iconNames';
export { default as styleProperties } from './styleProperties';
export { default as mapSources } from './mapSources';
export { default as mapStyles } from './mapStyles';
export * from './typeDefinitions';

const affectedDistricts: number[] = [
    40,
    50,
    29,
    9,
    35,
    26,
    7,
    22,
    44,
    41,
    46,
    27,
    30,
    12,
    28,
    45,
    31,
    49,
    481,
    482,
    25,
    13,
    39,
    51,
    21,
    23,
    10,
    20,
    24,
    11,
    42,
    43,
];

const mostAffectedDistricts: number[] = [
    29,
    26,
    22,
    44,
    27,
    30,
    28,
    31,
    25,
    13,
    21,
    23,
    20,
    24,
];

// FIXME: get this from server later
export const districtsAffected = [
    ...affectedDistricts.map(key => ({
        id: key,
        value: { type: 'affected-district' },
    })),
    ...mostAffectedDistricts.map(key => ({
        id: key,
        value: { type: 'most-affected-district' },
    })),
];

interface Palika {
    district: number;
    id: number;
    title: string;
    bbox: number[];
}

interface Ward {
    palika: number;
    id: number;
    title: string;
    bbox: number[];
}
