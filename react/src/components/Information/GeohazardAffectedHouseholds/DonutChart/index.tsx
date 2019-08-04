import React from 'react';
import { _cs } from '@togglecorp/fujs';
import memoize from 'memoize-one';

import List from '#rscv/List';
import connectWithStyles from '#rsu/styles/connectWithStyles';
import Responsive from '#rscg/Responsive';

import Arc from './Arc';
import styles from './styles.scss';

interface SelectorFunction<T, V = string> {
    (value: T): V;
}

interface Props<T> {
    className?: string;
    data?: T[];
    boundingClientRect: {
        width?: number;
        height?: number;
    };
    keySelector: SelectorFunction<T, string | number>;
    valueSelector: SelectorFunction<T, number>;
    labelSelector: SelectorFunction<T, string | number>;
    colorSelector: SelectorFunction<T, string>;
    currentStyles: object;
}

interface RenderDatum {
    key: string | number;
    value: number;
    label: string | number;
    color: string;
    startAngle: number;
    endAngle: number;
}

const arcRenderKeySelector = (datum: RenderDatum) => (
    datum.key
);

class DonutChart<T> extends React.PureComponent<Props<T>> {
    private getRenderData = memoize((
        data: T[] = [],
        keySelector: Props<T>['keySelector'],
        valueSelector: Props<T>['valueSelector'],
        labelSelector: Props<T>['labelSelector'],
        colorSelector: Props<T>['colorSelector'],
    ): RenderDatum[] => {
        const structuredData = data.map(datum => ({
            key: keySelector(datum),
            label: labelSelector(datum),
            value: valueSelector(datum),
            color: colorSelector(datum),
        }));

        const totalValue = structuredData.reduce((acc, d) => (
            acc + d.value
        ), 0);

        if (totalValue <= 0) {
            return [
                {
                    key: 'none',
                    label: 'N/A',
                    value: 0,
                    startAngle: 0,
                    endAngle: 359.99,
                    color: 'gray',
                },
            ];
        }

        let prevStartAngle = 0;
        const renderData = structuredData.map((datum) => {
            const startAngle = prevStartAngle;
            const endAngle = Math.min(startAngle + (360 * (datum.value / totalValue)), 359.99);

            prevStartAngle = endAngle;

            return {
                ...datum,
                startAngle,
                endAngle,
            };
        });

        return renderData;
    })

    private getArcPosition = memoize((width, height, currentStyles) => {
        const x = width / 2;
        const y = height / 2;

        const radius = Math.min(width, height) / 2 - currentStyles.widthDonutChartStrokeOnHover;

        return {
            x,
            y,
            radius,
        };
    })

    private getArcRendererParams = (_: string, datum: RenderDatum) => {
        const {
            boundingClientRect: {
                width = 0,
                height = 0,
            },
            currentStyles,
        } = this.props;

        const {
            startAngle,
            endAngle,
            label,
            color,
        } = datum;

        return {
            startAngle,
            endAngle,
            label,
            color,
            ...this.getArcPosition(width, height, currentStyles),
        };
    }

    public render() {
        const {
            className,
            boundingClientRect: {
                width = 0,
                height = 0,
            },
            data,
            labelSelector,
            keySelector,
            valueSelector,
            colorSelector,
        } = this.props;

        if (width === 0 || height === 0) {
            return null;
        }

        const renderData = this.getRenderData(
            data,
            keySelector,
            valueSelector,
            labelSelector,
            colorSelector,
        );

        return (
            <svg
                className={_cs(styles.svg, className)}
                style={{
                    width,
                    height,
                }}
            >
                <List
                    data={renderData}
                    renderer={Arc}

                    rendererParams={this.getArcRendererParams}
                    keySelector={arcRenderKeySelector}
                />
            </svg>
        );
    }
}

export default connectWithStyles(Responsive(DonutChart));
