import { persistCombineReducers } from 'redux-persist';
import localforage from 'localforage';

import routeReducer from './atom/route/reducer';

const rootReducer = persistCombineReducers(
    {
        blacklist: ['route'],
        key: 'durable-solutions-dashboard',
        version: 1,
        storage: localforage,
    },
    {
        // TODO: remove cast after latest update
        route: routeReducer as any,
    },
);

export default rootReducer;
