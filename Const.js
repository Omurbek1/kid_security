import { Platform } from 'react-native';
import Constants from 'expo-constants';
import remoteConfig from '@react-native-firebase/remote-config';

import { L } from './lang/Lang';
import UserPrefs from './UserPrefs';

export default  Const = {
  SERVER_URL: 'wss://control.kidsecurity.tech',
  API_URL: 'https://api.kidsecurity.tech/',
  AUDIO_URL: 'https://server.kidsecurity.tech/',
  OSS_URL: 'https://api.kidsecurity.tech/oss-app/',
  API_PARENT_URL: 'https://svc.kidsecurity.tech/api/parent/',
  API_COMMON_URL: 'https://svc.kidsecurity.tech/api/common/',
  API_STATS_URL: 'https://svc.kidsecurity.tech/appname',
  API_BASE_URL: 'https://svc.kidsecurity.tech/',
  REST_API_AUTH_URL: 'https://rest.kidsecurity.tech/v1/auth/',
  REST_API_PARENT_URL: 'https://rest.kidsecurity.tech/v1/parent/',

  ALT_SERVER_URL: 'wss://control.gps-watch.kz',
  ALT_API_URL: 'https://api.gps-watch.kz/',
  ALT_AUDIO_URL: 'https://server.gps-watch.kz/',
  ALT_OSS_URL: 'https://api.gps-watch.kz/oss-app/',
  ALT_API_PARENT_URL: 'https://svc.gps-watch.kz/api/parent/',
  ALT_API_COMMON_URL: 'https://svc.gps-watch.kz/api/common/',
  ALT_API_STATS_URL: 'https://svc.gps-watch.kz/appname',

  /*SERVER_URL: 'ws://192.168.13.38:8080/tracking-web/control',
    API_URL: 'http://192.168.13.38:8080/rest-api-web/api/',
    AUDIO_URL: 'http:/192.168.13.38:8080/tracking-web/',
    ALT_SERVER_URL: 'ws://192.168.13.38:8080/tracking-web/control',
    ALT_API_URL: 'http://192.168.13.38:8080/rest-api-web/api/',
    ALT_AUDIO_URL: 'http:/192.168.13.38:8080/tracking-web/',*/

  APP_SHARE_URL: 'https://onelink.to/hvc7c2',
  TAKE_TEST_URL: 'https://kidsecurity.net/test',

  SUPPORT_SKYTAG: 'support#0000',

  YANDEX_API_KEY: '887567cf-e4c4-4e8f-bc6b-ec072533f71b',

  HEADER_HEIGHT: 70,

  WIRE_ERROR_RECORDER: 4,
  WIRE_ERROR_SESSION: 5,
  WIRE_ERROR_NO_DATA: 6,
  WIRE_ERROR_SEND: 7,
  WIRE_ERROR_NO_PERMISSION: 8,

  EVENT_INSTALL: 'MOBILE_APP_INSTALL', // no API description
  EVENT_LAUNCH: 'App Launch', // no API description
  EVENT_AD_CLICK: 'AdClick',
  EVENT_CHECKOUT_INITIATED: 'fb_mobile_initiated_checkout',
  EVENT_PURCHASED: 'fb_mobile_purchase',
  EVENT_ADDED_TO_CART: 'fb_mobile_add_to_cart',

  EVENT_INSTALL_TOKEN: null,
  EVENT_LAUNCH_TOKEN: null,
  EVENT_AD_CLICK_TOKEN: '2daz7n',
  EVENT_CHECKOUT_INITIATED_TOKEN: 'lfo5b0',
  EVENT_PURCHASED_TOKEN: 'qe03xn',
  EVENT_ADDED_TO_CART_TOKEN: '4vu2xy',

  DEFAULT_LAT: 51.153151,
  DEFAULT_LON: 71.457331,
  DEFAULT_ZOOM: 16,

  MAX_WIFI_DIFF: 20, // use wifi coord when gps coord age greater const

  PUSH_PROVIDER_EXPO: 'Expo',
  PUSH_PROVIDER_ANDROID: 'SiriusFcm',
  PUSH_PROVIDER_IOS: 'SiriusApns',
  TERMS_OF_USE: 'https://kidsecurity.net/termsofuse',
  POLICY: 'https://kidsecurity.net/privacy_policy',
  FAQ: 'https://kidsecurity.net',
  HOMEPAGE: 'https://kidsecurity.net',
  HOMEPAGE_TEXT: 'kidsecurity.net',

  IOS_APP_URL: 'https://itunes.apple.com/kz/app//id1450358983?mt=8',
  ANDROID_APP_URL: 'https://play.google.com/store/apps/details?id=kz.sirius.kidssecurity&hl=ru',
  WHATSAPP_SUPPORT_URL: 'https://api.whatsapp.com/send?phone=',

  //KID_APP_ANDROID_URL: 'https://play.google.com/store/apps/details?id=kz.sirius.siriuschat',
  //KID_APP_IOS_URL: 'https://itunes.apple.com/kz/app/siriuschat/id1451711900',
  KID_APP_ANDROID_URL: 'https://onelink.to/addkids',
  KID_APP_IOS_URL: 'https://onelink.to/addkids',
  CORONA_SHARE_URL: 'https://onelink.to/ksanticorona',

  CHAT_PRELOAD_LIMIT: 30,

  MAX_AUDIO_MESSAGE_LEN: 60 * 1000, // msec
  WIRETAPPING_DURATION: 20, // seconds
  SURVEY_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfy_WiuWbxYrPWAqkEalIZG01eE-E5aOGnahtRWOIeDK4wZTQ/viewform',
  ADJUST_IOS_KEY: 'lbym0ln6xrls',
  ADJUST_ANDROID_KEY: 'lbym0ln6xrls',

  //MAP_URL_TEMPLATES: [null, null, 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 'https://tile0.maps.2gis.com/tiles?z={z}&x={x}&y={y}&v1.png'],
  MAP_URL_TEMPLATES: [
    null,
    null,
    'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
    'https://tile0.maps.2gis.com/tiles?z={z}&x={x}&y={y}&v1.png',
  ],
  TILE_Z_INDEX: Platform.OS === 'ios' ? 0 : -3,
  DEFAULT_PADDING:
    Platform.OS === 'ios'
      ? { top: 10, right: 70, bottom: 10, left: 70 }
      : { top: 10, right: 160, bottom: 10, left: 160 },

  MAP_MARKER_Y_OFFSET: -100 / 2,

  MAX_WIRE_PROMO_BUY_TIME: 5 * 60 * 60 * 1000,
  //MAX_WIRE_PROMO_BUY_TIME: 3 * 60 * 1000, // todo: remove from release
  //WIRE_PROMO_BALANCE_TRIGGER: 30 * 60 * 1000 - 1000,
  WIRE_PROMO_BALANCE_TRIGGER: 3 * 60 * 1000,

  getAdjustKey: () => {
    const key = Platform.select({
      ios: [Const.ADJUST_IOS_KEY],
      android: [Const.ADJUST_ANDROID_KEY],
    });
    return key[0];
  },

  getRecordFormat: () => {
    const format = Platform.select({
      ios: ['m4a'],
      android: ['mp3'],
    });
    return format[0];
  },

  getPlayFormat: () => {
    const format = Platform.select({
      ios: ['m4a'],
      android: ['mp3'],
    });
    return format[0];
  },

  getPushProvider: () => {
    const url = Platform.select({
      ios: [Const.PUSH_PROVIDER_IOS],
      android: [Const.PUSH_PROVIDER_ANDROID],
    });
    return url[0];
  },

  getInstructionsUrl: () => {
    return 'instructions_url';
  },

  compileSupportUrl: (userId, objects) => {
    const appVer = Constants.manifest.version;
    const osName = Platform.OS;
    const osVer = Platform.Version;
    const devName = Constants.deviceName;
    const language = UserPrefs.all.language;
    const supportChatUrl = remoteConfig().getValue('support_chat_url').asString();

    const userInfo = appVer + '/' + osName + '/' + osVer + '/' + devName;
    const children = [];
    if (objects) {
      for (let i in objects) {
        const o = objects[i + ''];
        if (o.oid === 1) {
          // skip demo object
          continue;
        }
        const { states, props } = o;
        const name = o.name && o.name.trim().length !== '' ? o.name : '[n/a]';
        const fw = (states.firmware + '').replace('HTTP-', '');
        const { deviceModel, modelName } = states;
        const model = (deviceModel ? deviceModel : 'unknown') + '-' + (modelName ? modelName : 'unknown');
        const child = '[' + o.oid + '/' + name + '/' + fw + '/' + model + ']';
        children.push(child);
      }
    }
    const childrenInfo = children.join(', ');

    const template = L('contact_support_url', [userId, language, userInfo, childrenInfo]);
    const result = supportChatUrl + encodeURIComponent(template);
    return result;
  },

  getActivationSupportUrl: () => {
    const url = remoteConfig().getValue('support_chat_url').asString();

    return url;
  },

  updateHost(useHost, host, asDomain) {
    if (useHost && host.length > 1) {
      if (asDomain) {
        Const.SERVER_URL = `wss://control.${host}`;
        Const.API_URL = `https://api.${host}/`;
        Const.AUDIO_URL = `https://server.${host}/`;
        Const.OSS_URL = `https://api.${host}/oss-app/`;
        Const.API_PARENT_URL = `https://svc.${host}/api/parent/`;
        Const.API_COMMON_URL = `https://svc.${host}/api/common/`;
        Const.API_STATS_URL = `https://svc.${host}/appname`;
        // ALT
        Const.ALT_SERVER_URL = `wss://control.${host}`;
        Const.ALT_API_URL = `https://api.${host}/`;
        Const.ALT_AUDIO_URL = `https://server.${host}/`;
        Const.ALT_OSS_URL = `https://api.${host}/oss-app/`;
        Const.ALT_API_PARENT_URL = `https://svc.${host}/api/parent/`;
        Const.ALT_API_COMMON_URL = `https://svc.${host}/api/common/`;
        Const.ALT_API_STATS_URL = `https://svc.${host}/appname`;
      } else {
        if (host === 'dev') {
          Const.SERVER_URL = `wss://dev-control.kidsecurity.tech`;
          Const.API_URL = `https://dev-api.kidsecurity.tech/`;
          Const.AUDIO_URL = `https://dev-server.kidsecurity.tech/`;
          Const.OSS_URL = `https://dev-api.kidsecurity.tech/oss-app/`;
          Const.API_PARENT_URL = `https://dev-svc.kidsecurity.tech/api/parent/`;
          Const.API_COMMON_URL = `https://dev-svc.kidsecurity.tech/api/common/`;
          Const.API_STATS_URL = `https://dev-svc.kidsecurity.tech/appname`;
          Const.API_BASE_URL = `https://dev-svc.kidsecurity.tech/`;
          // ALT
          Const.ALT_SERVER_URL = `wss://dev-control.kidsecurity.tech`;
          Const.ALT_API_URL = `https://dev-api.kidsecurity.tech/`;
          Const.ALT_AUDIO_URL = `https://dev-server.kidsecurity.tech/`;
          Const.ALT_OSS_URL = `https://dev-api.kidsecurity.tech/oss-app/`;
          Const.ALT_API_PARENT_URL = `https://dev-svc.kidsecurity.tech/api/parent/`;
          Const.ALT_API_COMMON_URL = `https://dev-svc.kidsecurity.tech/api/common/`;
          Const.ALT_API_STATS_URL = `https://dev-svc.kidsecurity.tech/appname`;
          Const.REST_API_AUTH_URL = `https://dev-rest.kidsecurity.tech/v1/auth/`;
          Const.REST_API_PARENT_URL = `https://dev-rest.kidsecurity.tech/v1/parent/`;
        } else {
          Const.SERVER_URL = `ws://${host}:8080/tracking-web/control`;
          Const.API_URL = `http://${host}:8080/rest-api-web/api/`;
          Const.AUDIO_URL = `http://${host}:8080/tracking-web/`;
          Const.OSS_URL = `http://${host}:8080/tracking-web/oss-app`;
          Const.API_PARENT_URL = `http://${host}:8083/api/parent/`;
          Const.API_COMMON_URL = `http://${host}:8083/api/common/`;
          Const.API_STATS_URL = `http://${host}:8083/appname`;
          // ALT
          Const.ALT_SERVER_URL = `ws://${host}:8080/tracking-web/control`;
          Const.ALT_API_URL = `http://${host}:8080/rest-api-web/api/`;
          Const.ALT_AUDIO_URL = `http://${host}:8080/tracking-web/`;
          Const.ALT_OSS_URL = `http://${host}:8080/tracking-web/oss-app`;
          Const.ALT_API_PARENT_URL = `http://${host}:8083/api/parent/`;
          Const.ALT_API_COMMON_URL = `http://${host}:8083/api/common/`;
          Const.ALT_API_STATS_URL = `http://${host}:8083/appname`;
        }
      }
    } else {
      Const.SERVER_URL = 'wss://control.kidsecurity.tech';
      Const.API_URL = 'https://api.kidsecurity.tech/';
      Const.AUDIO_URL = 'https://server.kidsecurity.tech/';
      Const.OSS_URL = 'https://api.kidsecurity.tech/oss-app/';
      Const.API_PARENT_URL = 'https://svc.kidsecurity.tech/api/parent/';
      Const.API_COMMON_URL = `https://svc.kidsecurity.tech/api/common/`;
      Const.API_STATS_URL = `https://svc.kidsecurity.tech/appname`;
      // ALT
      Const.ALT_SERVER_URL = 'wss://control.gps-watch.kz';
      Const.ALT_API_URL = 'https://api.gps-watch.kz/';
      Const.ALT_AUDIO_URL = 'https://server.gps-watch.kz/';
      Const.ALT_OSS_URL = 'https://api.gps-watch.kz/oss-app/';
      Const.ALT_API_PARENT_URL = 'https://svc.gps-watch.kz/api/parent/';
      Const.ALT_API_COMMON_URL = `https://svc.gps-watch.kz/api/common/`;
      Const.ALT_API_STATS_URL = `https://svc.gps-watch.kz/appname`;
    }
  },
  GIP_KEY: 'ZlpnYlhRUFJJNTBRSEJMQwo=',
};
