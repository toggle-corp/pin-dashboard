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
};

export default styleProperties;
