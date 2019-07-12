export default {
    district: {
        outline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': [
                'case',
                ['==', ['feature-state', 'selected'], true], '#18bc9c',
                ['==', ['feature-state', 'type'], 'most-affected-district'], '#0010A1',
                ['==', ['feature-state', 'type'], 'affected-district'], '#3656F6',
                '#ffffff',
            ],
            'fill-opacity': 0.7,
        },
    },
    palika: {
        outline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': [
                'case',
                ['==', ['feature-state', 'selected'], true], '#18bc9c',
                '#ffffff',
            ],
            'fill-opacity': 0.7,
        },
    },
    ward: {
        outline: {
            'line-color': '#000000',
            'line-width': 1,
        },
        fill: {
            'fill-color': [
                'case',
                ['==', ['feature-state', 'selected'], true], '#18bc9c',
                '#ffffff',
            ],
            'fill-opacity': 0.7,
        },
    },
    cat2Point: {
        circle: {
            'circle-color': 'orange',
            'circle-radius': 8,
            'circle-opacity': 1,
        },
    },
    cat3Point: {
        circle: {
            'circle-color': 'red',
            'circle-radius': 8,
            'circle-opacity': 1,
        },
    },
};
