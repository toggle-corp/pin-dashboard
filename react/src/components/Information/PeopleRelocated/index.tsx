import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Numeral from '#rscv/Numeral';
import ListView from '#rscv/List/ListView';

import childrenFemaleIcon from '#resources/img/children-female.png';
import childrenMaleIcon from '#resources/img/children-male.png';
import elderlyFemaleIcon from '#resources/img/elderly-female.png';
import elderlyMaleIcon from '#resources/img/elderly-male.png';
import femaleIcon from '#resources/img/female.png';
import maleIcon from '#resources/img/male.png';

import TextOutput from '../../TextOutput';
import Header from '../Header';
import Heading from '../Heading';
import People from './People';

import { PeopleRelocated } from '#constants';

import styles from './styles.scss';

interface Props {
    className?: string;
    data?: PeopleRelocated;
}

const relocatedPeopleIcons: { [key in keyof PeopleRelocated]: string } = {
    male: maleIcon,
    female: femaleIcon,
    childrenMale: childrenMaleIcon,
    childrenFemale: childrenFemaleIcon,
    elderlyMale: elderlyMaleIcon,
    elderlyFemale: elderlyFemaleIcon,
};

const relocatedPeopleKeyList = Object.keys(relocatedPeopleIcons) as (keyof PeopleRelocated)[];

const keySelector = (item: keyof PeopleRelocated) => item;

class PeopleRelocatedView extends React.PureComponent<Props> {
    private getParamsForRelocatedPeople = (_: string, key: keyof PeopleRelocated) => {
        const { data } = this.props;

        return {
            icon: relocatedPeopleIcons[key],
            value: data && data[key],
            alt: key,
        };
    }

    public render() {
        const {
            className,
            data,
        } = this.props;

        if (!data) {
            return null;
        }

        const {
            male = 0,
            female = 0,
        } = data;

        const total = male + female;

        return (
            <div className={_cs(className, styles.peopleRelocated)}>
                <Header className={styles.header}>
                    <Heading
                        className={styles.heading}
                        text="Number of people relocated"
                    />
                </Header>
                <ListView
                    className={styles.peopleList}
                    data={relocatedPeopleKeyList}
                    renderer={People}
                    rendererParams={this.getParamsForRelocatedPeople}
                    keySelector={keySelector}
                />
                <TextOutput
                    label="People relocated"
                    value={(
                        <Numeral
                            value={total}
                            precision={null}
                            showSeparator
                        />
                    )}
                    // invertOrder
                    // hideSeparator
                />
            </div>
        );
    }
}

export default PeopleRelocatedView;
