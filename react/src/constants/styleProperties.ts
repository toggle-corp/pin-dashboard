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
    widthDonutChartStroke: 14,
    widthDonutChartStrokeOnHover: 16,
    widthLeftPane: '420px',

    // TODO: reaccess following value
    heightApp: getPropertyValue('--height-app'),

    widthHoverDetails: '320px',
    zIndexHoverDetails: '11',

    colorDanger: '#e53935',
    colorWarning: '#fb8c00',
    colorSuccess: '#43A047',
};

export default styleProperties;
