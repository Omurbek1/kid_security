import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Migration from './migration/UserPrefsMigration';
type TAll = {
  userPhone: unknown;
  userEmail: unknown;
  username: unknown;
  usernameDev: unknown;
  password: unknown;
  passwordDev: unknown;
  introShown: unknown;
  pinCodeHintShown: unknown;
  termsOfUseAccepted: unknown;
  tryPremiumShown: unknown;
  premiumFeaturesShown: unknown;
  addHomePlaceShown: unknown;
  gpsDialogTs: unknown;
  dontShowGpsDialog: unknown;
  oid: unknown;
  installTs: unknown;
  installWireTs: unknown;
  mapRegion: unknown;
  zoom: unknown;
  mapLayer: unknown;
  wiretappingPhone: unknown;
  language: unknown;
  pushToken: unknown;
  foreverPremiumValidated: unknown;
  cachedPremiumPurchased: unknown;
  cachedWirePurchased: unknown;
  usingAltBackend: unknown;
  parentPraised: unknown;
  firstChildConnected: unknown;
  achievementFeaturesShown: unknown;
  minutesAccrued: unknown;
  useDevHost: unknown;
  devHost: unknown;
  useDevDomain: unknown;
  promoCache: unknown;
  promoWebViewShown: unknown;
  onlineSoundPromoStartTs: unknown;
  onlineSoundPromoDialogShown: unknown;
  onlineSoundPromoBought: unknown;
  ucellAuthPassed: unknown;
  userLocationCountry: unknown;
  restApiTokenData: unknown;
  restApiTokenDataDev: unknown;
  userId: unknown;
};
let all: Partial<TAll> = {};

async function store(name: keyof TAll, value: string, realValue: string) {
  try {
    all[name] = realValue === null || typeof realValue === 'undefined' ? value : realValue;
    //console.log(' ============ store: ' + name + ' = ' + all[name]);
    return await AsyncStorage.setItem(name, value ? value : '');
  } catch (error) { }
}

async function load(name, _default) {
  //console.log(' === PREFS: load ' + name);
  let value = null;
  try {
    value = await AsyncStorage.getItem(name);
    if (value === null || typeof value === 'undefined' || value === '') {
      value = _default;
    }
  } catch (error) { }
  return value;
}

export const setIsNotSendedAnaitycsForFirstOpen = async () => {
  return await store('isNotSendedAnaitycsForFirstOpen', 'false');
};

export const getIsNotSendedAnaitycsForFirstOpen = async () => {
  return JSON.parse(await load('isNotSendedAnaitycsForFirstOpen', 'true'));
};

export const setUserEmail = async (value) => {
  return await store('userEmail', value);
};

export const getUserEmail = async () => {
  return await load('userEmail', null);
};

export const setUserPhone = async (value) => {
  return await store('userPhone', value);
};

export const getUserPhone = async () => {
  return await load('userPhone', null);
};

export const setUsername = async (value) => {
  return await store('username', value);
};

export const getUsername = async () => {
  return await load('username', null);
};

export const setUsernameDev = async (value) => {
  return await store('usernameDev', value);
};

export const getUsernameDev = async () => {
  return await load('usernameDev', null);
};

export const setRestApiTokenData = async (value) => {
  return await store('restApiTokenData', value);
};

export const getRestApiTokenData = async () => {
  return await load('restApiTokenData', null);
};

export const setRestApiTokenDataDev = async (value) => {
  return await store('restApiTokenDataDev', value);
};

export const getRestApiTokenDataDev = async () => {
  return await load('restApiTokenDataDev', null);
};

export const setPromoCache = async (value) => {
  return await AsyncStorage.getItem('promoCache', (err, result) => {
    const id = [value];
    if (result !== null) {
      var newIds = JSON.parse(result).concat(id);
      AsyncStorage.setItem('promoCache', JSON.stringify(newIds));
    } else {
      AsyncStorage.setItem('promoCache', JSON.stringify(id));
    }
  });
};

export const setPromoWebViewShown = async (value) => {
  return await store('promoWebViewShown', value ? '1' : '0', value);
};

export const getPromoWebViewShown = async () => {
  const value = await load('promoWebViewShown', '0');
  return value === '1';
};

export const getPromoCache = async () => {
  return await load('promoCache', []);
};

export const setPassword = async (value) => {
  return await store('password', value);
};

export const getPassword = async () => {
  return await load('password', null);
};

export const setPasswordDev = async (value) => {
  return await store('passwordDev', value);
};

export const getPasswordDev = async () => {
  return await load('passwordDev', null);
};

export const setIntroShown = async (value) => {
  return await store('introShown', value ? '1' : '0', value);
};

export const isIntroShown = async () => {
  const value = await load('introShown', '0');
  //return false;
  return value !== '0';
};

export const setUrlActivation = async (value) => {
  return await store('urlActivation', value ? '1' : '0', value);
};
export const isUrlActivation = async () => {
  const value = await load('urlActivation', '0');
  return value !== '0';
};

export const setPinCodeHintShown = async (value) => {
  return await store('pinCodeHintShown', value ? '1' : '0', value);
};
export const isPinCodeHintShown = async () => {
  const value = await load('pinCodeHintShown', '0');
  return value !== '0';
};

export const setTermsOfUseAccepted = async (value) => {
  return await store('termsOfUseAccepted', value ? '1' : '0', value);
};

export const isTermsOfUseAccepted = async () => {
  const value = await load('termsOfUseAccepted', '0');
  return value !== '0';
};

export const setUcellAuthPassed = async (value) => {
  return await store('ucellAuthPassed', value ? '1' : '0', value);
};

export const isUcellAuthPassed = async () => {
  const value = await load('ucellAuthPassed', '0');
  return value === '1';
};

export const setAchievementFeaturesShown = async (value) => {
  return await store('achievementFeaturesShown', value ? '1' : '0', value);
};

export const isAchievementFeaturesShown = async () => {
  const value = await load('achievementFeaturesShown', '0');

  return value !== '0';
};

export const setParentPraised = async (value) => {
  return await store('parentPraised', value ? '1' : '0', value);
};

export const isParentPraised = async () => {
  const value = await load('parentPraised', '0');
  return value !== '0';
};

export const isPremiumFeaturesShown = async () => {
  const value = await load('premiumFeaturesShown', '0');
  return value !== '0';
};

export const setPremiumFeaturesShown = async (value) => {
  return await store('premiumFeaturesShown', value ? '1' : '0', value);
};

export const setMinutesAccrued = async (value) => {
  return await store('minutesAccrued', value ? '1' : '0', value);
};

export const isMinutesAccrued = async () => {
  const value = await load('minutesAccrued', '1');
  return toBool(value);
};

export const setTryPremiumShown = async (value) => {
  return await store('tryPremiumShown', value ? '1' : '0', value);
};
//it will have string of every oid that you sent this message to, divided by ","
//example: "87083,98340,31443" - so you can get array of those thing with split() method
export const setChildOidAddDreamMessageSent = async (oid) => {
  const arrayOfOidsString = await load('ChildAddDreamMessageSent', '');
  console.log('arrayOfOidsString:', arrayOfOidsString);
  const newArray = arrayOfOidsString + ',' + oid;
  return await store('ChildAddDreamMessageSent', newArray);
};

export const isOidAddDreamMessageSend = async (oid) => {
  const arrayOfOidsString = await load('ChildAddDreamMessageSent', '');
  console.log('arrayOfOidsString:', arrayOfOidsString);
  const arrayOfOids = arrayOfOidsString.split(',');
  console.log(arrayOfOids, arrayOfOids.includes('81577'));
  return arrayOfOids.includes(oid.toString());
};

export const isTryPremiumShown = async () => {
  const value = await load('tryPremiumShown', '0');
  return value !== '0';
};

export const setOid = async (value) => {
  return await store('oid', value + '');
};

export const getOid = async () => {
  const oid = await load('oid', null);
  if (oid) {
    try {
      return parseInt(oid, 10);
    } catch (e) { }
  }
  return null;
};

export const setInstallTs = async (value) => {
  return await store('installTs', value + '');
};
export const getInstallTs = async () => {
  const ts = await load('installTs', null);
  if (ts) {
    try {
      return parseInt(ts, 10); // - 17*60*60*1000;
    } catch (e) { }
  }
  return null;
};

export const setInstallWireTs = async (value) => {
  return await store('installWireTs', value + '');
};
export const getInstallWireTs = async () => {
  const ts = await load('installWireTs', null);
  if (ts) {
    try {
      return parseInt(ts, 10); // - 17*60*60*1000;
    } catch (e) { }
  }
  return null;
};

export const setMapRegion = async (value) => {
  const region = value ? JSON.stringify(value) : null;
  return await store('mapRegion', region, value);
};

export const setMapRegionAndZoom = async (region, zoom) => {
  const reg = region ? JSON.stringify(region) : null;
  const z = zoom ? z + '' : null;
  await store('mapRegion', reg, region);
  return await store('mapZoom', z, zoom);
};

export const getMapRegion = async () => {
  const region = await load('mapRegion', null);
  if (region) {
    try {
      return JSON.parse(region);
    } catch (e) { }
  }
  return null;
};

export const setMapZoom = async (value) => {
  return await store('mapZoom', value + '', value);
};

export const getMapZoom = async () => {
  const oid = await load('mapZoom', null);
  if (oid) {
    try {
      return parseInt(oid, 10);
    } catch (e) { }
  }
  return null;
};

export const setMapLayer = async (value) => {
  return await store('mapLayer', value + '', value);
};

export const getMapLayer = async () => {
  const layer = await load('mapLayer', null);
  if (layer) {
    try {
      return parseInt(layer, 10);
    } catch (e) { }
  }
  return 2;
};

export const setWiretappingPhone = async (value) => {
  return await store('wiretappingPhone', value);
};

export const getWiretappingPhone = async () => {
  const value = await load('wiretappingPhone', '+');
  return value;
};

export const setLanguage = async (value) => {
  return await store('language', value);
};

export const getLanguage = async () => {
  const value = await load('language', null);
  return value;
};

export const setPushToken = async (value) => {
  return await store('pushToken', value);
};

export const getPushToken = async () => {
  const value = await load('pushToken', '');
  return value;
};

export const setCachedPremiumPurchased = async (value) => {
  return await store('cachedPremiumPurchased', value ? '1' : '0', value);
};

export const getCachedPremiumPurchased = async () => {
  const value = await load('cachedPremiumPurchased', '0');
  return toBool(value);
};

export const setForeverPremiumValidated = async (value) => {
  return await store('foreverPremiumValidated', value ? '1' : '0', value);
};

export const getForeverPremiumValidated = async () => {
  const value = await load('foreverPremiumValidated', '0');
  return toBool(value);
};

export const setCachedWirePurchased = async (value) => {
  return await store('cachedWirePurchased', value ? '1' : '0', value);
};

export const getCachedWirePurchased = async () => {
  const value = await load('cachedWirePurchased', '0');
  return toBool(value);
};

export const setUsingAltBackend = async (value) => {
  return await store('usingAltBackend', value ? '1' : '0', value);
};

export const switchUsingAltBackend = async () => {
  const newValue = !(await getUsingAltBackend());
  await setUsingAltBackend(newValue);
  return newValue;
};

export const getUsingAltBackend = async () => {
  const value = await load('usingAltBackend', '0');
  return toBool(value);
};

export const setGpsDialogTs = async (value) => {
  return await store('gpsDialogTs', value + '', value);
};

export const getGpsDialogTs = async () => {
  const ts = await load('gpsDialogTs', null);
  if (ts) {
    try {
      return parseInt(ts, 10);
    } catch (e) { }
  }
  return 0;
};

export const getDontShowGpsDialog = async () => {
  const value = await load('dontShowGpsDialog', '0');
  return toBool(value);
};

export const setDontShowGpsDialog = async (value) => {
  return await store('dontShowGpsDialog', value ? '1' : '0', value, value);
};

export const isFirstChildConnected = async () => {
  const value = await load('firstChildConnected', '0');
  return toBool(value);
};

export const setFirstChildConnected = async (value) => {
  return await store('firstChildConnected', value ? '1' : '0', value, value);
};

export const setPurchase_30Minutes = async (value) => {
  return await store('iap_30_minutes', value);
};

export const getPurchase_30Minutes = async () => {
  const value = await load('iap_30_minutes', '');
  return value;
};

export const setPurchase_180Minutes = async (value) => {
  return await store('iap_180_minutes', value);
};

export const getPurchase_180Minutes = async () => {
  const value = await load('iap_180_minutes', '');
  return value;
};

export const isAddHomePlaceShown = async () => {
  const value = await load('addHomePlaceShown', '0');
  return toBool(value);
};

export const setAddHomePlaceShown = async (value) => {
  return await store('addHomePlaceShown', value ? '1' : '0', value, value);
};

export const setSurveyTaken = async (value) => {
  return await store('surveyTaken', value);
};
export const getSurveyTaken = async () => {
  const value = await load('surveyTaken', '0');
  return value;
};

export const setDevHost = async (value) => {
  return await store('devHost', value);
};
export const getDevHost = async () => {
  const value = await load('devHost', '');
  return value;
};
export const getUseDevHost = async () => {
  const value = await load('useDevHost', '0');
  return toBool(value);
};
export const setUseDevHost = async (value) => {
  return await store('useDevHost', value ? '1' : '0', value, value);
};
export const getUseDevDomain = async () => {
  const value = await load('useDevDomain', '0');
  return toBool(value);
};
export const setUseDevDomain = async (value) => {
  return await store('useDevDomain', value ? '1' : '0', value, value);
};

export const getOnlineSoundPromoStartTs = async () => {
  const value = await load('onlineSoundPromoStartTs', '0');
  if (value) {
    try {
      return parseInt(value, 10);
    } catch (e) { }
  }
  return null;
};
export const setOnlineSoundPromoStartTs = async (value) => {
  return await store('onlineSoundPromoStartTs', !value ? null : value + '', value);
};

export const getOnlineSoundPromoDialogShown = async () => {
  const value = await load('onlineSoundPromoDialogShown', '0');
  return toBool(value);
};
export const setOnlineSoundPromoDialogShown = async (value) => {
  return await store('onlineSoundPromoDialogShown', value ? '1' : '0', value);
};

export const getOnlineSoundPromoBought = async () => {
  const value = await load('onlineSoundPromoBought', '0');
  return toBool(value);
};
export const setOnlineSoundPromoBought = async (value) => {
  return await store('onlineSoundPromoBought', value ? '1' : '0', value);
};

export const setUserLocationCountry = async (country) => {
  return await store('userLocationCountry', country);
};

export const getUserLocationCountry = async () => {
  return await load('userLocationCountry', null);
};

export const setUserId = async (userId) => {
  return await store('userId', JSON.stringify(userId));
};

export const getUserId = async () => {
  const userId = await load('userId', null);

  if (userId) {
    try {
      return JSON.parse(userId);
    } catch (e) { }
  }

  return null;
};

const toBool = (value) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return false;
  }
  return value !== '0';
};

export const clearAllData = () => {
  AsyncStorage.getAllKeys().then((keys) => {
    const keysToRemove = keys.filter((item) => item !== 'introShown' && item !== 'language');
    AsyncStorage.multiRemove(keysToRemove);
  });
};

// return true when stored first time
export const storeExperimentName = async (name) => {
  const fullName = 'experiment_' + name;
  const stored = toBool(await load(fullName, '0'));
  if (!stored) {
    await store(fullName, '1', true);
    return true;
  }
  return false;
};

export const loadAll = async () => {
  console.log(' === loadAll: migrate');
  await Migration.migrate();
  console.log(' === loadAll: migrate - done');

  let _all: Partial<TAll> = {};
  _all.userPhone = await getUserPhone();
  _all.userEmail = await getUserEmail();
  _all.username = await getUsername();
  _all.usernameDev = await getUsernameDev();
  _all.password = await getPassword();
  _all.passwordDev = await getPasswordDev();
  _all.introShown = await isIntroShown();
  _all.pinCodeHintShown = await isPinCodeHintShown();
  _all.termsOfUseAccepted = await isTermsOfUseAccepted();
  _all.tryPremiumShown = await isTryPremiumShown();
  _all.premiumFeaturesShown = await isPremiumFeaturesShown();
  _all.addHomePlaceShown = await isAddHomePlaceShown();
  _all.gpsDialogTs = await getGpsDialogTs();
  _all.dontShowGpsDialog = await getDontShowGpsDialog();
  _all.oid = await getOid();
  _all.installTs = await getInstallTs();
  _all.installWireTs = await getInstallWireTs();
  _all.mapRegion = await getMapRegion();
  _all.zoom = await getMapZoom();
  _all.mapLayer = await getMapLayer();
  _all.wiretappingPhone = await getWiretappingPhone();
  _all.language = await getLanguage();
  _all.pushToken = await getPushToken();
  _all.foreverPremiumValidated = await getForeverPremiumValidated();
  _all.cachedPremiumPurchased = await getCachedPremiumPurchased();
  _all.cachedWirePurchased = await getCachedWirePurchased();
  _all.usingAltBackend = await getUsingAltBackend();
  _all.parentPraised = await isParentPraised();
  _all.firstChildConnected = await isFirstChildConnected();
  _all.achievementFeaturesShown = await isAchievementFeaturesShown();
  _all.minutesAccrued = await isMinutesAccrued();
  _all.useDevHost = await getUseDevHost();
  _all.devHost = await getDevHost();
  _all.useDevDomain = await getUseDevDomain();
  _all.promoCache = await getPromoCache();
  _all.promoWebViewShown = await getPromoWebViewShown();
  _all.onlineSoundPromoStartTs = await getOnlineSoundPromoStartTs();
  _all.onlineSoundPromoDialogShown = await getOnlineSoundPromoDialogShown();
  _all.onlineSoundPromoBought = await getOnlineSoundPromoBought();
  _all.ucellAuthPassed = await isUcellAuthPassed();
  _all.userLocationCountry = await getUserLocationCountry();
  _all.restApiTokenData = await getRestApiTokenData();
  _all.restApiTokenDataDev = await getRestApiTokenDataDev();
  _all.userId = await getUserId();

  all = _all;
  UserPrefs.all = all;
  return all;
};
const UserPrefs = {
  all,
  loadAll,
  setUsername,
  getUsername,
  setUsernameDev,
  getUsernameDev,
  setUserPhone,
  getUserPhone,
  setUserEmail,
  getUserEmail,
  setPassword,
  getPassword,
  setPasswordDev,
  getPasswordDev,
  setIntroShown,
  isIntroShown,
  setPinCodeHintShown,
  isPinCodeHintShown,
  setTermsOfUseAccepted,
  isTermsOfUseAccepted,
  isUcellAuthPassed,
  setUcellAuthPassed,
  isAchievementFeaturesShown,
  setAchievementFeaturesShown,
  setOid,
  getOid,
  setInstallTs,
  getInstallTs,
  setInstallWireTs,
  getInstallWireTs,
  setMapRegion,
  setMapRegionAndZoom,
  getMapRegion,
  setMapZoom,
  getMapZoom,
  setMapLayer,
  getMapLayer,
  setWiretappingPhone,
  getWiretappingPhone,
  getLanguage,
  setLanguage,
  setPushToken,
  getPushToken,
  setForeverPremiumValidated,
  getForeverPremiumValidated,
  getCachedPremiumPurchased,
  setCachedPremiumPurchased,
  getCachedWirePurchased,
  setCachedWirePurchased,
  getUsingAltBackend,
  setUsingAltBackend,
  switchUsingAltBackend,
  isParentPraised,
  setParentPraised,
  isTryPremiumShown,
  setTryPremiumShown,
  isPremiumFeaturesShown,
  setPremiumFeaturesShown,
  getGpsDialogTs,
  setGpsDialogTs,
  getDontShowGpsDialog,
  setDontShowGpsDialog,
  isFirstChildConnected,
  setFirstChildConnected,
  getPurchase_30Minutes,
  setPurchase_30Minutes,
  getPurchase_180Minutes,
  setPurchase_180Minutes,
  isAddHomePlaceShown,
  setAddHomePlaceShown,
  setSurveyTaken,
  getSurveyTaken,
  setDevHost,
  getDevHost,
  getUseDevHost,
  setUseDevHost,
  getUseDevDomain,
  setUseDevDomain,
  isMinutesAccrued,
  setMinutesAccrued,
  getOnlineSoundPromoStartTs,
  setOnlineSoundPromoStartTs,
  getOnlineSoundPromoDialogShown,
  setOnlineSoundPromoDialogShown,
  getOnlineSoundPromoBought,
  setOnlineSoundPromoBought,
  setPromoCache,
  getPromoCache,
  setPromoWebViewShown,
  getPromoWebViewShown,
  setUserLocationCountry,
  getUserLocationCountry,
  clearAllData,
  setRestApiTokenData,
  getRestApiTokenData,
  setRestApiTokenDataDev,
  getRestApiTokenDataDev,
  setUserId,
  getUserId,
  storeExperimentName,
  getIsNotSendedAnaitycsForFirstOpen,
  setIsNotSendedAnaitycsForFirstOpen,
};

export default UserPrefs;
