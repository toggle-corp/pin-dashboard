const labelSize = 14;
const labelFont = ['Open Sans Regular'];
const labelColor = '#222';
const labelHaloColor = '#fff';
const labelHaloWidth = 1;
const labelHaloBlur = 2;

const district = {
    outline: {
        'line-color': '#000000',
        'line-width': 1,
    },
    fill: {
        'fill-color': [
            'case',
            ['==', ['feature-state', 'selected'], true], '#b2dfdb',
            ['==', ['feature-state', 'type'], 'most-affected-district'], '#0010A1',
            ['==', ['feature-state', 'type'], 'affected-district'], '#3656F6',
            '#ffffff',
        ],
        'fill-opacity': 0.5,
    },
    label: {
        paint: {
            'text-color': labelColor,
            'text-halo-color': labelHaloColor,
            'text-halo-width': labelHaloWidth,
            'text-halo-blur': labelHaloBlur,
        },
        layout: {
            'text-font': labelFont,
            'text-size': labelSize,
            'text-field': ['get', 'title'],
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
};

const palika = {
    outline: {
        'line-color': '#000000',
        'line-width': 1,
    },
    fill: {
        'fill-color': [
            'case',
            ['==', ['feature-state', 'selected'], true], '#b2dfdb',
            '#ffffff',
        ],
        'fill-opacity': 0.7,
    },
    label: {
        paint: {
            'text-color': labelColor,
            'text-halo-color': labelHaloColor,
            'text-halo-width': labelHaloWidth,
            'text-halo-blur': labelHaloBlur,
        },
        layout: {
            'text-font': labelFont,
            'text-size': labelSize,
            'text-field': ['get', 'title'],
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
};

const ward = {
    outline: {
        'line-color': '#000000',
        'line-width': 1,
    },
    fill: {
        'fill-color': [
            'case',
            ['==', ['feature-state', 'selected'], true], '#b2dfdb',
            '#ffffff',
        ],
        'fill-opacity': 0.5,
    },
    label: {
        paint: {
            'text-color': labelColor,
            'text-halo-color': labelHaloColor,
            'text-halo-width': labelHaloWidth,
            'text-halo-blur': labelHaloBlur,
        },
        layout: {
            'text-font': labelFont,
            'text-size': labelSize,
            'text-field': ['get', 'title'],
            'text-justify': 'center',
            'text-anchor': 'center',
        },
    },
};

const cat2Point = {
    circle: {
        'circle-color': '#f9a825',
        'circle-radius': 7,
        'circle-opacity': 1,
    },
};

const cat2PointInverted = {
    circle: {
        ...cat2Point.circle,
        'circle-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            1,
            0.1,
        ],
        'circle-stroke-width': [
            'case',
            [
                'boolean',
                ['feature-state', 'outline'],
                false,
            ],
            3,
            0,
        ],
        'circle-stroke-color': '#000000',
    },
};

const cat3Point = {
    circle: {
        'circle-color': '#e53935',
        'circle-radius': 7,
        'circle-opacity': 1,
    },
};

const cat3PointInverted = {
    circle: {
        ...cat3Point.circle,
        'circle-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            1,
            0.1,
        ],
        'circle-stroke-width': [
            'case',
            [
                'boolean',
                ['feature-state', 'outline'],
                false,
            ],
            3,
            0,
        ],
        'circle-stroke-color': '#000000',
    },
};

const relocationPLPoint = {
    circle: {
        'circle-color': '#1565c0',
        'circle-radius': 7,
        'circle-opacity': 1,
    },
};

const relocationPLPointInverted = {
    circle: {
        ...relocationPLPoint.circle,
        'circle-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            1,
            0.1,
        ],
        'circle-stroke-width': [
            'case',
            [
                'boolean',
                ['feature-state', 'outline'],
                false,
            ],
            3,
            0,
        ],
        'circle-stroke-color': '#000000',
    },
};

const relocationISPoint = {
    text: {
        'text-color': '#1565c0',
        'text-opacity': 1,
    },
    layout: {
        'text-field': '◆',
        'text-allow-overlap': true,
        'text-size': 30,
    },
};

const relocationISPointInverted = {
    text: {
        ...relocationISPoint.text,
        'text-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            1,
            0.1,
        ],
        'text-halo-width': [
            'case',
            [
                'boolean',
                ['feature-state', 'outline'],
                false,
            ],
            3,
            0,
        ],
        'text-halo-color': '#000000',
    },
    layout: relocationISPoint.layout,
};

const connectionLine = {
    layout: {
        'line-join': 'round',
        'line-cap': 'round',
    },
    line: {
        'line-color': '#333333',
        'line-opacity': 0.4,
        'line-width': 1,
    },
};

const connectionLineInverted = {
    layout: connectionLine.layout,
    line: {
        ...connectionLine.line,
        'line-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            0.4,
            0.05,
        ],
    },
};

const arrow = {
    text: {
        'icon-color': '#333333',
        'icon-opacity': 0,
    },
    layout: {
        'icon-allow-overlap': true,
        'icon-image': 'mountain-11',
        'icon-size': 0.7,
        'icon-rotate': 90,

        'symbol-placement': 'line-center',
    },
};

const arrowInverted = {
    ...arrow,
    text: {
        'icon-color': '#333333',
        'icon-opacity': [
            'case',
            [
                'boolean',
                ['feature-state', 'darken'],
                false,
            ],
            1,
            0,
        ],
    },
};

export default {
    district,
    palika,
    ward,
    cat2Point,
    cat3Point,
    relocationISPoint,
    relocationPLPoint,
    connectionLine,

    cat2PointInverted,
    cat3PointInverted,
    relocationISPointInverted,
    relocationPLPointInverted,
    connectionLineInverted,
    arrow,
    arrowInverted,
};
