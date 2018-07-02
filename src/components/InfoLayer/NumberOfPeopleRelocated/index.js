import PropTypes from 'prop-types';
import React from 'react';

import webEndPoint from '../../../rest/webEndPoint';
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

    renderItem = p => (
        <div className={styles.item}>
            <img
                alt={p.alt}
                className={styles.image}
                src={p.image}
            />
            <div className={styles.value}>
                { p.value || '-' }
            </div>
        </div>
    )

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
                        image={`${webEndPoint}/male-icon.png`}
                        value={data.male}
                    />
                    <Item
                        image={`${webEndPoint}/female-icon.png`}
                        value={data.female}
                    />
                    <Item
                        image={`${webEndPoint}/male-child-icon.png`}
                        value={data.maleChild}
                    />
                    <Item
                        image={`${webEndPoint}/female-child-icon.png`}
                        value={data.femaleChild}
                    />
                    <Item
                        image={`${webEndPoint}/male-old-icon.png`}
                        value={data.maleOld}
                    />
                    <Item
                        image={`${webEndPoint}/female-old-icon.png`}
                        value={data.femaleOld}
                    />
                </div>
            </div>
        );
    }
}
