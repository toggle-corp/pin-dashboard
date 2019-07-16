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
    districtLabel: {
        paint: {
            'text-color': 'rgba(0, 0, 0, 0.4)',
            'text-halo-color': 'rgba(255, 255, 255, 0.5)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Raleway Black'],
            'text-field': ['get', 'title'],
            'text-size': 12,
            'text-justify': 'center',
            'text-anchor': 'center',
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
    palikaLabel: {
        paint: {
            'text-color': 'rgba(0, 0, 0, 0.4)',
            'text-halo-color': 'rgba(255, 255, 255, 0.5)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Raleway Black'],
            'text-field': ['get', 'title'],
            'text-size': 13,
            'text-justify': 'center',
            'text-anchor': 'center',
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
    wardLabel: {
        paint: {
            'text-color': 'rgba(0, 0, 0, 0.4)',
            'text-halo-color': 'rgba(255, 255, 255, 0.5)',
            'text-halo-width': 2,
        },
        layout: {
            visibility: 'visible',
            'text-font': ['Raleway Black'],
            'text-field': ['get', 'title'],
            'text-size': 17,
            'text-justify': 'center',
            'text-anchor': 'center',
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
