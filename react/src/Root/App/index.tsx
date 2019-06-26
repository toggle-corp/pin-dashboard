import React from 'react';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

interface State {}
interface Params {}
interface Props {}

const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    alertsRequest: {
        url: '/metadata/',
        method: methods.GET,
        onMount: true,
        /*
        extras: {
            schemaName: 'alertResponse',
        },
        */
    },
};

type MyProps = NewProps<Props, Params>;

interface Base {
    totalHouseholds?: number;
    landPurchased?: number;
    geohazardAffected: {
        Eligible?: number;
        Relocated?: number;
        Total?: number;
    };
    landslidesRiskScore: {
        '0'?: number;
        '200-Below'?: number;
        '300-201'?: number;
        '400-301'?: number;
        '500-401'?: number;
        '625-501'?: number;
    };
    landslidesSurveyed: {
        CAT1?: number;
        CAT2?: number;
        CAT3?: number;
    };
    peopleRelocated: {
        male?: number;
        female?: number;
        childrenMale?: number;
        childrenFemale?: number;
        elderlyMale?: number;
        elderlyFemale?: number;
    };
}

interface Metadata extends Base {
    districts: {
        [key: string]: Base;
    };
}

/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<MyProps, State> {
    public render() {
        const {
            requests: {
                alertsRequest,
            },
        } = this.props;

        console.warn(alertsRequest);

        if (alertsRequest.pending) {
            return (
                <div>
                    Loading Metadata
                </div>
            );
        }

        const {
            totalHouseholds,
        } = alertsRequest.response as Metadata;

        return (
            <div>
                Total Households:
                {totalHouseholds}
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        App,
    ),
);
