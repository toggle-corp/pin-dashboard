import React from 'react';

import {
    createConnectedRequestCoordinator,
    createRequestClient,
    NewProps,
    ClientAttributes,
    methods,
} from '#request';

import Map from '#rscz/Map';
import MapContainer from '#rscz/Map/MapContainer';

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

const mapStyle = {
    name: 'none',
    style: 'mapbox://styles/adityakhatri/cjuck3jrk1gyt1fprrcz8z4f0',
    color: '#dddddd',
};


const requests: { [key: string]: ClientAttributes<Props, Params> } = {
    metadaRequest: {
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
                            metadaRequest: { response },
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
                metadaRequest,
            },
        } = this.props;

        const {
            currentViewLevel,
        } = this.state;

        if (metadaRequest.pending) {
            return (
                <div className={styles.loadingMessage}>
                    Loading Metadata ...
                </div>
            );
        }

        return (
            <div className={styles.app}>
                <Map
                    mapStyle={mapStyle.style}
                    fitBoundsDuration={200}
                    minZoom={5}
                    logoPosition="bottom-left"

                    showScaleControl
                    scaleControlPosition="bottom-right"

                    showNavControl
                    navControlPosition="bottom-right"
                >
                    <div className={styles.left}>
                        <MultiViewContainer
                            views={this.views}
                            active={currentViewLevel}
                        />
                    </div>
                    <MapContainer
                        className={styles.right}
                    />
                </Map>
            </div>
        );
    }
}

export default createConnectedRequestCoordinator<Props>()(
    createRequestClient(requests)(
        App,
    ),
);
