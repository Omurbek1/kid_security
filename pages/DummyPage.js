import React from 'react';
import { Text, Image, StyleSheet, TouchableWithoutFeedback, View, Platform, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bindActionCreators } from 'redux';
import * as Localization from 'expo-localization';
import { connect } from 'react-redux';
import * as RNLocalize from 'react-native-localize';
import * as Font from 'expo-font';
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency';
import { Settings } from 'react-native-fbsdk-next';
import remoteConfig from '@react-native-firebase/remote-config';

import NavigationService from '../navigation/NavigationService';
import UserPrefs from '../UserPrefs';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import * as IAP from '../purchases/Purchases';
import { L, getLanguageByLocaleAndRegion, lang } from '../lang/Lang';
import { ActionCreators as WsActionCreators } from '../wire/WsMiddleware';
import * as Utils from '../Utils';
import * as oss from '../vendor/oss/oss';
import Const from '../Const';
import { NewColorScheme } from '../shared/colorScheme';
import { firebaseAnalyticsForNavigation } from '../analytics/firebase/firebase';
import { APIService } from '../Api';
import { store } from '../Store';
import { RestAPIService } from '../RestApi';
import * as Metrica from '../analytics/Analytics';
import Rest from '../Rest';
import * as RemoteConfig from '../analytics/RemoteConfig';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;
const logoDelay = Platform.OS === 'ios' ? 3000 : 2000;

class DummyPage extends React.Component {
  state = {
    percent: 0,
    hintVisible: false,
    ts: new Date().getTime(),
    withUsText: '',
  };

  isCallFinished = true;

  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  async loadFontsAsync() {
    await Font.loadAsync({
      'Helvetica-Black': require('../assets/fonts/Helvetica-Black.otf'),
      'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
      'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'Montserrat-Medium': require('../assets/fonts/Montserrat-Medium.ttf'),
      'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
    }).then(() => {
      console.log('Fonts Loaded');
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  async componentDidMount() {
    const {
      setActiveOid,
      setUsername,
      setPassword,
      setUsernameDev,
      setPasswordDev,
      setPremiumValid,
      storeSubscriptionInfo,
      setPrices,
      setProductIds,
      setIAPReady,
      setProducts,
      setShowPromoWebView,
      setSubscriptionInfoPacket,
      setIAPItemsError,
      setIsYooKassaSubscriptionExists,
      setHandTapAnimationVisible,
      showAlert,
      setUserId,
    } = this.props;

    RemoteConfig.init();
    this.loadFontsAsync();
    firebaseAnalyticsForNavigation('Dummy');
    setIAPItemsError(false);

    let isAddChildPressed = await AsyncStorage.getItem('IS_ADD_CHILD_PRESSED');
    isAddChildPressed = isAddChildPressed ? JSON.parse(isAddChildPressed) : false;
    setHandTapAnimationVisible(isAddChildPressed);

    console.log(' === DummyPage: load prefs');
    await UserPrefs.loadAll();
    console.log(' === DummyPage: load prefs - done');
    const { all } = UserPrefs;
    console.log('== REGION: detecting...');
    const userLocationCountry = (await Utils.getLocationCountry()) || UserPrefs.all.userLocationCountry;
    console.log('== REGION: ' + userLocationCountry);

    if (userLocationCountry === 'Russia') {
      console.log('== REGION: using ALT backend');
      UserPrefs.setUsingAltBackend(true);
    }

    console.log(' === DummyPage: update host');
    Const.updateHost(all.useDevHost, all.devHost, all.useDevDomain);

    if (all.useDevHost) {
      this.handleRegistration(all.usernameDev, all.passwordDev, all.restApiTokenDataDev);
    } else {
      this.handleRegistration(all.username, all.password, all.restApiTokenData);
    }

    const getObjectMapInterval = remoteConfig().getValue('get_object_map_interval').asNumber() || 10000;

    this.getChildData(false);

    setInterval(() => {
      if (this.isCallFinished) {
        this.isCallFinished = false;

        this.getChildData(true);
      }
    }, getObjectMapInterval);

    if (!all.installTs) {
      console.log(' === DummyPage: setInstallTs');
      UserPrefs.setInstallTs(new Date().getTime());
    }
    if (!all.installWireTs) {
      console.log(' === DummyPage: setInstallWireTs');
      UserPrefs.setInstallWireTs(new Date().getTime());
    }

    console.log(' === DummyPage: update lang');

    if (!all.language) {
      try {
        const region = RNLocalize.getCountry();
        const langCode = getLanguageByLocaleAndRegion(Localization.locale, region);
        console.log(' === set language by locale ' + Localization.locale + ': ' + lang);
        this.setState({ withUsText: lang[langCode].with_us });
        UserPrefs.setLanguage(langCode);
      } catch (e) {
        console.warn(e);
      }
    } else {
      this.setState({ withUsText: lang[all.language].with_us });
    }

    const trackingStatus = await getTrackingStatus();

    if (trackingStatus !== 'authorized') {
      const trackingStatusNew = await requestTrackingPermission();

      if (trackingStatusNew === 'authorized') {
        Settings.setAdvertiserTrackingEnabled(true);
      }
    }

    if (!all.promoWebViewShown) {
      console.log(' === DummyPage: show promo');
      setShowPromoWebView(true);
    }

    console.log(
      ' === PREM: purchased from cache: ' + UserPrefs.all.cachedPremiumPurchased + ', wire: ' + all.cachedWirePurchased
    );
    try {
      setPremiumValid({ PREMIUM_PURCHASED: all.cachedPremiumPurchased, WIRE_PURCHASED: all.cachedWirePurchased }, null);
    } catch (e) {
      console.warn(e);
    }

    if (all.useDevHost) {
      setUsernameDev(all.usernameDev);
      setPasswordDev(all.passwordDev);
    } else {
      setUsername(all.username);
      setPassword(all.password);
    }

    setUserId(all.userId);
    //console.log(' stored oid: ' + all.oid);
    // console.warn('Auth credits', all.username, all.password, all.oid);
    if (all.oid) {
      setActiveOid(parseInt(all.oid), true);
    }

    // wait a bit while the animation finishes

    this.timer = setTimeout(() => {
      this.setState({ hintVisible: true });
    }, logoDelay + 6000);

    this.processOssToken();
    this.checkIfPromoExist(all);

    let parentFormData = await AsyncStorage.getItem('PARENT_FORM_DATA');
    parentFormData = parentFormData ? JSON.parse(parentFormData) : null;

    if (parentFormData) {
      APIService.saveParentFormData(parentFormData);
    }

    await IAP.init(
      this,
      setPremiumValid,
      setPrices,
      setProductIds,
      storeSubscriptionInfo,
      setIAPReady,
      setProducts,
      setSubscriptionInfoPacket,
      setIAPItemsError,
      setIsYooKassaSubscriptionExists,
      showAlert
    );
  }

  handleRegistration = (username, password, restApiTokenData) => {
    if (username && password) {
      if (restApiTokenData) {
        const tokenData = JSON.parse(restApiTokenData);
        const currentDate = new Date();
        const expirationDate = new Date(tokenData.expiresAt * 1000);
        const leftHours = Math.floor(((expirationDate - currentDate) / (1000 * 60 * 60)) % 24);

        if (leftHours <= 1) {
          this.login(username, password);
        } else {
          RestAPIService.initialize();
          APIService.initialize();
          this.establishConnection();
          setTimeout(() => this.navigateAfterRegistration(), logoDelay);
        }
      } else {
        this.login(username, password);
      }
      this.initMetrics();
    } else {
      this.register();
    }
  };

  initMetrics = () => {
    const {
      all: { userId },
    } = UserPrefs;

    Metrica.setUserId(userId);
    Rest.get().init(null, null, userId);
  };

  login = (username, password) => {
    const { setRestApiTokenData, setRestApiTokenDataDev } = this.props;
    const {
      all: { useDevHost },
    } = UserPrefs;

    RestAPIService.login(username, password)
      .then((data) => {
        if (useDevHost) {
          setRestApiTokenDataDev(JSON.stringify(data));
        } else {
          setRestApiTokenData(JSON.stringify(data));
        }

        RestAPIService.initialize();
        APIService.initialize();
        this.initMetrics();
        this.establishConnection();
        setTimeout(() => this.navigateAfterRegistration(), logoDelay);
      })
      .catch((err) => console.log('Error logging user in', err));
  };

  register = () => {
    const { setUsername, setPassword, setUsernameDev, setPasswordDev, setUserId } = this.props;
    const {
      all: { useDevHost },
    } = UserPrefs;

    RestAPIService.register()
      .then((data) => {
        const { username, password, userId } = data;

        if (useDevHost) {
          setUsernameDev(username);
          setPasswordDev(password);
        } else {
          setUsername(username);
          setPassword(password);
        }

        setUserId(userId);
        this.login(username, password);
      })
      .catch((err) => console.log('Error registering user', err));
  };

  getChildData = (withInterval = false) => {
    const { getObjectMap } = this.props;

    RestAPIService.getObjectMap()
      .then((data) => {
        const objects = {};
        data.objects.map((obj) => {
          objects[obj.oid + ''] = obj;
        });

        getObjectMap(objects, store.dispatch);
        if (withInterval) this.isCallFinished = true;
      })
      .catch((err) => console.log('Error getting object on map', err));
  };

  navigateAfterRegistration = () => {
    const {
      all: { introShown },
    } = UserPrefs;

    RestAPIService.getObjectMap()
      .then((data) => {
        if (data) {
          if (!introShown) {
            StatusBar.setHidden(true);
            NavigationService.forceReplace('Intro');
          } else {
            NavigationService.forceReplace('Main');
          }
        }
      })
      .catch((err) => console.log('Error getting object on map', err));
  };

  processOssToken() {
    const { setPremiumValid, setOssToken, decryptOssToken, setAcceptTermsPhone, redeemOssToken } = this.props;
    console.log(' === DummyPage: get oss token');
    // TODO: refactor legacy
    oss.getToken().then(() => {
      console.log(' === DummyPage: got oss token');
    });
  }

  checkIfPromoExist = async (all) => {
    const { setPromoData } = this.props;
    const promoUrl = `${Utils.getApiUrl()}config/promo.json`;
    try {
      const promoDataBlob = await fetch(promoUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
      const promoData = await promoDataBlob.json();

      const { promoCache, foreverPremiumValidated } = all;
      // console.log('duummyy load promodata', promoData, promoDataBlob, !promoCache.includes(promoData.id));
      if (promoData.enabled) {
        if (promoData.condition == 'no_premium_forever' && foreverPremiumValidated) {
          setPromoData(null);
        } else {
          if (!promoCache.includes(promoData.id)) {
            setPromoData(promoData);
          }
        }
      }
    } catch (e) {
      console.error('Error while fetching promo data ' + promoUrl, e);
    }
  };

  establishConnection() {
    const { connect } = this.props;
    connect(Utils.getServerUrl(), this.onConnectionFailed.bind(this));
  }

  onConnectionFailed() {
    console.log('connection failed');
    setTimeout(() => this.establishConnection(), 1000);
  }

  onRevertDevHost() {
    UserPrefs.setUseDevHost(false);
    Const.updateHost(false);
  }
  render() {
    const { iapReady, objects } = this.props;
    const { all } = UserPrefs;
    const objectsLength = Object.keys(objects).length;

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../img/logo.gif')} />
        <View style={styles.progress}>
          <TouchableWithoutFeedback onPress={this.onRevertDevHost.bind(this)}>
            <Text style={styles.text}>{this.state.hintVisible ? L('slow_connection') : this.state.withUsText}</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { demo, authorized, userProps } = state.authReducer;
  const { iapReady, objects } = state.controlReducer;
  return {
    demo,
    authorized,
    userProps,
    iapReady,
    objects,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveOid: bindActionCreators(controlActionCreators.setActiveOid, dispatch),
    setUsername: bindActionCreators(authActionCreators.setUsername, dispatch),
    setPassword: bindActionCreators(authActionCreators.setPassword, dispatch),
    setRestApiTokenData: bindActionCreators(authActionCreators.setRestApiTokenData, dispatch),
    setUsernameDev: bindActionCreators(authActionCreators.setUsernameDev, dispatch),
    setPasswordDev: bindActionCreators(authActionCreators.setPasswordDev, dispatch),
    setRestApiTokenDataDev: bindActionCreators(authActionCreators.setRestApiTokenDataDev, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPrices: bindActionCreators(controlActionCreators.setPrices, dispatch),
    setProductIds: bindActionCreators(controlActionCreators.setProductIds, dispatch),
    setProducts: bindActionCreators(controlActionCreators.setProducts, dispatch),
    storeSubscriptionInfo: bindActionCreators(controlActionCreators.storeSubscriptionInfo, dispatch),
    setIAPReady: bindActionCreators(controlActionCreators.setIAPReady, dispatch),
    connect: bindActionCreators(WsActionCreators.connect, dispatch),
    setOssToken: bindActionCreators(controlActionCreators.setOssToken, dispatch),
    decryptOssToken: bindActionCreators(controlActionCreators.decryptOssToken, dispatch),
    setAcceptTermsPhone: bindActionCreators(controlActionCreators.setAcceptTermsPhone, dispatch),
    setPromoData: bindActionCreators(controlActionCreators.setPromoData, dispatch),
    setShowPromoWebView: bindActionCreators(controlActionCreators.setShowPromoWebView, dispatch),
    redeemOssToken: bindActionCreators(controlActionCreators.redeemOssToken, dispatch),
    redeemOssPin: bindActionCreators(controlActionCreators.redeemOssPin, dispatch),
    setSubscriptionInfoPacket: bindActionCreators(controlActionCreators.setSubscriptionInfoPacket, dispatch),
    setIAPItemsError: bindActionCreators(controlActionCreators.setIAPItemsError, dispatch),
    setIsYooKassaSubscriptionExists: bindActionCreators(
      controlActionCreators.setIsYooKassaSubscriptionExists,
      dispatch
    ),
    setHandTapAnimationVisible: bindActionCreators(controlActionCreators.setHandTapAnimationVisible, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    getObjectMap: bindActionCreators(controlActionCreators.getObjectMap, dispatch),
    setUserId: bindActionCreators(authActionCreators.setUserId, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DummyPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  progress: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 150,
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 100,
  },
  text: {
    textAlign: 'center',
    width: '70%',
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
  },
});
