import { store } from './Store';

export const waitForConnection = async (maxDuration) => {
    if (!maxDuration) {
        maxDuration = 15;
    }

    let promise = new Promise(function (resolve, reject) {
        let elapsed = 0; // msec
        const timer = setInterval(async () => {
            if (elapsed / 1000 > maxDuration) {
                clearInterval(timer);
                return reject({ elapsed });
            }
            const { authorized } = store.getState().authReducer;
            if (authorized) {
                clearInterval(timer);
                return resolve({ elapsed });
            }
            elapsed += 500;
        }, 500);
    });
    return promise;
};