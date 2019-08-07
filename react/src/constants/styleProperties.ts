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
    widthLeftPane: '420px',

    // TODO: reaccess following value
    heightApp: getPropertyValue('--height-app'),

    widthHoverDetails: '320px',
    zIndexHoverDetails: '11',

    colorDanger: '#e53935',
    colorWarning: '#f9a825',
    colorSuccess: '#43A047',
    colorAccent: '#009688',

    widthGeohazardAffectedHouseholdsChart: '96px',
    heightGeohazardAffectedHouseholdsChart: '96px',

    heightRelocatedPerson: '64px',
};

export default styleProperties;
