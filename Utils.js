import React from 'react';
import { Share, Platform, Alert, Modal, View, Text, StyleSheet, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import NavigationService from './navigation/NavigationService';
import UserPrefs from './UserPrefs';
import Const from './Const';
import L from './lang/Lang';
import MyActivityIndicator from './components/MyActivityIndicator';
import { decode } from 'js-base64';

require('./thirdparty/date.min');

let APP_STOP_TS = null;

const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const tsToDateConverter = (ts, isMessagesPage) => {
  const date = new Date(ts);
  const currentDate = new Date();
  const formattedDate = date.formatDate('dd.MM.yyyy');
  const daysPassed = new Date(currentDate - date).getDate() - 1;
  const dayOfTheWeek = L(weekday[date.getDay()]);
  const currentDayOfTheWeek = L(weekday[currentDate.getDay()]);
  const time = date.formatDate('HH:mm');

  if (daysPassed === 0) {
    return dayOfTheWeek === currentDayOfTheWeek ? (isMessagesPage ? L('today') : time) : L('yesterday');
  } else if (daysPassed === 1) {
    return L('yesterday');
  } else if (daysPassed > 7) {
    return formattedDate;
  } else {
    return dayOfTheWeek;
  }
};

export const tsToTimeConverter = (ts) => {
  const date = new Date(ts);
  const time = date.formatDate('HH:mm');

  return time;
};

export const updateAppStopTs = () => {
  APP_STOP_TS = new Date().getTime();
};

export const getAndClearAppStopTs = () => {
  const ts = APP_STOP_TS;
  APP_STOP_TS = null;
  return ts;
};

export const isIosChatObject = (object) => {
  return object && object.states && object.states.firmware && object.states.firmware.indexOf('ios') >= 0;
};

export const isDeviceFirmware = (object, id, os = 'android') => {
  return object?.[id]?.states?.firmware?.indexOf(os) >= 0;
};

export const getServerUrl = () => {
  //console.log(' ============ get: usingAltBackend = ' + UserPrefs.all.usingAltBackend + ': url: ' + UserPrefs.all.usingAltBackend ? Const.ALT_SERVER_URL : Const.SERVER_URL);
  return UserPrefs.all.usingAltBackend ? Const.ALT_SERVER_URL : Const.SERVER_URL;
};
export const getApiUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_API_URL : Const.API_URL;
};
export const getAudioUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_AUDIO_URL : Const.AUDIO_URL;
};
export const getOssUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_OSS_URL : Const.OSS_URL;
};
export const getApiParentUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_API_PARENT_URL : Const.API_PARENT_URL;
};
export const getApiCommonUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_API_COMMON_URL : Const.API_COMMON_URL;
};

export const getAppStatsUrl = () => {
  return UserPrefs.all.usingAltBackend ? Const.ALT_API_STATS_URL : Const.API_STATS_URL;
};

export const getCoordInfo = (coordMode, marker, addrMap, wifiAddrMap) => {
  if ('gps' === coordMode) {
    return {
      lat: marker.lat,
      lon: marker.lon,
      accuracy: marker.accuracy,
      speed: marker.speed,
      ts: new Date(marker.coordTs),
      addr: addrMap[marker.oid + ''],
      source: 'gps',
    };
  }

  if ('wifi' === coordMode) {
    if (marker.states && marker.states.wifiCoordTs) {
      const { states } = marker;
      return {
        lat: parseFloat(states.wifiLat),
        lon: parseFloat(states.wifiLon),
        accuracy: parseInt(states.wifiAccuracy),
        speed: 0,
        ts: new Date(states.wifiCoordTs),
        addr: wifiAddrMap[marker.oid + ''],
        source: 'wifi',
      };
    }
  }

  if ('gps_wifi' === coordMode) {
    const wifiPresent = marker.states && marker.states.wifiCoordTs;
    if (wifiPresent) {
      const { states } = marker;
      const wifiTs = new Date(states.wifiCoordTs);
      const diff = (wifiTs - marker.coordTs) / 1000;
      const wifiNewer = diff > Const.MAX_WIFI_DIFF;
      if (wifiNewer) {
        return {
          lat: parseFloat(states.wifiLat),
          lon: parseFloat(states.wifiLon),
          accuracy: parseInt(states.wifiAccuracy),
          speed: 0,
          ts: new Date(states.wifiCoordTs),
          addr: wifiAddrMap[marker.oid + ''],
          source: 'wifi',
        };
      }
    }
  }

  return {
    lat: marker.lat,
    lon: marker.lon,
    accuracy: marker.accuracy,
    speed: marker.speed,
    ts: new Date(marker.coordTs),
    addr: addrMap[marker.oid + ''],
    source: 'gps',
  };
};

export const getZoomFromRegion = (region) => {
  return Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
};

export const getRegionForZoom = (lat, lon, zoom) => {
  const distanceDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const { width, height } = Dimensions.get('window');
  const aspectRatio = width / height;
  return {
    latitude: lat,
    longitude: lon,
    latitudeDelta: distanceDelta * aspectRatio,
    longitudeDelta: distanceDelta,
  };
};

export const extractPhone = (string) => {
  if (!string) {
    return '+';
  }
  const arr = string.match(/[\+0-9]+/g);
  if (arr) {
    let phone = arr.join('');
    if (phone.startsWith('8')) {
      phone = phone.replace('8', '+7');
    } else {
      if (!phone.startsWith('+')) {
        phone = '+' + phone;
      }
    }
    return phone;
  }
  return '+';
};

export function underConstruction() {
  Alert.alert(L('under_construction'), L('when_its_done'), [{ text: 'OK' }], { cancelable: true });
}

export function alertUnavailableInDemo() {
  Alert.alert(L('demonstration'), L('unavailable_in_demo'), [{ text: 'OK' }], { cancelable: true });
}

export function showPremiumFeatures(backTo) {
  NavigationService.navigate('PremiumFeatures', { backTo: backTo });
}

export function needPremiumDialog(backTo, showAlert) {
  showAlert(true, L('menu_premium'), L('need_premium'), false, '', L('purchase'), [
    () => {
      showAlert(false, '', '');
      showPremiumFeatures(backTo);
    },
  ]);
}

export const getDate = (date) => {
  return date.formatDate('dd.MM.yyyy');
};

export const getTime = (date) => {
  return date.formatDate('HH:mm');
};

export const makeElapsedDate = (ts) => {
  var now = new Date();
  if (now.getFullYear() != ts.getFullYear()) {
    return getDate(ts) + ', ' + getTime(ts);
  }
  // today
  if (ts.toDateString() == now.toDateString()) {
    return L('today') + ', ' + getTime(ts);
  }
  // yesterday
  var yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (ts.toDateString() == yesterday.toDateString()) {
    return L('yesterday') + ', ' + getTime(ts);
  }
  // this year
  return ts.getDate() + ' ' + L('month_' + ts.getMonth()) + ', ' + getTime(ts);
};

export class CustomProgressBar extends React.Component {
  render() {
    return (
      <Modal onRequestClose={() => {}} visible={this.props.visible} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.frame}>
            <MyActivityIndicator size="large" />
            {this.props.title && (
              <Text style={{ fontSize: 16, fontWeight: '200', marginLeft: 10, color: 'black' }}>
                {this.props.title}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

export const isTrialExpired = (premium) => {
  const curDate = new Date().getTime();
  const expireDate = premium.trialExpirationDate ? premium.trialExpirationDate.getTime() : 0;
  return curDate > expireDate;
};

export const getKidAppUrl = () => {
  const url = Platform.select({
    ios: [Const.KID_APP_IOS_URL],
    android: [Const.KID_APP_ANDROID_URL],
  });
  return url[0];
};

export const makeDurationLabel = (dur) => {
  if (dur < 1 || !dur) {
    return '0:00';
  }
  const minutes = Math.floor(dur / 1000.0 / 60);
  const seconds = Math.floor((dur / 1000.0) % 60);
  const sec = seconds > 9 ? seconds : '0' + seconds;
  const result = minutes + ':' + sec;
  return result;
};

export const makeTimeLabel = (ts) => {
  const hh = ts.getHours() > 9 ? ts.getHours() : '0' + ts.getHours();
  const mm = ts.getMinutes() > 9 ? ts.getMinutes() : '0' + ts.getMinutes();
  return hh + ':' + mm;
};

// return true when shared
export const shareApp = async (shareUrl = Const.APP_SHARE_URL, messageText = L('app_share_text')) => {
  try {
    let message = messageText;
    if ('ios' !== Platform.OS) {
      message += ' ' + shareUrl;
    }
    console.log('share url:', shareUrl);
    const result = await Share.share({
      url: shareUrl,
      message: message,
    });

    if (result.action === Share.sharedAction) {
      return true;
    } else if (result.action === Share.dismissedAction) {
      return false;
    }
  } catch (e) {}
  return false;
};

export const soundBalanceToStr = function (dur) {
  if (dur < 1 || !dur) {
    return '0:00';
  }
  const durDiv = dur / 1000.0;

  const days = Math.floor(durDiv / 86400);
  const hours = Math.floor((durDiv / 3600) % 24);
  const minutes = Math.floor((durDiv / 60) % 60);
  const seconds = Math.floor(durDiv % 60);
  const sec = seconds > 9 ? seconds : '0' + seconds;
  const min = minutes > 9 ? minutes : '0' + minutes;
  let result = min + ':' + sec;
  if (hours > 0) {
    const hr = hours > 9 ? hours : '0' + hours;
    result = hr + ':' + result;
  }
  if (days > 0) {
    result = days + L('ts_day') + ' ' + result;
  }
  return result;
};

export const getConfigurationAletsCount = function (obj) {
  if (!obj) {
    obj = {};
  }
  if (!obj.states) {
    obj.states = {};
  }
  const states = obj.states;

  const offlineAlert = states.offlineAlert;
  const gpsAlert = states.gpsEnabled !== '1' ? '1' : '0';
  const micPermissionAlert = states.micPermissionAlert;
  const backgroundPermissionAlert = states.backgroundPermissionAlert;
  const adminDisabledAlert = states.adminDisabledAlert;

  const alerts = {
    offlineAlert,
    gpsAlert,
    micPermissionAlert,
    backgroundPermissionAlert,
    adminDisabledAlert,
  };

  const confirmedAlerts = Object.values(alerts).filter((value) => value === '1');

  const alertsCount = confirmedAlerts.length;

  return {
    alerts,
    alertsCount,
  };
};

export const getConfigurationAlets = function (obj) {
  if (!obj) {
    obj = {};
  }
  if (!obj.states) {
    obj.states = {};
  }
  const states = obj.states;

  const offlineAlert = '1' === states.offlineAlert;
  const gpsAlert = '1' !== states.gpsEnabled;
  const micPermissionAlert = '1' === states.micPermissionAlert;
  const backgroundPermissionAlert = '1' === states.backgroundPermissionAlert;
  const adminDisabledAlert = '1' === states.adminDisabledAlert;
  const gpsPermissionAlert = '1' === states.gpsPermissionAlert;

  const hasAlert =
    offlineAlert ||
    gpsAlert ||
    micPermissionAlert ||
    hasAlert ||
    backgroundPermissionAlert ||
    adminDisabledAlert ||
    gpsPermissionAlert;
  return {
    offlineAlert,
    gpsAlert,
    micPermissionAlert,
    hasAlert,
    backgroundPermissionAlert,
    adminDisabledAlert,
    gpsPermissionAlert,
  };
};

export const maxZoomForLayer = function (layerIndex) {
  if (3 == layerIndex) {
    return 17;
  } else {
    return 18;
  }
};

export const getUrlParams = function (search) {
  if (!search) {
    return {};
  }
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = {};
  hashes.map((hash) => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
};

export const getLocationCountry = async () => {
  // Ilia Y.: Why do I have to use trim() for ios? Invalid api key otherwise
  const GIP_KEY = decode(Const.GIP_KEY).trim();
  return fetch(`http://ipwhois.pro/json/?key=${GIP_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      const { country } = data;

      if (country) {
        UserPrefs.setUserLocationCountry(country);

        if (country === 'Russia') {
          UserPrefs.setUsingAltBackend(true);
        }
        return Promise.resolve(country);
      }
    })
    .catch((err) => {
      console.log('Error getting location country', err);
    });
};

export const handleTabBarBackButton = (tabNav, navigation, tabBarHistory, setTabBarHistory) => {
  const historyLength = tabBarHistory.length;

  if (navigation.isFocused()) {
    if (historyLength >= 2) {
      const screenName = tabBarHistory[historyLength - 2];

      if (tabBarHistory[historyLength - 1] !== L('map')) {
        tabNav.navigate(screenName);
      }

      setTabBarHistory([L('map')]);
    } else {
      tabNav.navigate(tabBarHistory[0]);
    }
  }
};

const styles = StyleSheet.create({
  frame: {
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
