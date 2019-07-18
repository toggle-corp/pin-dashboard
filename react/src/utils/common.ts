import {
    isDefined,
    isObject,
    isList,
    isNotDefined,
    listToMap,
} from '@togglecorp/fujs';

import {
    RiskPoint,
    RelocationPoint,
    GeoAttribute,
} from '#constants';

export const forEach = (obj: object, func: (key: string, val: unknown) => void) => {
    Object.keys(obj).forEach((key) => {
        const val = (obj as any)[key];
        func(key, val);
    });
};

export const sanitizeResponse = (data: unknown): any => {
    if (data === null || data === undefined) {
        return undefined;
    }
    if (isList(data)) {
        return data.map(sanitizeResponse).filter(isDefined);
    }
    if (isObject(data)) {
        let newData = {};
        forEach(data, (k, val) => {
            const newEntry = sanitizeResponse(val);
            if (newEntry) {
                newData = {
                    ...newData,
                    [k]: newEntry,
                };
            }
        });
        return newData;
    }
    return data;
};

export function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }

    return [item];
}

export function convertRiskPointToGeoJson(catPoints: RiskPoint[] | undefined = []) {
    const geojson = {
        type: 'FeatureCollection',
        features: catPoints
            .map((catPoint, i) => ({
                id: i,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        catPoint.longitude,
                        catPoint.latitude,
                    ],
                },
                properties: {
                    ...catPoint,
                },
            })),
    };
    return geojson;
}

export function convertRelocationPointToGeoJson(
    relocationPointList: RelocationPoint[] | undefined = [],
) {
    const plaRelocationPointList = relocationPointList.filter(
        d => d.solutionType === 'Private Land Acquisition',
    );

    const isRelocationPointList = relocationPointList.filter(
        d => d.solutionType === 'Integrated Settlement',
    );

    const plaGeoJson = {
        type: 'FeatureCollection',
        features: plaRelocationPointList
            .map((relocationPoint, i) => ({
                id: i,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: relocationPoint.location,
                },
                properties: {
                    ...relocationPoint,
                },
            })),
    };

    const isGeoJson = {
        type: 'FeatureCollection',
        features: isRelocationPointList
            .map((relocationPoint, i) => ({
                id: i,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: relocationPoint.location,
                },
                properties: {
                    ...relocationPoint,
                },
            })),
    };

    return {
        pla: plaGeoJson,
        is: isGeoJson,
    };
}

export function getGeoJsonFromGeoAttributeList(
    geoAttributeList: GeoAttribute[],
) {
    const geojson = {
        type: 'FeatureCollection',
        features: geoAttributeList
            .map(level => ({
                id: level.id,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        ...(level.centroid || []),
                    ],
                },
                properties: {
                    adminLevelId: level.id,
                    title: level.name,
                },
            })),
    };

    return geojson;
}

export function getLineStringGeoJson(
    cat2PointList: RiskPoint[] = [],
    cat3PointList: RiskPoint[] = [],
    relocationPointList: RelocationPoint[] = [],
) {
    const cat2Points = listToMap(
        cat2PointList,
        d => d.geosite,
        d => ([d.longitude, d.latitude]),
    );

    const cat3Points = listToMap(
        cat3PointList,
        d => d.geosite,
        d => ([d.longitude, d.latitude]),
    );

    const filteredRelocationPointList = relocationPointList
        .filter(d => cat2Points[d.geosite] || cat3Points[d.geosite])
        .filter(d => (
            d.solutionType === 'Private Land Acquisition'
            || d.solutionType === 'Integrated Settlement'
        ));

    const geojson = {
        type: 'FeatureCollection',
        features: filteredRelocationPointList
            .map((relocationPoint, i) => {
                const coordinates = [];

                coordinates.push([...relocationPoint.location || []]);
                if (cat2Points[relocationPoint.geosite]) {
                    coordinates.push([...(cat2Points[relocationPoint.geosite]) || []]);
                }
                if (cat3Points[relocationPoint.geosite]) {
                    coordinates.push([...(cat3Points[relocationPoint.geosite]) || []]);
                }

                return {
                    id: i,
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates,
                    },
                    properties: {
                        geosite: relocationPoint.geosite,
                    },
                };
            }),
    };

    return geojson;
}
