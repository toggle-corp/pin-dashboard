// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const createLogger = skipList => store => next => (action) => {
    if (action && !skipList.includes(action.type)) {
        if (action.senderId === undefined) {
            console.info(`DISPATCHING ${action.type}`);
        } else {
            console.info(`DISPATCHING FROM ANOTHER TAB ${action.type}`);
        }
    }
    const result = next(action);
    return result;
};

export default createLogger;
