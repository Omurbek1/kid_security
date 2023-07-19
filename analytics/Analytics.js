import appsFlyer from 'react-native-appsflyer';
import { AppEventsLogger } from 'react-native-fbsdk-next';
import Const from '../Const';
import analytics from '@react-native-firebase/analytics';

let API_KEY = '1535aac2-256e-48f5-ab46-376de26755f5';

export function init() {
    if (API_KEY) {
        try {
            // AppMetrica.activate({
            //     apiKey: API_KEY,
            //     sessionTimeout: 60,
            //     firstActivationAsUpdate: false,
            // });
            // AppMetrica.setLocationTracking(false);
        } catch (e) {
            console.warn(e);
        }
    }
}

export function setUserId(uid) {
    if (API_KEY) {
        try {
            // AppMetrica.setUserProfileID(uid + '');
            analytics().setUserId(uid + '');
            appsFlyer.setCustomerUserId(uid + '');
        } catch (e) {
            console.warn(e);
        }
    }
}

export function event(name, data) {
    if (API_KEY) {
        try {
            if (__DEV__) {
                // AppMetrica.reportEvent(name, { ...data, dev: true});
                analytics().logEvent(name, { ...data, dev: true });
            } else {
                // AppMetrica.reportEvent(name, data);
                analytics().logEvent(name, data);
            }
        } catch (e) {
            console.warn(e);
        }
    }
}

export function logStartTrialSubscription() {
    console.log(' === METRICA: logStartTrialSubscription')
    try {
        AppEventsLogger.logEvent(Const.EVENT_ADDED_TO_CART)
    } catch (e) {
        console.warn(e)
    }
}

export function logChildConnected() {
    const eventName = 'child_connected'
    console.log(' === METRICA: logChildConnected')
    try {
        appsFlyer.logEvent(eventName)
    } catch (e) {
        console.log(e)
    }
    try {
        AppEventsLogger.logEvent(Const.EVENT_AD_CLICK)
    } catch (e) {
        console.warn(e)
    }
    analytics().logEvent(eventName)
}
