export type GeoPoint = [number, number];
export type GeoBounds = [number, number, number, number];

export interface IntegratedSettlementMeta {
    phase1?: number;
    phase2?: number;
    phase3?: number;
    completed?: number;
    total?: number;
}

export interface GeohazardAffected {
    eligible?: number;
    relocated?: number;
    total?: number;
}

export interface LandslidesRiskScore {
    '200-Below'?: number;
    '300-201'?: number;
    '400-301'?: number;
    '500-401'?: number;
    '625-501'?: number;
}

export interface LandslidesSurveyed {
    CAT1?: number;
    CAT2?: number;
    CAT3?: number;
}

export interface LandPurchased {
    landPurchased?: number;
    totalHouseholds?: number;
}

export interface PeopleRelocated {
    male?: number;
    female?: number;
    childrenMale?: number;
    childrenFemale?: number;
    elderlyMale?: number;
    elderlyFemale?: number;
}

export interface RelocationPoint {
    geosite: string;
    location: number[];
    solutionType: string;
}

export interface RelocationSite {
    code: string;
    place?: string;
    latitude?: number;
    longitude?: number;
    siteType?: 'Integrated Settlement' | 'Private Land';
    status?: 'Phase 1 - Primary Plan Approved' | 'Phase 2 - DPR Approved' | 'Phase 3 - Implementation' | 'Completed';
    district?: number;
    palika?: number;
    ward?: number;
    protectionSupport?: string;
    districtName?: string;
    palikaName?: string;
    wardName?: string;
}

export interface RiskPoint {
    geosite: string;
    directRiskFor: string;
    gpName: string; // TODO: should be name
    hhAffected: number;
    highRiskOf: string;
    landslideCat: keyof LandslidesSurveyed;
    landslideCode: string;
    latitude?: number;
    longitude?: number;
    mitigationWorkBy: string;
    mitigationWorkStatus: string;
    place: string;
    potentialImpact: string;
    riskProbability: string;
    riskScore: keyof LandslidesRiskScore;
    eligibleHouseholds: number;
    householdsRelocated: number;
    relocationSites: RelocationSite[];
}

export interface GeoAttribute {
    id: number;
    name: string;
    bbox?: GeoBounds;
    centroid?: GeoPoint;
}

export interface Tranches {
    first?: number;
    second?: number;
    third?: number;
}

export interface LandlessHousehold {
    approved?: number;
    relocated?: number;
    total?: number;
}

export interface Base {
    geoAttribute: GeoAttribute;

    totalHouseholds?: number;
    landPurchased?: number;
    geohazardAffected: GeohazardAffected;
    landslidesRiskScore: LandslidesRiskScore;
    landslidesSurveyed: LandslidesSurveyed;
    peopleRelocated: PeopleRelocated;
    tranches: Tranches;
    integratedSettlements: IntegratedSettlementMeta;
    landlessHouseholds: LandlessHousehold;
}

export interface Metadata extends Base {
    cat2Points?: RiskPoint[];
    cat3Points?: RiskPoint[];
    relocationPoints?: RelocationPoint[];
    regions: Base[];
}

export interface RelocationSiteCodes {
    [key: string]: boolean;
}

export interface FeatureIdentifiers {
    [key: string]: number;
}

export interface LineStringIdentifiers {
    [key: string]: number;
}

export interface FeatureFromIdentifier {
    [key: number]: string;
}

export interface MapStateElement {
    id?: number;
    value?: {
        darken?: boolean;
        show?: boolean;
    };
}
