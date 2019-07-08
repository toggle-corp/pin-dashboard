export default {
    district: {
        outline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': [
                'case',
                ['==', ['feature-state', 'type'], 'most-affected-district'], '#0010A1',
                ['==', ['feature-state', 'type'], 'affected-district'], '#3656F6',
                '#ffffff',
            ],
            'fill-opacity': 0.7,
        },
    },
};
