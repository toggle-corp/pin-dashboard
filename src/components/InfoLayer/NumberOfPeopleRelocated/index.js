import PropTypes from 'prop-types';
import React from 'react';

import staticEndPoint from '../../../rest/staticEndPoint';
import Numeral from '../../../vendor/react-store/components/View/Numeral';
import styles from './styles.scss';

const propTypes = {
    className: PropTypes.string,

    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
};

const defaultProps = {
    className: '',
};

export default class NumberOfPeopleRelocated extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    getClassName = () => {
        const { className } = this.props;
        const classNames = [
            className,
            styles.numberOfPeopleRelocated,
        ];

        return classNames.join(' ');
    }

    renderItem = (p) => {
        const {
            className: classNameFromProps = '',
            alt,
            image,
            value,
        } = p;

        const className = `
            ${classNameFromProps}
            ${styles.item}
        `;

        return (
            <div className={className}>
                <img
                    alt={alt}
                    className={styles.image}
                    src={image}
                />
                <div className={styles.value}>
                    {
                        value ? (
                            <Numeral
                                className={styles.number}
                                precision={0}
                                value={value}
                            />
                        ) : '-'
                    }
                </div>
            </div>
        );
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();

        const Item = this.renderItem;

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Number of people relocated
                </h4>
                <div className={styles.content}>
                    <Item
                        image={`${staticEndPoint}/male.png`}
                        value={data.total}
                    />
                    {/*
                    <Item
                        image={`${staticEndPoint}/male.png`}
                        value={data.male}
                    />
                    <Item
                        image={`${staticEndPoint}/female.png`}
                        value={data.female}
                    />
                    */}
                    <Item
                        image={`${staticEndPoint}/children.png`}
                        value={data.children}
                    />
                    <Item
                        image={`${staticEndPoint}/elderly.png`}
                        value={data.elderly}
                    />
                </div>
            </div>
        );
    }
}
