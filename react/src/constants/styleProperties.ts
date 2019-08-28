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

    heightApp: '759px',

    widthHoverDetails: '320px',
    zIndexHoverDetails: '11',

    colorDanger: '#e53935',
    colorWarning: '#f9a825',
    colorSuccess: '#43A047',
    colorAccent: '#009688',
    colorPurple: '#5e35b1',

    widthGeohazardAffectedHouseholdsChart: '96px',
    heightGeohazardAffectedHouseholdsChart: '96px',

    heightRelocatedPerson: '64px',

    lineHeightDefault: '1.2',
};

export default styleProperties;
