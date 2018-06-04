import localforage from 'localforage';

const storeConfig = {
    // blacklist: ['mem'],
    key: 'pin-visualization',
    storage: localforage,
    version: 1,
};

export default storeConfig;
