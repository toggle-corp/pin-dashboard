import React from 'react';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import MultiViewContainer from '#rscv/MultiViewContainer';

import NationalOverview from './NationalOverview';

import styles from './styles.scss';

enum ViewLevel {
    National,
    District,
    Ward
}

interface State {
    currentViewLevel: ViewLevel;
}
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

/* Loads required info from server */
// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<MyProps, State> {
    public constructor(props: MyProps) {
        super(props);

        this.state = {
            currentViewLevel: ViewLevel.National,
        };

        this.views = {
            [ViewLevel.National]: {
                component: NationalOverview,
                rendererParams: () => {
                    const {
                        requests: {
                            alertsRequest: { response },
                        },
                    } = this.props;

                    return {
                        metadata: response,
                        className: styles.nationalOverview,
                        title: 'Nepal',
                    };
                },
            },
        };
    }

    private views: {
        [key: string]: {
            component: React.ComponentType;
            rendererParams?: () => object;
            wrapContainer?: boolean;
            mount?: boolean;
            lazyMount?: boolean;
        };
    }

    public render() {
        const {
            requests: {
                alertsRequest,
            },
        } = this.props;

        const {
            currentViewLevel,
        } = this.state;

        if (alertsRequest.pending) {
            return (
                <div className={styles.loadingMessage}>
                    Loading Metadata ...
                </div>
            );
        }

        return (
            <div className={styles.app}>
                <MultiViewContainer
                    views={this.views}
                    active={currentViewLevel}
                />
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        App,
    ),
);
