import React from 'react';
import { _cs } from '@togglecorp/fujs';

import styles from './styles.scss';

interface Props {
    className?: string;
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    label?: string;
    color: string;
}

const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians)),
    };
};

const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ].join(' ');

    return d;
};

class Arc extends React.PureComponent<Props> {
    public render() {
        const {
            className,
            x,
            y,
            radius,
            startAngle,
            endAngle,
            label,
            color,
        } = this.props;

        const d = describeArc(x, y, radius, startAngle, endAngle);

        return (
            <path
                className={_cs(className, styles.path)}
                d={d}
                fill="none"
                stroke={color}
            >
                <title>
                    { label }
                </title>
            </path>
        );
    }
}

export default Arc;
