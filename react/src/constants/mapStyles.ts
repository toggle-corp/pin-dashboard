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
            'circle-opacity': [
                'case',
                [
                    'boolean',
                    ['feature-state', 'dim'],
                    false,
                ],
                0.1,
                1,
            ],
        },
    },
    cat3Point: {
        circle: {
            'circle-color': '#e53935',
            'circle-radius': 8,
            'circle-opacity': [
                'case',
                [
                    'boolean',
                    ['feature-state', 'dim'],
                    false,
                ],
                0.1,
                1,
            ],
        },
    },
    relocationPoint: {
        circle: {
            'circle-color': '#1565c0',
            'circle-radius': 9,
            'circle-opacity': [
                'case',
                [
                    'boolean',
                    ['feature-state', 'dim'],
                    false,
                ],
                0.1,
                1,
            ],
        },
        layout: {
            'text-field': '◆',
            'text-allow-overlap': true,
            'text-size': 24,
        },
        paint: {
            'text-color': '#1565c0',
            'text-opacity': [
                'case',
                [
                    'boolean',
                    ['feature-state', 'dim'],
                    false,
                ],
                0.1,
                1,
            ],
            'text-halo-color': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                '#000000',
                'rgba(0, 0, 0, 0)',
            ],
            'text-halo-width': ['case',
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0,
            ],
        },
    },
    lineString: {
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': [
                'case',
                [
                    'boolean',
                    ['feature-state', 'dim'],
                    false,
                ],
                '#f5f5f5',
                '#a0a0a0',
            ],
            'line-width': 1,
            // 'line-dasharray': [2, 3],
        },
    },
};
