export interface GeohazardAffected {
    Eligible?: number;
    Relocated?: number;
    Total?: number;
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

export interface Base {
    totalHouseholds?: number;
    landPurchased?: number;
    geohazardAffected: GeohazardAffected;
    landslidesRiskScore: LandslidesRiskScore;
    landslidesSurveyed: LandslidesSurveyed;
    peopleRelocated: {
        male?: number;
        female?: number;
        childrenMale?: number;
        childrenFemale?: number;
        elderlyMale?: number;
        elderlyFemale?: number;
    };
}

export interface Metadata extends Base {
    districts: {
        [key: string]: Base;
    };
}
