import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, BackHandler, Linking, Platform, StatusBar, Dimensions, Share } from 'react-native';
import { Header } from 'react-navigation';
import appsFlyer from 'react-native-appsflyer';
import { RestAPIService } from '../RestApi';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import * as URI from 'uri-js';
import firebase from '@react-native-firebase/app';
import * as Utils from '../Utils';

import Rest from '../Rest';
import * as oss from '../vendor/oss/oss';
import MapMarker from '../components/MapMarker';
import TryPremiumLabel from '../components/TryPremiumLabel';
import { controlActionCreators } from '../reducers/controlRedux';
import { ActionCreators as wsActionCreators } from '../wire/WsMiddleware';
import { authActionCreators } from '../reducers/authRedux';
import MenuItem from '../components/MenuItem';
import BottomTab from '../components/BottomTab';
import MapZoomPanel from '../components/MapZoomPanel';
import TryPremiumPane from '../components/TryPremiumPane';
import NavigationService from '../navigation/NavigationService';
import AddPhonePane from '../components/AddPhonePane';
import AcceptTermsPane from '../components/AcceptTermsPane';
import {
  underConstruction,
  CustomProgressBar,
  getZoomFromRegion,
  getRegionForZoom,
  isTrialExpired,
  getCoordInfo,
  getServerUrl,
  getConfigurationAlets,
  maxZoomForLayer,
  getUrlParams,
} from '../Utils';
import UserPrefs, { isUrlActivation } from '../UserPrefs';
import Const from '../Const';
import * as Metrica from '../analytics/Analytics';
import { L } from '@lang';
import * as IAP from '../purchases/Purchases';
import { ActionCreators as controlMiddlewareActionCreators } from '../wire/ControlMiddleware';
import NeedPremiumPane from '../components/NeedPremiumPane';
import ThanksForPurchasePane from '../components/ThanksForPurchasePane';
import ShareAppPane from '../components/ShareAppPane';
import PushNotificationsService from '../PushNotificationsService';
import { getOnTapActionByNotificationKind, getOnNotificationAction } from '../OnTapActionService';

import '@react-native-firebase/dynamic-links';
import CoronaSharePane from '../components/CoronaSharePane';
import ShareAboutBlock from '../components/molecules/ShareAboutBlock';
import ChildDataPane from '../components/organisms/ChildDataPane';
import MapChildMarker from '../components/molecules/MapChildMarker';
import AdvantagesPane from '../components/organisms/AdvantagesPane';
import { GetProductInfo } from '../purchases/PurchasesInterface';
import PinCodePane from '../components/PinCodePane';
import InviteFriendDialog from '../components/organisms/InviteFriendDialog';
import PinCodeDialog from '../components/organisms/PinCodeDialog';
import PinCodeHintDialog from '../components/organisms/PinCodeHintDialog';
import { popupActionCreators } from '../reducers/popupRedux';
import PinCodeHintDetailDialog from '../components/organisms/PinCodeHintDetailDialog';
import { PremiumModal, ActiveFreeTrialModal, AddChildComponent, PurchaseStateModals } from '../components';
import { APIService } from '../Api';

import { demoObject } from './DemoMapPage/demoObject';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { MapScreenFirebaseAnalytics, firebaseAnalitycsLogEvent } from '../analytics/firebase/firebase';
import DialogConnectChild from './DialogConnectChild';

import DialogConnectChildSendTigrowModal from './DialogConnectChildSendTigrow';
import DialogConnectChildTigrowCodeModal from './DialogConnectChildTigrowCodeModal';
import DialogConnectChildBottomSheet from './DialogConnectChildBottomSheet';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import Clipboard from '@react-native-clipboard/clipboard';
const HEADER_HEIGHT = Header.HEIGHT;
const { width, height } = Dimensions.get('window');

const EXPERIMENT = {
  experiment_id: 'ChildConnect001',
  onCodeTapAction: 'onCodeTapAction',
  noAction: 'noAction',
  codeCopiedToClipboardMessage: 'codeCopiedToClipboardMessage',
  systemDialog: 'systemDialog',
  screenAddPhoneArrowDownPress: 'screenAddPhoneArrowDownPress',
  screenAddPhoneCodePress: 'screenAddPhoneCodePress',
  screenAddPhoneConnectChildBtnPress: 'screenAddPhoneConnectChildBtnPress',
};

class MapPage extends React.Component {
  state = {
    demoObjectVer: 0,
    isProgress: false,
    termsOfUseAccepted: false,
    isParentPraised: true,
    visiblePopups: {},
    tryPremiumShown: false,
    needPremiumVisible: false,
    shareAppVisible: false,
    tryPremiumPaneVisible: false,
    shareCoronaEventVisible: false,
    advantagesPaneVisible: false,
    salePane: false,
    country: '',
    modalVisible: false,
    modalVisibleSendTigrow: false,
    DialogConnectChildTigrowCodeModalState: false,
    bottomSheetVisible: false,
    code: null,
    codeStatus: null,
    onCodeTapAction: 'onCodeTapAction',
  };

  static _toggleCoordMode;
  static _gotoChat;
  static _shareAppAndTest;

  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };

  UNSAFE_componentWillMount() {
    const { all } = UserPrefs;

    window.setActiveOidAndCenter = this.setActiveOidAndCenter.bind(this);

    this.zoom = all.zoom;
    if (!this.zoom) {
      this.zoom = 18;
    }

    this.region = all.mapRegion;
    if (!this.region) {
      this.region = getRegionForZoom(Const.DEFAULT_LAT, Const.DEFAULT_LON, Const.DEFAULT_ZOOM);
    }
    demoObject.setPosition(this.region.latitude, this.region.longitude);

    //console.log( ' =================== got region: ' + this.region);

    const touAccepted = all.termsOfUseAccepted;
    const isParentPraised = all.parentPraised;
    const tryPremiumShown = all.tryPremiumShown;
    this.setState({
      termsOfUseAccepted: touAccepted,
      isParentPraised: isParentPraised,
      tryPremiumShown: tryPremiumShown,
    });
  }

  async componentDidMount() {
    const { premium, clearFirstMapShow, setUserAdId, linkInviteToken, setPremiumValid, setTabBarHistory }: any =
      this.props;

    //INTERVAL TO KEEP TRACK OF CHILDCODE STATUS
    this.timerID = setInterval(() => this.codeCheckTick(), 1000) as unknown as number;

    //INTERVAL TO REQUEST CHILD CODE IF API ISN't INITIALIZED
    //AS SOON AS API RE-INITIALIZED KILLING THIS INTERVAL
    //IF API INITIALIZED JUST REQUESTING CHILD CODE
    this.getChildCode();

    setTimeout(() => {
      // addPhoneTracker();
      activateKeepAwake();
    }, 0);

    setTabBarHistory([L('map')]);

    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });

    this.getProductsRussia();
    this.getYooKassaSubscriptions();

    _shareAppAndTest = this.shareAppAndTest.bind(this);
    _gotoChat = this.gotoChat.bind(this);
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

    if (UserPrefs.all.termsOfUseAccepted) {
      this.setupPushNotifications();
      const isUcellClientWithWiFi = await oss.checkUcellClientByWiFi();
      if (isUcellClientWithWiFi && !UserPrefs.all.ucellAuthPassed) {
        UserPrefs.setTermsOfUseAccepted(false);
        this.setState({ termsOfUseAccepted: false });
      }
    }

    if (premium) {
      if (premium.overriden || !isTrialExpired(premium)) {
        // mark trial state for later checking in IAP
        IAP.setTrialExpiredHint(false);
        setPremiumValid({ PREMIUM_PURCHASED: true, WIRE_PURCHASED: null }, null);
      }
    }
    this.pickMapLayer(UserPrefs.all.mapLayer);
    clearFirstMapShow();

    this.storeUserPhoneAndEmail();
    appsFlyer.getAppsFlyerUID((error, appsFlyerUID) => {
      setUserAdId(
        {
          adid: appsFlyerUID,
          os: Platform.OS == 'ios' ? 1 : 0,
        },
        function (a, b) {
          //console.log(a, b);
        }
      );
    });
    Notifications.addNotificationReceivedListener((n) => {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n\r', n);
      if (!n || !n.data) {
        return;
      }

      const { kind, objectId, message, title, data } = n.data;

      if (kind === 'ONLINE_SOUND_BONUS') {
        PushNotificationsService.showNotification(L('menu_wiretapping'), message);
      }

      if (n.origin === 'received' && data) {
        const notificationData = JSON.parse(n.data.data);

        this.props.setActiveOid(notificationData.oid);
        const onTapAction = getOnTapActionByNotificationKind(notificationData);
        const onNotificationAction = getOnNotificationAction(notificationData);
        PushNotificationsService.showNotification(title, message, onTapAction);

        onNotificationAction();
      }

      if (n.origin !== 'selected') {
        return;
      }

      if (kind === 'TEXT_MESSAGE' || kind === 'VOICE_MAIL') {
        if (n.data.hidden) {
          NavigationService.navigate('Wiretapping', { oid: objectId });
        } else {
          NavigationService.navigate('Chat', { isFromScreen: true });
        }
      } else if (kind === 'ALARM') {
        this.setActiveOidAndCenter(objectId);
      } else if (kind === 'RAW') {
        const notificationData = JSON.parse(n.data.data);

        this.props.setActiveOid(notificationData.oid);
        const onTapAction = getOnTapActionByNotificationKind(notificationData);
        onTapAction ? onTapAction() : console.log(error);
        console.warn('action:', onTapAction);
      }
    });
    firebase
      .dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          const url = link.url;
          console.log(' !!!! DEEP_LINKING: ' + url);
          const { action, initiator, token } = getUrlParams(URI.parse(url).query);
          //console.log(' :: DEEP_LINKING:' + action + ', ' + initiator + ', ' + token);
          if (action === 'invite') {
            linkInviteToken({ initiator, token }, function (pr, packet) {
              //console.log(' :: linkInviteToken: ', packet);
            });
          }
        }
      });
    const { objects, activeOid } = this.props;
    const obj = objects[activeOid + ''];
    //console.log('object:', obj);
    setTimeout(() => {
      this.mapCenter(obj.lat, obj.lon);
      this.getPositionAndCenterOnDemo();
    }, 500);

    Linking.addEventListener('url', (deeplink) => {
      console.log(' !!!! URL_DEEP_LINKING: ' + deeplink.url);
      this.processDeepLinking(deeplink.url);
    });

    const deeplink = await Linking.getInitialURL();
    if (deeplink) {
      console.log(' !!!! URL_DEEP_LINKING: INITIAL: ' + deeplink);
      this.processDeepLinking(deeplink);
    }

    this.getPositionAndCenterOnDemo(true);
    demoObject.name = L('example');

    //NavigationService.navigate('FreeMinutes', { oid: UserPrefs.all.activeOid })
  }
  //CHECKING CHILD CODE STATUS
  codeCheckTick() {
    if (this.state.code) {
      RestAPIService.checkChildCode(this.state.code)
        .then((res) => this.setState({ codeStatus: res.status }))
        .catch((err) => console.log('Error checking child code', err));
    }
  }

  experimentShare = () => {
    switch (this.state.onCodeTapAction) {
      case EXPERIMENT.codeCopiedToClipboardMessage:
        Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
        this.setState({ visible: true });

        break;
      case EXPERIMENT.systemDialog:
        this.shareLinkViaSystemDialog();
        break;
    }
  };

  shareLinkViaSystemDialog = () => {
    Share.share(
      {
        message: L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]),
      },
      {}
    );
  };

  onArrowClick = () => {
    Metrica.event(EXPERIMENT.screenAddPhoneArrowDownPress);
    this.experimentShare();
  };

  onCodeClick = () => {
    Clipboard.setString(L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]));
    Metrica.event(EXPERIMENT.screenAddPhoneCodePress);
    // this.experimentShare();
    this.setState({ copiVisible: true });
  };

  getProductsRussia = () => {
    const { setProductsRussia } = this.props;

    APIService.getProductsRussia()
      .then((res) => {
        const { products } = res;

        setProductsRussia(products);
      })
      .catch((err) => console.log('Error getting products for Russia', err));
  };

  getYooKassaSubscriptions = () => {
    const { setYooKassaSubscriptions } = this.props;

    APIService.getYooKassaSubscriptions()
      .then((res) => {
        const { subscriptions } = res;

        setYooKassaSubscriptions(subscriptions);
      })
      .catch((err) => console.log('Error getting user subscriptions', err));
  };

  processDeepLinking(link) {
    if (!link) {
      return;
    }
    const arr = link.split('://');
    if (arr.length < 2) {
      return;
    }

    const url = new URL('http://z.zzz/' + arr[1]);
    switch (url.pathname) {
      case '/activate': {
        this.tryActivatePremium(url);
        break;
      }
    }
  }

  tryActivatePremium(url) {
    const code = url.searchParams.get('q');
    if (!code) {
      return; // alert('no code!');
    }

    const { activatePremium, providerPremium }: any = this.props;

    isUrlActivation().then((e) => {
      if (!e) {
        !providerPremium &&
          activatePremium(code, (pr, packet) => {
            if (packet && packet.data && packet.data.result == 0) {
              NavigationService.navigate('ActivationSuccess');
            } else {
              const errorCode = packet && packet.data ? packet.data.error : -1;
              NavigationService.navigate('ActivationFail', { secret: code, errorCode });
            }
          });
      }
    });
  }
  private timerID: number | undefined | string;
  private reqChildCode: number | undefined;
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
    const { addPhoneCode, stopAddPhoneTracker, clearAddPhoneCode } = this.props as any;
    clearInterval(this.timerID);
    clearInterval(this.reqChildCode);
    deactivateKeepAwake();
    if (addPhoneCode) {
      setTimeout(() => {
        clearAddPhoneCode();
        stopAddPhoneTracker();
      }, 0);
    }
  }
  componentDidUpdate() {
    Clipboard;
    if (APIService.baseHeader.Username && this.reqChildCode && !this.state.code) {
      clearInterval(this.reqChildCode);
    }
  }

  handleBackButton() {
    const {
      premiumThanksVisible,
      setPremiumThanksVisible,
      isActiveFreeTrialModalVisible,
      setActiveFreeTrialModalVisible,
    }: any = this.props;
    const {
      needPremiumVisible,
      advantagesPaneVisible,
      shareAppVisible,
      shareCoronaEventVisible,
      tryPremiumPaneVisible,
    } = this.state;

    const pageName = NavigationService.currentPageName();
    if (pageName === 'Main') {
      if (needPremiumVisible) {
        this.setState({ needPremiumVisible: false });
        return true;
      } else if (premiumThanksVisible) {
        setPremiumThanksVisible(false);
        return true;
      } else if (isActiveFreeTrialModalVisible) {
        setActiveFreeTrialModalVisible(false);
        return true;
      } else if (advantagesPaneVisible) {
        this.setState({ advantagesPaneVisible: false });
        return true;
      } else if (shareCoronaEventVisible) {
        this.setState({ shareCoronaEventVisible: false });
        return true;
      } else if (tryPremiumPaneVisible) {
        this.setState({ tryPremiumPaneVisible: false });
        return true;
      } else if (shareAppVisible) {
        this.setState({ shareAppVisible: false });
        return true;
      }
      // BackHandler.exitApp();
      return true;
    }
    return false;
  }

  gotoChat() {
    const { activeOid }: any = this.props;
    if (!activeOid) {
      return;
    }
    NavigationService.navigate('Chat', { isFromScreen: true });
  }

  onRegionChange(region) {
    this.region = { ...region };
    this.zoom = getZoomFromRegion(region);
    UserPrefs.setMapRegionAndZoom(this.region, this.zoom);
  }

  mapZoomIn() {
    const { mapLayer } = this.props;
    this.zoom++;
    if (this.zoom > 18) {
      this.zoom = 18;
    }
    const maxZoom = maxZoomForLayer(mapLayer);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
    }
    const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
    this.map?.animateToRegion(region, 200);
  }

  mapZoomOut() {
    this.zoom--;
    if (this.zoom < 3) {
      this.zoom = 3;
    }
    const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
    //console.log('zoom out: ' + this.zoom);
    //console.log(region);
    this.map?.animateToRegion(region, 200);
  }

  mapCenter(lat, lon) {
    //console.log(' -------------------- center map: ' + lat, lon);
    if (!lat || !lon || lat === 0 || lon === 0) {
      return;
    }
    const region = getRegionForZoom(lat, lon, Const.DEFAULT_ZOOM);
    this.map?.animateToRegion(region, 200);
  }

  onLanguage() {
    underConstruction();
  }

  onAbout() {
    NavigationService.navigate('About');
  }

  setRandomOidAndCenter() {
    const { objects } = this.props;
    let oid = null;
    for (let i in objects) {
      oid = objects[i].oid;
      break;
    }
    this.setActiveOidAndCenter(oid);
  }

  setActiveOidAndCenter(oid) {
    console.log('call set oid');
    const { setActiveOid, objects, coordMode, addrMap, wifiAddrMap } = this.props;
    const object = objects[oid + ''];
    if (object) {
      const coordInfo = getCoordInfo(coordMode, object, addrMap, wifiAddrMap);
      this.mapCenter(coordInfo.lat, coordInfo.lon);
    }
    setTimeout(() => {
      setActiveOid(oid);
    }, 0);
    //setActiveOid(oid);
  }

  shareAppAndTest() {
    this.setState({ shareAppVisible: true });
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onAddPhone = async () => {
    console.log('===== init demomappage: ++++ true,true');
    await AsyncStorage.setItem('IS_ADD_CHILD_PRESSED', JSON.stringify(true));
    this.setState({ modalVisible: true });

    // NavigationService.navigate('AddPhone', {
    //   backTo: 'Main',
    //   forceReplace: true,
    //   disableBackButton: true /*
    //   setActiveOidAndCenter: this.setActiveOidAndCenter.bind(this),*/,
    // });
  };

  async storeUserPhoneAndEmail() {
    const { setUserProperty, modifyUserProperty } = this.props;

    const userPhone = UserPrefs.all.userPhone;
    const userEmail = UserPrefs.all.userEmail;
    if (!userPhone || userPhone === '') {
      return;
    }

    setUserProperty('phoneNumber', userPhone, async (pr, d) => {
      const data = d.data;
      if (data.result === 0) {
        modifyUserProperty('placeEventsDisabled', userPhone);
        await UserPrefs.setUserPhone('');
      }
    });
    if (userEmail && userEmail !== '') {
      setUserProperty('email', userEmail, async (pr, d) => {
        const data = d.data;
        if (data.result === 0) {
          modifyUserProperty('placeEventsDisabled', userEmail);
          await UserPrefs.setUserEmail('');
        }
      });
    }
  }

  setupUcellAuth = async () => {
    const { setPremiumValid, setShowPinCodePane, setOssPinData, sendOssPin } = this.props;
    const { userPhone } = this.state;
    // const isUcellClient = await this.checkUcellClient();
    const isUcellClientWithWiFi = await oss.checkUcellClientByWiFi();

    if (isUcellClientWithWiFi && !UserPrefs.all.ucellAuthPassed) {
      if (oss.isUcellPhoneNumber(userPhone)) {
        const requestPin = await fetch('http://uztds.com/sXdeIj6cv5/?landing_id=96&operator_id=432');
        const url = requestPin.url + '';
        const key = url.match(/\?key=(.*)/)[1];
        sendOssPin({ key: key, msisdn: userPhone.replace('+', '') }, (pr, packet) => {
          const { data } = packet;
          Rest.get().debug({ OSS: 'sendOssPin', data });

          if (data.result === 0) {
            console.log('sendOssPin: data success', data, data.token);
            if (data.alreadySubscribed) {
              UserPrefs.setUcellAuthPassed(true);
              UserPrefs.setCachedPremiumPurchased(true);
              setPremiumValid({ PREMIUM_PURCHASED: true, WIRE_PURCHASED: null }, null);
            } else {
              const ossPinToken = data.token;
              setShowPinCodePane(true);
              setOssPinData({ ossPinToken, ossMsisdn: userPhone, ossPin: '' });
            }
          }
        });
      }
    }
  };

  async onAcceptTermsOfUse() {
    const { userPhone, userEmail } = this.state;
    const { iapReady } = this.props;

    Metrica.event('funnel_terms_accepted', { userPhone });

    await UserPrefs.setUserPhone(userPhone);
    await UserPrefs.setUserEmail(userEmail);
    await UserPrefs.setTermsOfUseAccepted(true);

    if (userPhone && userPhone.length === 12) {
      const a = userPhone.substring(2, 12);
      const phoneNumberChanged =
        '(' + a.slice(0, 3) + ') ' + a.slice(3, 6) + '-' + a.slice(6, 8) + '-' + a.slice(8, 10);

      await AsyncStorage.setItem('PAYMENT_PHONE_NUMBER', phoneNumberChanged);
    }

    if (userEmail) await AsyncStorage.setItem('PAYMENT_EMAIL', userEmail);
    this.setState({ termsOfUseAccepted: true });
    this.setupUcellAuth();
    this.storeUserPhoneAndEmail();

    if (iapReady) {
      this.showTryPremium();
    }

    setTimeout(() => this.setupPushNotifications(), 2000);
    this.getPositionAndCenterOnDemo();
  }

  onExitDemo() {
    const { setDemo, connect, disconnect } = this.props;

    disconnect(false);
    setTimeout(() => {
      setDemo(false);
      connect(getServerUrl());
    }, 1000);
  }

  goToPremium() {
    NavigationService.navigate('PremiumFeatures');
  }

  findUnreliableLocationByIp = async () => {
    return fetch('http://ip-api.com/json/?fields=status,lat,lon', { headers: { 'Cache-Control': 'no-store' } })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.status === 'success' && json.lat && json.lon) {
          const { lat, lon } = json;
          return {
            coords: {
              latitude: lat,
              longitude: lon,
            },
          };
        }
      });
  };

  findCoordinates = async (skipGpsIfNoPermission): Promise<Location.LocationData> => {
    const stub = {
      coords: {
        latitude: Const.DEFAULT_LAT,
        longitude: Const.DEFAULT_LON,
      },
    };
    let savedLocation = await AsyncStorage.getItem('CURRENT_LOCATION');
    savedLocation = savedLocation ? JSON.parse(savedLocation) : null;

    const iplocation = await this.findUnreliableLocationByIp();
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      if (skipGpsIfNoPermission === true) {
        return savedLocation ? savedLocation : iplocation ? iplocation : stub;
      }
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return savedLocation ? savedLocation : iplocation ? iplocation : stub;
      }
    }

    const enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      console.error('Error getting current position - services disabled');
      return savedLocation ? savedLocation : iplocation ? iplocation : stub;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      if (!location) {
        return savedLocation ? savedLocation : iplocation ? iplocation : stub;
      }

      AsyncStorage.setItem('CURRENT_LOCATION', JSON.stringify(location));

      return location ? location : stub;
    } catch (e) {
      console.error('Error getting current position', e);
      return savedLocation ? savedLocation : iplocation ? iplocation : stub;
    }
  };

  pickMapLayer(index) {
    const { setMapLayer } = this.props;
    console.log(' pick map = ' + index);
    setMapLayer(index);

    const maxZoom = maxZoomForLayer(index);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
      const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
      //this.map.animateToRegion(region, 0);
    }
  }

  onSpeakerPress() {
    const { activeOid, premium, premiumReallyPaid } = this.props;
    const locked = !premiumReallyPaid && !premium.overriden;
    if (locked) {
      return this.needPremiumDialog();
    }
    NavigationService.navigate('Buzzer', { oid: activeOid });
  }

  onStatsClick() {
    const { activeOid, premium, premiumReallyPaid } = this.props;
    const locked = !premiumReallyPaid && !premium.overriden;
    if (locked) {
      return this.needPremiumDialog();
    }
    console.log(activeOid);
    NavigationService.navigate('Stats', { oid: activeOid });
  }

  onTrackHistoryClick() {
    const { activeOid, premium, premiumReallyPaid, objects } = this.props;
    const locked = !premiumReallyPaid && !premium.overriden;
    if (locked) {
      return this.needPremiumDialog();
    }
    let object = objects[activeOid + ''];
    if (!object) {
      object = { photoUrl: null };
    }
    NavigationService.navigate('TrackHistory', { oid: activeOid, photoUrl: object.photoUrl });
  }

  onWiretappingClick() {
    const { activeOid } = this.props;
    NavigationService.navigate('Wiretapping', { oid: activeOid });
  }

  onRefreshBalance() {
    const { activeOid, executeUssdRequest, objects } = this.props;

    let activeObject = {
      props: {
        ussdBalanceRequest: null,
      },
    };
    const obj = objects[activeOid + ''];
    activeObject = obj ? obj : activeObject;
    const { ussdBalanceRequest } = activeObject.props;
    if (!ussdBalanceRequest) {
      NavigationService.navigate('SetupBalance', { oid: activeOid });
      return;
    }

    const hideProgressbar = this.hideProgressbar;
    this.openProgressbar(L('requesting_balance'));
    executeUssdRequest(activeOid, ussdBalanceRequest, (pr, packet) => {
      hideProgressbar();
      const { data } = packet;
      //console.log(data);
    });
  }

  hideObjectPopup(oid, bHide) {
    console.log('hideObjectPopup: oid=' + oid + ', bHide=' + bHide);
    var visible = { ...this.state.visiblePopups };
    if (bHide) {
      delete visible[oid + ''];
    } else {
      visible[oid + ''] = true;
    }
    this.setState({ visiblePopups: visible });
  }

  showTryPremium() {
    const { premiumReallyPaid } = this.props;

    if (premiumReallyPaid) {
      return;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log(' DEMO map page rcv props');

    if (nextProps.iapReady) {
      this.showTryPremium();
    }

    if (nextProps.phoneLinked) {
      if (!UserPrefs.all.firstChildConnected) {
        setTimeout(() => {
          Metrica.event('funnel_first_child_connected');
          UserPrefs.setFirstChildConnected(true);
          Metrica.logChildConnected();
        }, 0);
      }
    }
  }

  onLanguageSelect(lang) {
    Metrica.event('funnel_lang', { lang });
    UserPrefs.setLanguage(lang);
    this.setState({ now: new Date().getTime() });
  }

  getPositionAndCenterOnDemo(skipGpsIfNoPermission) {
    if (!this.state.termsOfUseAccepted && skipGpsIfNoPermission !== true) {
      return;
    }
    const getPositionAndCenter = async () => {
      const { coords } = await this.findCoordinates(skipGpsIfNoPermission);
      const { latitude, longitude } = coords;
      demoObject.setPosition(latitude, longitude);
      this.mapCenter(latitude, longitude);
      this.setState({ demoObjectVer: this.state.demoObjectVer + 1 });
    };
    getPositionAndCenter();
    this.setActiveOidAndCenter(demoObject.oid);
  }

  onPhoneChanged(userPhone) {
    this.setState({ userPhone });
  }

  onEmailChanged(userEmail) {
    this.setState({ userEmail });
  }

  onConfirmParentPraising() {
    Metrica.event('funnel_praise_pane');
    this.setState({ isParentPraised: true });
    UserPrefs.setParentPraised(true);
  }

  needPremiumDialog() {
    this.setState({ needPremiumVisible: true });
  }

  async setupPushNotifications() {
    const { setPushToken } = this.props;
    let token = null;

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
      Metrica.event('funnel_push_permission', { granted: finalStatus === 'granted' });
    }
    // Stop here if the user did not grant permissions
    const pushPermGranted = finalStatus === 'granted';
    if (pushPermGranted) {
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('alert', {
          name: 'alert',
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      try {
        token = await Notifications.getDevicePushTokenAsync();
      } catch (err) {
        console.warn(err);
      }
      if (token && token.data) {
        //console.log(' got token: ' + token.data);
        setPushToken(token.data);
      }
      // do not clear badge counter on startup
      // Notifications.setBadgeNumberAsync(0);
    }
  }

  onShowHidePremiumModal = () => {
    const { iapItemsError, isPremiumModalVisible, showPremiumModal, showAlert } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      showPremiumModal(!isPremiumModalVisible);
    }
  };

  onShowSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal } = this.props;

    showSuccessfulSubscriptionModal(true);
  };

  toggleBottomSheet = () => {
    this.setState({ bottomSheetVisible: !this.state.bottomSheetVisible });
    this.setState({ modalVisibleSendTigrow: !this.state.modalVisibleSendTigrow });
    const params = {
      modal_name: 'ManuelConnect',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('modal_open', params as never, true);
  };
  //REQUEST CHILD CODE
  getChildCode = () => {
    if (!this.state.code || !this.state.codeStatus) {
      RestAPIService.getChildCode()
        .then((res) => this.setState({ code: res.code }))
        .catch((err) => console.log('Error getting child code', err));
    }
    console.log(' code: ' + this.state.code);
  };

  //Dialog Window

  DialogConnectChildModal = () => {
    this.setState({ modalVisible: true });
    const params = {
      modal_name: 'ParentPhoneReady',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('modal_open' as never, params as never, true);
  };
  DialogConnectChildModalClose = () => {
    this.setState({ modalVisible: false });
    const params = {
      modal_name: 'ParentPhoneReady',
      object: 'back_button',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('tap_back', params, true);
  };
  DialogConnectChildSecondModalClose = () => {
    this.setState({ modalVisible: true });
    this.setState({ modalVisibleSendTigrow: false });
    const params = {
      modal_name: 'SendLinkToTigrow',
      object: 'back_button',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('tap_back' as never, params as never, true);
    console.log('tap_back', params);
  };
  DialogConnectChildModalSendtoTigrow = () => {
    this.setState({ modalVisible: false });
    this.setState({ modalVisibleSendTigrow: true });
  };

  DialogConnectChildModalSendtoTigrowonShare = async () => {
    try {
      // Metrica.event('funnel_share_code', { code: addPhoneCode });
      const params = {
        modal_name: 'SendLinkToTigrow',
        screen_name: 'mapScreenDemo',
      };
      firebaseAnalitycsLogEvent('modal_open', params as never, true);
      const param = {
        modal_name: 'connectChildCode',
        screen_name: 'mapScreenDemo',
      };
      firebaseAnalitycsLogEvent('modal_open', param as never, true);
      Share.share({
        message: L('please_install_app_to_kid_phone', [Utils.getKidAppUrl(), this.state.code]),
      });
      this.setState({ DialogConnectChildTigrowCodeModalState: true });
      this.setState({ modalVisibleSendTigrow: false });
    } catch (error: unknown) {
      console.warn('Error opening chat with tech support', error);
    }
  };

  CloseDialogConnectChildModalSendtoTigrowonShare = () => {
    this.setState({ DialogConnectChildTigrowCodeModalState: false });
    this.setState({ modalVisibleSendTigrow: true });

    const params = {
      modal_name: 'connectChildCode',
      object: 'back_button',
      screen_name: 'mapScreenDemo',
    };
    firebaseAnalitycsLogEvent('tap_back', params, true);
  };
  render() {
    //console.log('refresh map');
    const {
      objects,
      activeOid,
      objectsLoaded,

      addrMap,
      wifiAddrMap,
      coordMode,
      premium,
      mapLayer,
      username,
      premiumThanksVisible,
      setPremiumThanksVisible,
      isActiveFreeTrialModalVisible,
      setActiveFreeTrialModalVisible,
      notifyAppShared,
      showPinCodePane,
      setShowPinCodePane,
      iapItemsError,
      isHandTapAnimationVisible,
      isPremiumModalVisible,
      showAlert,
      alertObj,
      addPhoneCode,
    }: any = this.props;
    const {
      termsOfUseAccepted,
      isParentPraised,
      modalVisible,
      modalVisibleSendTigrow,
      DialogConnectChildTigrowCodeModalState,
      bottomSheetVisible,
    } = this.state;

    let activeObject = {
      voltage: 0,
      lat: 0,
      lon: 0,
      states: {
        dndEnabled: '0',
      },
    };

    if (typeof activeOid === 'number' && activeOid >= 0) {
      const obj = objects[activeOid + ''];
      activeObject = obj ? obj : activeObject;
    }
    let objectCount = Object.keys(objects).length;
    const activeInfo = getCoordInfo(coordMode, activeObject, addrMap, wifiAddrMap);
    const noGpsData = objectCount > 0 && (Math.floor(activeObject.lat) === 0 || Math.floor(activeObject.lon) === 0);
    const alertPaneVisible = objectCount > 0 && getConfigurationAlets(activeObject).hasAlert;
    const trialExpired = isTrialExpired(premium);
    const productInfo = this.props.products
      ? GetProductInfo('THREEMONTHLY_PREMIUM_WITH_DEMO', this.props.products)
      : {};
    const statusBarHeight = Constants.statusBarHeight;

    return (
      <View style={styles.mapcontainer}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        <MapView
          ref={(ref) => (this.map = ref)}
          mapType={mapLayer === 1 ? 'hybrid' : 'standard'}
          style={{ flex: 1, width: '100%' }}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          initialRegion={this.region}>
          {mapLayer === 2 || mapLayer === 3 ? (
            <MapView.UrlTile zIndex={Const.TILE_Z_INDEX} urlTemplate={Const.MAP_URL_TEMPLATES[mapLayer]} />
          ) : null}

          {Object.values(objects).map((marker) => {
            //console.log('render: ' + marker.oid);
            const coordInfo = getCoordInfo(coordMode, marker, addrMap, wifiAddrMap);
            const markerKey = marker.oid + this.state.demoObjectVer * (marker.oid == activeOid ? 1000 : 0);
            const active = marker.oid == activeOid;
            return (
              <MapMarker
                zIndex={active ? 100 : 0}
                anchor={{ x: 0.5, y: 1.0 }}
                centerOffset={{ x: 0, y: Const.MAP_MARKER_Y_OFFSET }}
                style={styles.marker}
                key={markerKey}
                coordinate={{ latitude: coordInfo.lat, longitude: coordInfo.lon }}
                onPress={() => {
                  this.setActiveOidAndCenter(marker.oid);
                  this.hideObjectPopup(marker.oid, false);
                  console.log(marker.photoUrl);
                  MapScreenFirebaseAnalytics.addChildMapPin();
                  this.onAddPhone();
                }}>
                <MapChildMarker
                  infoBuble={active}
                  childData={marker}
                  photoUrl={marker.photoUrl}
                  isExample={true}
                  onAddChild={this.onAddPhone.bind(this)}
                />
              </MapMarker>
            );
          })}
        </MapView>
        <View style={styles.topPanel}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, position: 'relative' }}>
            <ShareAboutBlock
              style={{
                top: statusBarHeight + 5,
                position: 'absolute',
                right: 0,
                paddingRight: 5,
              }}
              onSettingsPress={() =>
                NavigationService.navigate('Settings', {
                  backTo: 'DemoMap',
                  oid: activeOid,
                  setRandomOidAndCenter: this.setRandomOidAndCenter.bind(this),
                  setActiveOidAndCenter: this.setActiveOidAndCenter.bind(this),
                })
              }
            />
          </View>
          <View style={styles.tryPremiumLabelWrapper}>
            <TryPremiumLabel
              price={productInfo && productInfo.introductoryPrice}
              timerLabel={this.props.tryPremiumTimerLabel}
              visible={
                false
                /*!premiumReallyPaid &&
                !trialExpired &&
                this.props.tryPremiumTimerLabel &&
                this.props.iapReady &&
                !premium.overriden*/
              }
              // visible={true}
              onPress={() => {
                if (iapItemsError && this.state.country !== 'Russia') {
                  showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
                } else {
                  this.setState({ advantagesPaneVisible: true });
                }
              }}
            />
          </View>
        </View>
        <BottomTab>
          <View
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              right: width / 21,
              marginBottom: 10,
            }}>
            <DialogConnectChild
              visible={modalVisible}
              onClose={this.DialogConnectChildModalClose}
              onOpenSecondModal={this.DialogConnectChildModalSendtoTigrow} //this.onAddPhone.bind(this)}
            />
            <DialogConnectChildSendTigrowModal
              visible={modalVisibleSendTigrow}
              onClose={this.DialogConnectChildSecondModalClose}
              onShare={this.DialogConnectChildModalSendtoTigrowonShare}
              useOtherMethod={this.toggleBottomSheet}
            />
            <DialogConnectChildBottomSheet toggleModal={this.toggleBottomSheet} isModalVisible={bottomSheetVisible} />

            <DialogConnectChildTigrowCodeModal
              visible={DialogConnectChildTigrowCodeModalState}
              onClose={this.CloseDialogConnectChildModalSendtoTigrowonShare}
            />

            <AddChildComponent
              onPress={this.DialogConnectChildModal}
              isHandTapAnimationVisible={isHandTapAnimationVisible}
            />
          </View>
          <View style={{ alignSelf: 'center' }}>
            <ChildDataPane
              visible={!modalVisible && !modalVisibleSendTigrow && !DialogConnectChildTigrowCodeModalState}
              child={{
                name: L('example'),
                accuracy: 10,
                voltage: 50,
                states: {
                  dndEnabled: '1',
                },
              }}
              isExample={true}
            />
          </View>
        </BottomTab>
        <MapZoomPanel
          onMapLayer={this.pickMapLayer.bind(this)}
          onZoomIn={() => {
            this.mapZoomIn();
          }}
          onZoomOut={() => {
            this.mapZoomOut();
          }}
          onRefresh={() => {
            MapScreenFirebaseAnalytics.refresh();
            this.getPositionAndCenterOnDemo();
          }}
        />
        <ConnectedMapHeaderTitle />

        <View style={styles.top_shade}>
          <LinearGradient
            style={{ flex: 1 }}
            colors={['#00000070', '#00000000']}
            start={[0, 0]}
            end={[0, 1]}
            locations={[0, 1]}
          />
        </View>

        <AddPhonePane
          visible={
            isParentPraised &&
            username !== 'support' &&
            objectsLoaded &&
            objectCount === 0 &&
            termsOfUseAccepted === true
          }
        />
        <AdvantagesPane
          product={productInfo ? productInfo : {}}
          timerLabel={this.props.tryPremiumTimerLabel}
          visible={this.state.advantagesPaneVisible}
          onSuccess={() => this.props.setPremiumThanksVisible(true)}
          onTouchOutside={() => {
            setTimeout(() => {
              this.setState({ advantagesPaneVisible: false });
            }, 500);
          }}
          showAlert={showAlert}
          alertObj={alertObj}
        />
        {/* <PraiseParentPane
          visible={!isParentPraised && 0 === objectCount && objectsLoaded && termsOfUseAccepted}
          onPress={this.onConfirmParentPraising.bind(this)}
        /> */}
        <AcceptTermsPane
          visible={termsOfUseAccepted === false}
          onAccept={this.onAcceptTermsOfUse.bind(this)}
          onLanguageSelect={this.onLanguageSelect.bind(this)}
          onPhoneChanged={this.onPhoneChanged.bind(this)}
          onEmailChanged={this.onEmailChanged.bind(this)}
          termsAccepted={this.state.termsOfUseAccepted}
        />
        <TryPremiumPane
          visible={this.state.tryPremiumPaneVisible}
          onHide={() => {
            UserPrefs.setTryPremiumShown(true);
            this.setState({ tryPremiumPaneVisible: false });
          }}
        />
        <NeedPremiumPane
          visible={this.state.needPremiumVisible}
          onPressSubscribe={() => this.setState({ needPremiumVisible: false })}
          onPressCancel={() => this.setState({ needPremiumVisible: false })}
          showHidePremiumModal={this.onShowHidePremiumModal}
        />
        <ThanksForPurchasePane visible={premiumThanksVisible} onPressCancel={() => setPremiumThanksVisible(false)} />
        <ActiveFreeTrialModal
          isVisible={isActiveFreeTrialModalVisible}
          onClose={() => setActiveFreeTrialModalVisible(false)}
        />
        <ShareAppPane
          visible={this.state.shareAppVisible}
          onPressCancel={() =>
            setTimeout(() => {
              this.setState({ shareAppVisible: false });
            }, 500)
          }
        />
        <InviteFriendDialog />
        <PinCodeDialog oid={activeOid} />
        <PinCodeHintDialog oid={activeOid} />
        <PinCodeHintDetailDialog />
        <CoronaSharePane
          visible={this.state.shareCoronaEventVisible}
          onPressCancel={() => {
            this.setState({ shareCoronaEventVisible: false });
            notifyAppShared();
          }}
        />
        <PinCodePane
          visible={showPinCodePane}
          onHide={() => {
            setShowPinCodePane(false);
          }}
        />
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        {isPremiumModalVisible && (
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Main' })
            }
            onPayWithIFree={(productId: string, kind: string) =>
              NavigationService.navigate('PaymentMethod', {
                productId,
                kind,
                backTo: 'Main',
                onHide: () => this.onShowHidePremiumModal,
                isSubscription: true,
              })
            }
            onSuccess={this.onShowSuccessfulSubscriptionModal}
          />
        )}
        <PurchaseStateModals />
      </View>
    );
  }
}

const defaultMenuContentProps = {
  onLogout: null,
};

class MenuContent extends React.Component {
  render() {
    const { premium } = this.props;
    const props = { ...defaultMenuContentProps, ...this.props };
    return (
      <View style={styles.menu}>
        <MenuItem title={L('menu_add_child')} icon="plus" onPress={props.onAddPhone} name="add_child" />
        {/* <MenuItem title={L('menu_add_parent')} icon='account-multiple-plus' type='material-community' iconColor='#FF666F' nPress={props.onAddParent} name='add_parent' /> */}
        {premium && premium.supported ? (
          <MenuItem
            title={L('menu_premium')}
            icon="star"
            type="evilicon"
            onPress={props.onPremiumAccount}
            name="premium"
          />
        ) : null}
        <MenuItem title={L('menu_about')} icon="question" onPress={props.onAbout} name="about" />
        <MenuItem
          title={L('setup_child')}
          icon="cellphone"
          type="material-community"
          onPress={() => Linking.openURL(L(Const.getInstructionsUrl()))}
        />
        <MenuItem
          title={L('menu_chat_support')}
          icon="forum-outline"
          type="material-community"
          onPress={props.onSupportPress}
          name="support"
        />
      </View>
    );
  }
}

function makeReadableCoordTime(o) {
  if (o) {
    const { states } = o;
    if (states && states.coordTs) {
      const diff = Math.floor((new Date().getTime() - states.coordTs) / 1000);
      if (diff < 25) {
        return L('ts_right_now');
      }
      if (diff < 60) {
        return L('ts_minute_ago');
      }
      const minutes = Math.floor(diff / 60);
      if (minutes < 60) {
        return minutes + ' ' + L('ts_min');
      }
      const hours = Math.floor(diff / 3600);
      if (hours < 24) {
        return hours + ' ' + L('ts_hour');
      }
      const days = Math.floor(diff / 3600 / 24);
      return days + ' ' + L('ts_day');
    }
  }
  return L('ts_unknown');
}

class MapHeaderTitle extends React.Component {
  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return <View />;
  }
}

const mapStateToPropsHeader = (state) => {
  const { objects, activeOid } = state.controlReducer;

  return {
    objects,
    activeOid,
  };
};

const mapDispatchToPropsHeader = (dispatch) => {
  return {
    setTryPremiumTimerLabel: bindActionCreators(controlActionCreators.setTryPremiumTimerLabel, dispatch),
  };
};

const ConnectedMapHeaderTitle = connect(mapStateToPropsHeader, mapDispatchToPropsHeader)(MapHeaderTitle);

const mapStateToProps = (state) => {
  const {
    objectsLoaded,
    placesLoaded,
    navigateOidFirstTime,
    pushToken,
    addrMap,
    wifiAddrMap,
    coordMode,
    places,
    premiumValid,
    premiumReallyPaid,
    mapLayer,
    phoneLinked,
    linkedOid,
    messageBadgeCounter,
    iapReady,
    premiumThanksVisible,
    isActiveFreeTrialModalVisible,
    tryPremiumTimerLabel,
    addPhoneCode,
    ossToken,
    showPinCodePane,
    providerPremium,
    iapItemsError,
    isHandTapAnimationVisible,
  } = state.controlReducer;
  const demoChild = demoObject;
  const demoOid = demoChild.oid;
  const demoObjects = {};
  demoObjects[demoOid] = demoChild;
  const { premium, demo, username, userId } = state.authReducer;
  const products = state.controlReducer.products;
  const { isPremiumModalVisible, alertObj } = state.popupReducer;

  return {
    userId,
    premiumThanksVisible,
    isActiveFreeTrialModalVisible,
    products,
    username,
    demo,
    objects: demoObjects,
    activeOid: demoChild.oid,
    objectsLoaded,
    placesLoaded,
    navigateOidFirstTime,
    pushToken,
    addrMap,
    wifiAddrMap,
    coordMode,
    places,
    premiumValid,
    premiumReallyPaid,
    premium,
    mapLayer,
    phoneLinked,
    linkedOid,
    messageBadgeCounter,
    iapReady,
    tryPremiumTimerLabel,
    addPhoneCode,
    ossToken,
    showPinCodePane,
    providerPremium,
    iapItemsError,
    isHandTapAnimationVisible,
    isPremiumModalVisible,
    alertObj,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    activatePremium: bindActionCreators(controlActionCreators.activatePremium, dispatch),
    notifyAppShared: bindActionCreators(controlActionCreators.notifyAppShared, dispatch),
    setPushToken: bindActionCreators(controlActionCreators.setPushToken, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
    setActiveFreeTrialModalVisible: bindActionCreators(controlActionCreators.setActiveFreeTrialModalVisible, dispatch),
    setNavigateOidFirstTime: bindActionCreators(controlActionCreators.setNavigateOidFirstTime, dispatch),
    setActiveOid: bindActionCreators(controlActionCreators.setActiveOid, dispatch),
    setMapLayer: bindActionCreators(controlActionCreators.setMapLayer, dispatch),
    disconnect: bindActionCreators(wsActionCreators.disconnect, dispatch),
    setLoggedOut: bindActionCreators(authActionCreators.setLoggedOut, dispatch),
    clearFirstMapShow: bindActionCreators(authActionCreators.clearFirstMapShow, dispatch),
    disablePushNotifications: bindActionCreators(controlActionCreators.disablePushNotifications, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setDemo: bindActionCreators(authActionCreators.setDemo, dispatch),
    connect: bindActionCreators(wsActionCreators.connect, dispatch),
    executeUssdRequest: bindActionCreators(controlActionCreators.executeUssdRequest, dispatch),
    setChatWith: bindActionCreators(controlActionCreators.setChatWith, dispatch),
    setCoordMode: bindActionCreators(controlActionCreators.setCoordMode, dispatch),
    clearAddPhoneCode: bindActionCreators(controlActionCreators.clearAddPhoneCode, dispatch),
    setUserProperty: bindActionCreators(controlMiddlewareActionCreators.setUserProperty, dispatch),
    setUserAdId: bindActionCreators(controlMiddlewareActionCreators.setUserAdId, dispatch),
    modifyUserProperty: bindActionCreators(authActionCreators.modifyUserProperty, dispatch),
    linkInviteToken: bindActionCreators(controlActionCreators.linkInviteToken, dispatch),
    setShowPinCodePane: bindActionCreators(controlActionCreators.setShowPinCodePane, dispatch),
    setOssPinData: bindActionCreators(controlActionCreators.setOssPinData, dispatch),
    sendOssPin: bindActionCreators(controlActionCreators.sendOssPin, dispatch),
    setProductsRussia: bindActionCreators(controlActionCreators.setProductsRussia, dispatch),
    setYooKassaSubscriptions: bindActionCreators(controlActionCreators.setYooKassaSubscriptions, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    setHandTapAnimationVisible: bindActionCreators(controlActionCreators.setHandTapAnimationVisible, dispatch),
    showPremiumModal: bindActionCreators(popupActionCreators.showPremiumModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
    setTabBarHistory: bindActionCreators(controlActionCreators.setTabBarHistory, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);

const styles = StyleSheet.create({
  mapcontainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  hamburger: {
    color: '#fff',
    marginLeft: 10,
  },
  coordMode: {
    color: '#fff',
    marginRight: 10,
  },
  devicechat: {
    color: '#fff',
    marginRight: 10,
  },
  menu: {
    flex: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'center',
    flexDirection: 'column',
    paddingTop: 10 + Const.HEADER_HEIGHT,
    marginLeft: -10,
  },
  menuItem: {},
  header: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
  },

  headerLine: {
    color: 'white',
    fontSize: 12,
  },

  objectbar: {
    position: 'absolute',
    left: 0,
    bottom: 70,
    right: 0,
  },

  navbarButton: {
    width: 55,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },

  noGpsPane: {
    position: 'absolute',
    top: HEADER_HEIGHT + 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noGpsLabel: {
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ff7c7c',
    padding: 20,
    margin: 20,
    textAlign: 'center',
  },
  infoBar: {
    width: 200,
    height: 70,
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'absolute',
    top: HEADER_HEIGHT,
    right: 0,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  premiumBadge: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    width: '100%',
    height: HEADER_HEIGHT + 45,
    backgroundColor: '#ebef04',
    position: 'absolute',
    top: -HEADER_HEIGHT,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    zIndex: 3,
  },
  premiumText: {
    color: '#4c4c4c',
    textAlign: 'center',
    fontSize: 12,
  },
  alertBadge: {
    backgroundColor: '#FF666F',
    top: 0,
  },
  alertText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 11,
  },
  topPanel: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  share: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  splash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
  splash_image: {
    width: '100%',
    height: '100%',
  },
  one_kid: {
    bottom: 95,
    paddingLeft: 40,
  },
  many_kids: {
    bottom: 165,
    paddingRight: 25,
  },
  config_alert_pane_outer: {
    position: 'absolute',
    zIndex: 0,
  },
  config_alert_pane: {
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.47,
    shadowRadius: 4.65,
    elevation: 6,
  },
  config_alert_pane_text: {
    fontSize: 10,
    color: 'red',
    paddingRight: 10,
  },
  config_alert_pane_icon: {
    width: 20,
    height: 20,
  },
  page_title: {
    paddingTop: 20,
    paddingLeft: 10,
    flexDirection: 'row',
    alignContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    backgroundColor: '#FF666F',
  },
  tryPremiumLabelWrapper: {
    paddingTop: 40,
    alignItems: 'flex-start',
    width: '60%',
  },
  top_shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 25,
    zIndex: 9999,
  },
});
