function getPropertyValue(propertyName: string) {
    return (
        document
            .documentElement
            .style
            .getPropertyValue(propertyName)
    );
}

const styleProperties = {
    fontWeightBold: 700,
    fontWeightMedium: 400,
    fontWeightLight: 300,
    widthDonutChartStroke: 12,
    widthDonutChartStrokeOnHover: 14,
    widthLeftPane: '440px',

    heightApp: '874px',

    widthHoverDetails: '320px',
    zIndexHoverDetails: '11',

    colorDanger: '#e53935',
    colorWarning: '#f9a825',
    colorSuccess: '#43A047',
    colorAccent: '#009688',
    colorPurple: '#5e35b1',
    colorBlue: '#343a6a',

    widthGeohazardAffectedHouseholdsChart: '96px',
    heightGeohazardAffectedHouseholdsChart: '96px',

    heightRelocatedPerson: '64px',

    lineHeightDefault: '1.25',

    durationDonutChartAnimation: '1s',

};

export default styleProperties;
