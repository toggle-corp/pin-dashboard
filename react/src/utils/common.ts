import {
    isDefined,
    isObject,
    isList,
    isNotDefined,
    listToMap,
    mapToMap,
    unique,
} from '@togglecorp/fujs';

import {
    Metadata,
    RiskPoint,
    RiskPointWithType,
    RelocationSite,
    GeoAttribute,
    FeatureIdentifiers,
    FeatureFromIdentifier,
    MapStateElement,
} from '#constants';

interface WithLatLong {
    latitude?: number;
    longitude?: number;
}

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

export function hasValidLatLong(obj: WithLatLong) {
    return !!obj.latitude && !!obj.longitude;
}

export function wrapInArray<T>(item?: T) {
    if (isNotDefined(item)) {
        return [];
    }

    return [item];
}

export function concatArray<T>(foo: T[] | undefined = [], bar: T[] | undefined = []): T[] {
    return [
        ...foo,
        ...bar,
    ];
}

// TODO: memoize this
function getSubRegionsMap(metadata: Metadata | undefined) {
    if (!metadata) {
        return {};
    }

    const { regions } = metadata;
    return listToMap(
        regions,
        region => region.geoAttribute.id,
        region => region,
    );
}

export function getSubRegion(metadata: Metadata | undefined, id: number) {
    const subRegionMap = getSubRegionsMap(metadata);
    return subRegionMap[id];
}

export function getInformationDataForSelectedRegion(
    title: string,
    metadata: Metadata | undefined,
    selectedId: number | undefined,
) {
    if (!selectedId) {
        return {
            title,
            metadata,
        };
    }

    const subRegion = getSubRegion(metadata, selectedId);
    if (!subRegion) {
        return {};
    }

    const {
        geoAttribute: {
            name,
        },
    } = subRegion;

    return ({
        title: name,
        metadata: subRegion,
    });
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

function getCatPointFeatures(
    catPoints: RiskPoint[],
    featureIdentifier: FeatureIdentifiers,
) {
    return (
        catPoints
            .filter(hasValidLatLong)
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
}

function getRelocationSiteFeatures(
    relocationSiteList: RelocationSite[],
    featureIdentifier: FeatureIdentifiers,
) {
    return (
        relocationSiteList
            .filter(hasValidLatLong)
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
}

export function getPlottableMapLayersFromRiskPoints(
    cat2PointList: RiskPoint[] | undefined = [],
    cat3PointList: RiskPoint[] | undefined = [],
) {
    const catPointList = concatArray(cat2PointList, cat3PointList);

    // NOTE: Casting RelocationSite as it cannot be undefined here
    const relocationSiteList = unique(
        catPointList.map(d => d.relocationSites)
            .flat()
            .filter(hasValidLatLong),
        item => item.code,
    ) as RelocationSite[];

    const connectionList = catPointList.map(
        (catPoint) => {
            const { relocationSites, ...catPointWithoutSites } = catPoint;
            return relocationSites.map(relocationSite => ({
                uid: `${catPointWithoutSites.geosite}:${relocationSite.code}`,
                relocationSite,
                catPoint: catPointWithoutSites,
            }));
        },
    )
        .flat()
        .filter(connection => (
            hasValidLatLong(connection.catPoint) && hasValidLatLong(connection.relocationSite)
        ));

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
    connectionList.forEach((d) => {
        featureIdentifier[d.uid] = count;
        count += 1;
    });

    const featureFromIdentifier: FeatureFromIdentifier = mapToMap(
        featureIdentifier,
        (_, v) => v,
        (_, k) => String(k),
    );

    const cat2PointsGeoJson = {
        type: 'FeatureCollection',
        features: getCatPointFeatures(cat2PointList, featureIdentifier),
    };

    const cat3PointsGeoJson = {
        type: 'FeatureCollection',
        features: getCatPointFeatures(cat3PointList, featureIdentifier),
    };

    const integratedSettlementRelocationPointsGeoJson = {
        type: 'FeatureCollection',
        features: getRelocationSiteFeatures(
            relocationSiteList.filter(d => d.siteType === 'Integrated Settlement'),
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

    const lineStringsGeoJson = {
        type: 'FeatureCollection',
        features: connectionList.map(connection => ({
            id: featureIdentifier[connection.uid],
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [
                    [connection.catPoint.longitude, connection.catPoint.latitude],
                    [connection.relocationSite.longitude, connection.relocationSite.latitude],
                ],
            },
        })),
    };

    return {
        featureIdentifier,
        featureFromIdentifier,

        cat2PointsGeoJson,
        cat3PointsGeoJson,

        integratedSettlementRelocationPointsGeoJson,
        privateLandRelocationPointsGeoJson,

        lineStringsGeoJson,

        relocationSiteList,
    };
}

export function getNewMapStateOnRiskPointHoverChange(
    catPointList: RiskPointWithType[] = [],
    id: number | undefined,
    featureIdentifier: FeatureIdentifiers,
    featureFromIdentifier: FeatureFromIdentifier,
) {
    if (id === undefined) {
        return {
            mapState: [],
            catPoints: [],
            relocationSites: [],
        };
    }

    let catPoints: RiskPointWithType[] = [];
    let relocationSites: RelocationSite[] = [];

    let newMapState: MapStateElement[] = [
        {
            id,
            value: { darken: true },
        },
    ];

    const catPoint = catPointList.find(point => point.geosite === featureFromIdentifier[id]);
    if (catPoint) {
        catPoints = [catPoint];

        const sanitizedRelocationSites = catPoint
            .relocationSites
            .filter(hasValidLatLong);

        newMapState = newMapState.concat(
            newMapState,
            sanitizedRelocationSites
                .map(site => ({
                    id: featureIdentifier[site.code],
                    value: { darken: true },
                })),
        );

        newMapState = newMapState.concat(
            newMapState,
            sanitizedRelocationSites
                .map(site => ({
                    id: featureIdentifier[`${catPoint.geosite}:${site.code}`],
                    value: { darken: true },
                })),
        );

        relocationSites = relocationSites.concat(sanitizedRelocationSites);
    }

    return {
        mapState: newMapState,
        catPoints,
        // NOTE: Casting RelocationSite as it cannot be undefined here
        relocationSites: unique(
            relocationSites,
            site => site.code,
        ) as RelocationSite[],
    };
}


export function getNewMapStateOnRelocationHoverChange(
    catPointList: RiskPointWithType[] = [],
    id: number | undefined,
    featureIdentifier: FeatureIdentifiers,
    featureFromIdentifier: FeatureFromIdentifier,
) {
    if (id === undefined) {
        return {
            mapState: [],
            catPoints: [],
            relocationSites: [],
        };
    }

    let newMapState: MapStateElement[] = [
        {
            id,
            value: { darken: true },
        },
    ];

    const catPoints = catPointList
        .filter(point => (
            point.relocationSites.findIndex(
                site => site.code === featureFromIdentifier[id],
            ) !== -1
        ))
        .filter(hasValidLatLong);

    const relocationSite = catPointList
        .map(catPoint => catPoint.relocationSites)
        .flat()
        .find(site => site.code === featureFromIdentifier[id]);

    const relocationSites: RelocationSite[] = relocationSite ? [relocationSite] : [];

    newMapState = newMapState.concat(
        newMapState,
        catPoints.map(point => ({
            id: featureIdentifier[point.geosite],
            value: { darken: true },
        })),
    );

    newMapState = newMapState.concat(
        newMapState,
        catPoints.map(point => ({
            id: featureIdentifier[`${point.geosite}:${featureFromIdentifier[id]}`],
            value: { darken: true },
        })),
    );

    return {
        mapState: newMapState,
        catPoints,
        relocationSites,
    };
}
