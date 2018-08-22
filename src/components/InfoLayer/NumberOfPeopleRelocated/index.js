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

    renderDetail = (p) => {
        const {
            value,
            description,
        } = p;

        return (
            <div className={styles.detail}>
                <Numeral
                    className={styles.value}
                    value={+value}
                    precision={0}
                />
                <div className={styles.description}>
                    { description }
                </div>
            </div>
        );
    }

    render() {
        const { data } = this.props;
        const className = this.getClassName();

        const Item = this.renderItem;
        const Detail = this.renderDetail;

        const total = (+data.male || 0)
            + (+data.female || 0);

        return (
            <div className={className}>
                <h4 className={styles.heading}>
                    Number of people relocated
                </h4>
                <div className={styles.content}>
                    <Item
                        image={`${staticEndPoint}/male.png`}
                        value={data.male || 0}
                    />
                    <Item
                        image={`${staticEndPoint}/female.png`}
                        value={data.female || 0}
                    />
                    <Item
                        image={`${staticEndPoint}/children-male.png`}
                        value={data.childrenMale || 0}
                    />
                    <Item
                        image={`${staticEndPoint}/children-female.png`}
                        value={data.childrenFemale || 0}
                    />
                    <Item
                        image={`${staticEndPoint}/elderly-male.png`}
                        value={data.elderlyMale || 0}
                    />
                    <Item
                        image={`${staticEndPoint}/elderly-female.png`}
                        value={data.elderlyFemale || 0}
                    />
                </div>
                <Detail
                    value={total}
                    description="People relocated"
                />
            </div>
        );
    }
}
