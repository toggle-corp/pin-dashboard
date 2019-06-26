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

interface Metadata {
    totalHouseholds: number;
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
