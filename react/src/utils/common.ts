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
    RelocationSite,
    GeoAttribute,
    RelocationSiteCodes,
    FeatureIdentifiers,
    FeatureFromIdentifier,
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

const getRelocationSiteFeatures = (
    relocationSiteList: RelocationSite[],
    featureIdentifier: FeatureIdentifiers,
) => (
    relocationSiteList
        .filter(r => r.longitude && r.latitude)
        .map(r => ({
            // id: i,
            id: featureIdentifier[r.code],
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    r.longitude,
                    r.latitude,
                ],
            },
        }))
);

const getCatPointFeatures = (
    catPoints: RiskPoint[],
    featureIdentifier: FeatureIdentifiers,
) => (
    catPoints
        .filter(cp => cp.longitude && cp.latitude)
        .map(cp => ({
            id: featureIdentifier[cp.geosite],
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    cp.longitude,
                    cp.latitude,
                ],
            },
        }))
);

export function getPlottableMapLayersFromRiskPoints(
    cat2PointList: RiskPoint[] | undefined = [],
    cat3PointList: RiskPoint[] | undefined = [],
) {
    const catPointList = [
        ...cat2PointList,
        ...cat3PointList,
    ] as RiskPoint[];

    const relocationSiteCodes: RelocationSiteCodes = {};
    const relocationSiteList = catPointList.map(
        d => d.relocationSites,
    )
        .flat()
        .filter(d => !!d.latitude && !!d.longitude)
        .filter((d) => {
            const filter = relocationSiteCodes[d.code];
            relocationSiteCodes[d.code] = true;

            return !filter;
        });

    const featureIdentifier: FeatureIdentifiers = {};

    let count = 1;
    catPointList.forEach((d) => {
        featureIdentifier[d.geosite] = count;
        count += 1;
    });
    relocationSiteList.forEach((d) => {
        featureIdentifier[d.code] = count;
        count += 1;
    });

    // FIXME: use mapToMap later
    const initialValue: FeatureFromIdentifier = {};
    const featureFromIdentifier = Object.keys(featureIdentifier)
        .reduce((acc, key) => {
            const value = featureIdentifier[key];
            acc[value] = key;
            return acc;
        }, initialValue);

    const cat2PointsGeoJson = {
        type: 'FeatureCollection',
        features: getCatPointFeatures(cat2PointList, featureIdentifier),
    };

    const cat3PointsGeoJson = {
        type: 'FeatureCollection',
        features: getCatPointFeatures(cat3PointList, featureIdentifier),
    };

    const integratedSettelementRelocationPointsGeoJson = {
        type: 'FeatureCollection',
        features: getRelocationSiteFeatures(
            relocationSiteList.filter(d => d.siteType === 'Integrated Settelement'),
            featureIdentifier,
        ),
    };

    const privateLandRelocationPointsGeoJson = {
        type: 'FeatureCollection',
        features: getRelocationSiteFeatures(
            relocationSiteList.filter(d => d.siteType === 'Private Land'),
            featureIdentifier,
        ),
    };

    const lineStringIdentifier = {};

    const lineStringsGeoJson = {
        type: 'FeatureCollection',
        features: catPointList.map(
            (catPoint) => {
                const validRelocationSites = catPoint.relocationSites
                    .filter(d => !!d.latitude && !!d.longitude);

                if (validRelocationSites.length === 0) {
                    return null;
                }

                return (
                    validRelocationSites.map((
                        (relocationSite) => {
                            const stringId = `${catPoint.geosite}:${relocationSite.code}`;
                            const id = count;
                            lineStringIdentifier[stringId] = id;
                            count += 1;

                            return {
                                id,
                                type: 'Feature',
                                geometry: {
                                    type: 'LineString',
                                    coordinates: [
                                        [catPoint.longitude, catPoint.latitude],
                                        [relocationSite.longitude, relocationSite.latitude],
                                    ],
                                },
                            };
                        }
                    ))
                );
            },
        ).flat().filter(d => d),
    };

    return {
        featureIdentifier,
        featureFromIdentifier,
        cat2PointsGeoJson,
        cat3PointsGeoJson,
        integratedSettelementRelocationPointsGeoJson,
        privateLandRelocationPointsGeoJson,
        lineStringsGeoJson,
        lineStringIdentifier,
    };
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
                    id: i,
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
