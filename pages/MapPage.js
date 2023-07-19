import React from 'react';
import { connect } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import { bindActionCreators } from 'redux';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Header } from 'react-navigation';
import appsFlyer from 'react-native-appsflyer';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import * as URI from 'uri-js';
import firebase from '@react-native-firebase/app';

import Rest from '../Rest';
import * as oss from '../vendor/oss/oss';
import MapMarker from '../components/MapMarker';
import DialogConnectChild from './DialogConnectChild';
import TryPremiumLabel from '../components/TryPremiumLabel';
import { controlActionCreators } from '../reducers/controlRedux';
import { ActionCreators as wsActionCreators } from '../wire/WsMiddleware';
import { authActionCreators } from '../reducers/authRedux';
import MenuItem from '../components/MenuItem';
import BottomTab from '../components/BottomTab';
import MapZoomPanel from '../components/MapZoomPanel';
import TryPremiumPane from '../components/TryPremiumPane';
import NavigationService from '../navigation/NavigationService';
import ObjectBar from '../components/ObjectBar';
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
  soundBalanceToStr,
  getUrlParams,
  isIosChatObject,
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
import AccuracyPane from '../components/AccuracyPane';
import PushNotificationsService from '../PushNotificationsService';
import { getOnTapActionByNotificationKind, getOnNotificationAction } from '../OnTapActionService';

import '@react-native-firebase/dynamic-links';
import CoronaSharePane from '../components/CoronaSharePane';
import BuyPremiumBadge from '../components/molecules/BuyPremiumBadge';
import PromoBadge from '../components/molecules/PromoBadge';
import ShareAboutBlock from '../components/molecules/ShareAboutBlock';
import ChildDataPane from '../components/organisms/ChildDataPane';
import MapChildMarker from '../components/molecules/MapChildMarker';
import AdvantagesPane from '../components/organisms/AdvantagesPane';
import { MapColorScheme } from '../shared/colorScheme';
import { GetProductInfo } from '../purchases/PurchasesInterface';
import ConfigureChildPane from '../components/ConfigureChildPane';
import SalePane from '../components/SalePane';
import PinCodePane from '../components/PinCodePane';
import InviteFriendDialog from '../components/organisms/InviteFriendDialog';
import { mapCancelBtnActionCreators, popupActionCreators } from '../reducers/popupRedux';
import PinCodeDialog from '../components/organisms/PinCodeDialog';
import PinCodeHintDialog from '../components/organisms/PinCodeHintDialog';
import PinCodeHintDetailDialog from '../components/organisms/PinCodeHintDetailDialog';
import {
  PremiumModal,
  ActiveFreeTrialModal,
  KidPhoneProblemsModal,
  AddChildComponent,
  PurchaseStateModals,
} from '../components';
import { APIService } from '../Api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

import { firebaseAnalitycsForOpenModal, MapScreenFirebaseAnalytics } from '../analytics/firebase/firebase';

import { EventRegister } from 'react-native-event-listeners';

import MapModal from '../components/ABTesting/realtimeSwitcher/MapModal/MapModal';
import SwitchItemForTopPanel from '../components/ABTesting/realtimeSwitcher/SwitchItem/SwitchItemForTopPanel';
import { RestAPIService } from '../RestApi';

const HEADER_HEIGHT = Header.HEIGHT;
const { width, height } = Dimensions.get('window');

class MapPage extends React.Component {
  state = {
    isRealtimeSwitcherOn: false,
    isRealtimeSwitcherMapShow: false,
    realtime_switcher_design: null,
    isProgress: false,
    termsOfUseAccepted: false,
    isParentPraised: true,
    visiblePopups: {},
    tryPremiumShown: false,
    needPremiumVisible: false,
    shareAppVisible: false,
    accuracyPaneVisible: false,
    tryPremiumPaneVisible: false,
    shareCoronaEventVisible: false,
    advantagesPaneVisible: false,
    infoPaneVisible: true,
    salePane: false,
    country: '',
    isKidPhoneProblemsModalVisible: false,
  };
  oldPositionVer = 0;
  navigatedFirstTime = false;

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
      this.zoom = Const.DEFAULT_ZOOM;
    }

    this.region = all.mapRegion;
    if (!this.region) {
      this.region = getRegionForZoom(Const.DEFAULT_LAT, Const.DEFAULT_LON, Const.DEFAULT_ZOOM);
    }

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
    const { premium, clearFirstMapShow, setUserAdId, linkInviteToken, setPremiumValid, setTabBarHistory } = this.props;
    //#region realtimeSwitcher
    const realtime_switcher_design = remoteConfig().getValue('realtime_switcher_design').asString();
    this.setState({
      isRealtimeSwitcherOn: (await AsyncStorage.getItem('isRealtimeSwitcherOn')) === 'true',
      realtime_switcher_design: realtime_switcher_design === '1',
    });
    //#endregion
    setTabBarHistory([L('map')]);

    const country = UserPrefs.all.userLocationCountry;
    if (country) this.setState({ country });

    this.getProductsRussia();
    this.getYooKassaSubscriptions();

    _toggleCoordMode = this.onToggleCoordMode.bind(this);
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
          console.log('setAdId', a, b);
        }
      );
    });
    Notifications.addNotificationResponseReceivedListener((n) => {
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
          if (action === 'invite') {
            linkInviteToken({ initiator, token }, function (pr, packet) {
              console.log(packet);
            });
          }
        }
      });

    Linking.addEventListener('url', (deeplink) => {
      console.log(' !!!! URL_DEEP_LINKING: ' + deeplink.url);
      this.processDeepLinking(deeplink.url);
    });

    const deeplink = await Linking.getInitialURL();
    if (deeplink) {
      console.log(' !!!! URL_DEEP_LINKING: INITIAL: ' + deeplink);
      this.processDeepLinking(deeplink);
    }

    //NavigationService.navigate('FreeMinutes', { oid: UserPrefs.all.activeOid })
  }
  onChangeRealtimeSwitcher = (isActive) => {
    this.setState({
      isRealtimeSwitcherMapShow: isActive,
      isRealtimeSwitcherOn: isActive,
    });

    MapScreenFirebaseAnalytics.realtimeSwitch(isActive);
    if (isActive) firebaseAnalitycsForOpenModal('RealTimeSwitcherTurnOn');

    AsyncStorage.setItem('isRealtimeSwitcherOn', isActive?.toString());
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

    const { activatePremium, providerPremium } = this.props;
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

  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  // }

  handleBackButton() {
    const {
      premiumThanksVisible,
      setPremiumThanksVisible,
      isActiveFreeTrialModalVisible,
      setActiveFreeTrialModalVisible,
    } = this.props;
    const {
      needPremiumVisible,
      advantagesPaneVisible,
      tryPremiumPaneVisible,
      shareAppVisible,
      shareCoronaEventVisible,
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
      } else if (shareAppVisible) {
        this.setState({ shareAppVisible: false });
        return true;
      } else if (tryPremiumPaneVisible) {
        this.setState({ tryPremiumPaneVisible: false });
        return true;
      } else if (shareCoronaEventVisible) {
        this.setState({ shareCoronaEventVisible: false });
        return true;
      }
      // BackHandler.exitApp();
      return true;
    }
    return false;
  }

  gotoChat() {
    const { activeOid } = this.props;
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
    //console.warn(' -------------------- center map: ' + lat, lon);
    if (!this.map || !lat || !lon || lat === 0 || lon === 0) {
      return;
    }
    const region = getRegionForZoom(lat, lon, Const.DEFAULT_ZOOM);
    // const region = {
    //   latitude: lat,
    //   longitude: lon,
    //   latitudeDelta: this.region.latitudeDelta,
    //   longitudeDelta: this.region.longitudeDelta,
    // };
    this.map?.animateToRegion(region, 200);
  }

  performLogout() {
    const { disconnect, setLoggedOut, disablePushNotifications, pushToken } = this.props;
    disablePushNotifications(Const.PUSH_PROVIDER, pushToken, () => {
      disconnect(false);
      setLoggedOut(true);
      UserPrefs.setPushToken('');
      NavigationService.replace('Auth');
    });
  }

  onLogout() {
    Alert.alert(
      L('logout'),
      L('logout_confirmation'),
      [
        { text: L('cancel'), style: 'cancel' },
        { text: L('confirm_logout'), style: 'destructive', onPress: this.performLogout.bind(this) },
      ],
      { cancellable: true }
    );
  }

  onLanguage() {
    underConstruction();
  }

  onAbout() {
    NavigationService.navigate('About');
  }

  setRandomOidAndCenter(activeOid) {
    const { objects } = this.props;
    let oid = null;

    for (let i in objects) {
      if (objects[i].oid !== activeOid) {
        oid = objects[i].oid;
        break;
      }
    }

    this.setActiveOidAndCenter(oid);
  }

  goodStarPressed() {
    if (Platform.OS === 'ios') {
      Linking.openURL(Const.IOS_APP_URL);
    } else {
      Linking.openURL(Const.ANDROID_APP_URL);
    }
  }

  centerActiveOid() {
    console.log(';------');
    const { activeOid, objects, coordMode, addrMap, wifiAddrMap } = this.props;
    if (activeOid) {
      const object = objects[activeOid + ''];
      if (object) {
        const coordInfo = getCoordInfo(coordMode, object, addrMap, wifiAddrMap);
        this.mapCenter(coordInfo.lat, coordInfo.lon);
      }
    }
  }

  setActiveOidAndCenter(oid) {
    console.log('call set oid', oid);
    const { setActiveOid, objects, coordMode, addrMap, wifiAddrMap } = this.props;
    const object = objects[oid + ''];
    if (object) {
      const coordInfo = getCoordInfo(coordMode, object, addrMap, wifiAddrMap);
      setTimeout(() => {
        this.mapCenter(coordInfo.lat, coordInfo.lon);
      }, 200);
    }
    setTimeout(() => {
      setActiveOid(oid);
    }, 500);
  }

  shareAppAndTest() {
    this.setState({ shareAppVisible: true });
  }

  onToggleCoordMode() {
    const options = ['GPS + WiFi', 'GPS', 'WiFi', L('cancel')];
    const modes = ['gps_wifi', 'gps', 'wifi'];
    const cancelButtonIndex = options.length - 1;

    const { activeOid } = this.props;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex != cancelButtonIndex) {
          const mode = modes[buttonIndex];
          this.props.setCoordMode(mode);
          setTimeout(() => {
            this.setActiveOidAndCenter(activeOid);
          }, 0);
        }
      }
    );
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onAddPhone = () => {
    EventRegister.emit('clickOutsideDeleteBtn');
    NavigationService.navigate('AddPhone', {
      backTo: 'Main',
      setActiveOidAndCenter: this.setActiveOidAndCenter.bind(this),
      forceReplace: true,
      disableBackButton: true,
    });
  };

  onAddParent = () => {
    NavigationService.navigate('Parents', { activeOid: oid });
  };
  onGoodStarPressed() {
    if (Platform.OS == 'ios') {
      Linking.openURL(Const.IOS_APP_URL);
    } else {
      Linking.openURL(Const.ANDROID_APP_URL);
    }
  }

  doRefreshObjectLocation(oid) {
    const hideProgressbar = this.hideProgressbar;
    this.openProgressbar(L('requesting_location'));
    RestAPIService.clarify(oid)
      .then(() => hideProgressbar())
      .catch((err) => console.log('Error clarifying object', err));
    this.setActiveOidAndCenter(oid);
    Metrica.event('force_update_location');
  }

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
    const { objects, addPhoneTracker, iapReady } = this.props;

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

    let objectCount = Object.keys(objects).length;

    if (objectCount < 1) {
      addPhoneTracker();
    }

    if (iapReady) {
      this.showTryPremium();
    }

    setTimeout(() => this.setupPushNotifications(), 2000);
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
    const { premiumReallyPaid } = this.props;
    if (premiumReallyPaid) {
      NavigationService.navigate('BuyPremium');
      return;
    }
    NavigationService.navigate('PremiumFeatures');
  }

  pickMapLayer(index) {
    const { setMapLayer } = this.props;
    console.log(' pick map = ' + index);
    setMapLayer(index);

    const maxZoom = maxZoomForLayer(index);
    if (this.zoom > maxZoom) {
      this.zoom = maxZoom;
      const region = getRegionForZoom(this.region.latitude, this.region.longitude, this.zoom);
      this.map?.animateToRegion(region, 0);
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

    // if (!loggedOut /* && ios*/) {
    //   if (!isTrialExpired(premium) && !this.state.tryPremiumShown && this.state.termsOfUseAccepted) {
    //     this.setState({ tryPremiumShown: true });
    //     setTimeout(() => {
    //       //NavigationService.navigate('TryPremium');
    //       this.setState({ tryPremiumPaneVisible: true });
    //     }, 100);
    //   }
    // }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //console.log('map page rcv props');
    const { positionVer, activeOid, addPhoneCode, addPhoneTracker, stopAddPhoneTracker, objectsLoaded, objects } =
      this.props;

    let objectCount = Object.keys(nextProps.objects).length;

    let newOid = objects[Object.keys(objects)[Object.keys(objects)?.length - 1]]?.oid;
    if (!(activeOid in objects)) {
      this.setActiveOidAndCenter(newOid);
    }

    if (!addPhoneCode && objectCount === 0 && (nextProps.objectsLoaded || objectsLoaded)) {
      setTimeout(() => {
        addPhoneTracker();
      }, 0);
    }

    if (nextProps.iapReady) {
      this.showTryPremium();
    }

    if (nextProps.linkedOid) {
      console.log('These are the next props !!!!====>', nextProps);
      setTimeout(() => {
        console.log(' === map page > object name page');
        this.setActiveOidAndCenter(nextProps.linkedOid);
        /* When adding second, third etc., kid, this navigation gets triggered
        and component is re-rendered causing edit kid info page to skip.
        If this navigation needed somwhere else, then need to pass condition for it.
        */

        // NavigationService.navigate('ObjectName', {
        //   requireInput: true,
        //   oid: nextProps.linkedOid,
        //   offerHomePlaceSetup: this.requestCurrentLocation.bind(this),
        // });
        stopAddPhoneTracker();
      }, 0);
      if (!UserPrefs.all.firstChildConnected) {
        setTimeout(() => {
          Metrica.event('funnel_first_child_connected');
          UserPrefs.setFirstChildConnected(true);
          Metrica.logChildConnected();
        }, 0);
      }
    }

    if (!this.navigatedFirstTime && nextProps.objectsLoaded && objectCount > 0) {
      this.navigatedFirstTime = true;
      setTimeout(() => {
        Object.values(nextProps.objects).map((o) => {
          console.log(' == initial refresh: ' + o.oid);
          RestAPIService.clarify(o.oid).catch((err) => console.log('Error clarifying object', err));
          if (nextProps.activeOid && nextProps.activeOid === o.oid) {
            this.setActiveOidAndCenter(o.oid);
          }
        });
      }, 0);
    }

    /*if (nextProps.objectsLoaded && objectCount === 0) {
      setTimeout(() => {
        NavigationService.forceReplace('DemoMap');
      }, 0);
    }*/

    if (nextProps.positionVer != positionVer) {
      this.setActiveOidAndCenter(activeOid);
    }
  }

  onLanguageSelect(lang) {
    Metrica.event('funnel_lang', { lang });
    UserPrefs.setLanguage(lang);
    this.setState({ now: new Date().getTime() });
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

  onGoToPremium = () => {
    const { iapItemsError, showAlert } = this.props;
    const { country } = this.state;

    if (iapItemsError && country !== 'Russia') {
      showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
    } else {
      if (!UserPrefs.all.premiumFeaturesShown) {
        NavigationService.navigate('PremiumFeatures', { backTo: 'Main' });
      } else {
        this.onShowHidePremiumModal();
      }
    }
  };

  onShowHideKidPhoneProblemsModal = () => {
    const { isKidPhoneProblemsModalVisible } = this.state;

    this.setState({ isKidPhoneProblemsModalVisible: !isKidPhoneProblemsModalVisible });
  };

  render() {
    //console.log('refresh map');
    const {
      objects,
      activeOid,
      positionVer,
      addrMap,
      wifiAddrMap,
      coordMode,
      places,
      premium,
      premiumValid,
      premiumReallyPaid,
      mapLayer,
      premiumThanksVisible,
      isActiveFreeTrialModalVisible,
      setPremiumThanksVisible,
      setConfigureChildPaneVisible,
      configureChildPaneVisible,
      iapReady,
      notifyAppShared,
      tryPremiumTimerLabel,
      promoData,
      showPromoWebView,
      setShowPromoWebView,
      showPinCodePane,
      setShowPinCodePane,
      iapItemsError,
      userId,
      isPremiumModalVisible,
      showAlert,
      alertObj,
    } = this.props;

    const { termsOfUseAccepted, infoPaneVisible } = this.state;
    //const tryPremiumTimerLabel = null;
    // console.log(this.state);
    let activeObject = {
      voltage: 0,
      lat: 0,
      lon: 0,
      states: {
        dndEnabled: '0',
      },
    };
    if (activeOid) {
      const obj = objects[activeOid + ''];
      activeObject = obj ? obj : activeObject;
      /*
      if (navigateOidFirstTime && obj) {
        setTimeout(() => {
          setNavigateOidFirstTime(false);
          const coordInfo = getCoordInfo(coordMode, obj, addrMap, wifiAddrMap);
          this.mapCenter(coordInfo.lat, coordInfo.lon);
        }, 0);
      }



      if (this.oldPositionVer != positionVer) {
        this.oldPositionVer = positionVer;
        if (obj) {
          setTimeout(() => {
            const coordInfo = getCoordInfo(coordMode, obj, addrMap, wifiAddrMap);
            this.mapCenter(coordInfo.lat, coordInfo.lon);
          }, 0);
        }
      }*/
    }
    let objectCount = Object.keys(objects).length;
    const activeInfo = getCoordInfo(coordMode, activeObject, addrMap, wifiAddrMap);
    const noGpsData = objectCount > 0 && (Math.floor(activeObject.lat) === 0 || Math.floor(activeObject.lon) === 0);
    const alertPaneVisible = objectCount > 0 && getConfigurationAlets(activeObject).hasAlert;
    const trialExpired = isTrialExpired(premium);
    const productInfo = this.props.products
      ? GetProductInfo('THREEMONTHLY_PREMIUM_WITH_DEMO', this.props.products)
      : {};

    const promoBadgeShown = promoData && iapReady;
    const trialBadgeShown =
      !trialExpired && !(premiumReallyPaid || premium.overriden || tryPremiumTimerLabel) && iapReady && !promoData;
    const buyPremiumBadgeShown = trialExpired && !premiumValid && iapReady && !promoBadgeShown;
    const isIos = isIosChatObject(objects[activeOid]);
    const country = UserPrefs.all.userLocationCountry;
    const tabBarHeight = height / 10;
    const statusBarHeight = Constants.statusBarHeight;

    return (
      <View style={styles.mapcontainer}>
        <StatusBar backgroundColor="transparent" barStyle="light-content" translucent={true} />
        {this.props.cancelBtnTrigger && (
          <TouchableOpacity
            onPress={() => {
              this.clickChild(), this.props.toggleCancelBtn(false);
            }}
            style={styles.cancelledChildOverlay}
          />
        )}
        <MapView
          ref={(ref) => {
            const newmap = this.map === ref;
            this.map = ref;
            if (newmap) {
              setTimeout(this.centerActiveOid.bind(this), 0);
            }
          }}
          mapType={mapLayer === 1 ? 'hybrid' : 'standard'}
          style={{ flex: 1, width: '100%' }}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          initialRegion={this.region}>
          {mapLayer === 2 || mapLayer === 3 ? (
            <MapView.UrlTile zIndex={Const.TILE_Z_INDEX} urlTemplate={Const.MAP_URL_TEMPLATES[mapLayer]} />
          ) : null}

          {Object.values(places).map((place) => {
            return (
              <MapView.Circle
                key={place.id}
                center={{ latitude: place.center.lat, longitude: place.center.lon }}
                radius={place.radius}
                strokeWidth={1}
                strokeColor={MapColorScheme.stroke}
                fillColor={MapColorScheme.circle}
              />
            );
          })}
          {Object.values(places).map((place) => {
            return (
              <MapMarker
                //tracksViewChanges={false}
                key={'place_name' + place.id}
                coordinate={{ latitude: place.center.lat, longitude: place.center.lon }}
                anchor={{ x: 0.5, y: 0.5 }}>
                <Text
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    color: 'white',
                    borderRadius: 6,
                    backgroundColor: '#FF666F',
                    overflow: 'hidden',
                  }}>
                  {place.name}
                </Text>
              </MapMarker>
            );
          })}

          {activeObject.lat ? (
            <MapView.Circle
              center={{ latitude: activeInfo.lat, longitude: activeInfo.lon }}
              radius={activeInfo.accuracy / 2}
              strokeWidth={1}
              strokeColor={MapColorScheme.stroke}
              fillColor={MapColorScheme.circle}
            />
          ) : null}

          {Object.values(objects).map((marker) => {
            //console.log('render: ' + marker.oid);
            const coordInfo = getCoordInfo(coordMode, marker, addrMap, wifiAddrMap);
            const markerKey = marker.oid + positionVer * (marker.oid == activeOid ? 1000 : 0);
            const active = marker.oid == activeOid;
            return (
              <MapMarker
                zIndex={active ? 100 : 0}
                anchor={{ x: 0.5, y: 1.0 }}
                centerOffset={{ x: 0, y: Platform.OS === 'ios' ? -30 : Const.MAP_MARKER_Y_OFFSET }}
                style={styles.marker}
                key={markerKey}
                coordinate={{ latitude: coordInfo.lat, longitude: coordInfo.lon }}
                onPress={() => {
                  MapScreenFirebaseAnalytics.pinMap(marker.oid);
                  this.setActiveOidAndCenter(marker.oid);
                  this.hideObjectPopup(marker.oid, false);
                }}>
                <MapChildMarker infoBuble={active} childData={marker} photoUrl={marker.photoUrl} />
              </MapMarker>
            );
          })}
        </MapView>
        <View style={styles.topPanel}>
          {trialBadgeShown ? (
            <TouchableOpacity
              style={styles.premiumBadge}
              onPress={() => {
                MapScreenFirebaseAnalytics.tapInMapBanner('test_version_activated_map_show');
                this.onGoToPremium();
              }}>
              <Text style={styles.premiumText}>{L('premium_trial_is_activated')}</Text>
            </TouchableOpacity>
          ) : null}
          {promoBadgeShown && (
            <PromoBadge
              visible={promoBadgeShown}
              onPress={() => {
                this.setState({ salePane: true });
              }}
              promoData={promoData}
            />
          )}
          {/* SHARE BLOCK TOP RIGHT CORNER */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginRight: 10, position: 'relative' }}>
            {buyPremiumBadgeShown ? (
              <View
                style={{
                  position: 'absolute',
                  top: trialBadgeShown || promoBadgeShown ? 10 : statusBarHeight + 5,
                  left: 0,
                  paddingLeft: 10,
                }}>
                <BuyPremiumBadge
                  onPress={() => {
                    MapScreenFirebaseAnalytics.tapInMapBanner('buy_subscription_map_show');
                    this.onGoToPremium();
                  }}
                />
              </View>
            ) : null}
            <View
              style={{
                top: trialBadgeShown || promoBadgeShown ? 10 : statusBarHeight + 5,
                position: 'absolute',
                right: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* ossToken ? (<OssButton buttonImageUrl={ossButtonImageUrl} />) : null */}
              <ShareAboutBlock
                style={{
                  paddingRight: 5,
                }}
                onSettingsPress={() =>
                  NavigationService.navigate('Settings', {
                    oid: activeOid,
                    setActiveOidAndCenter: this.setActiveOidAndCenter.bind(this),
                  })
                }
              />
            </View>
          </View>

          {/* TRY PREMIUM LABEL TOP LEFT CORNER*/}
          <View
            style={[
              styles.tryPremiumLabelWrapper,
              {
                paddingTop: trialBadgeShown || promoBadgeShown ? 10 : statusBarHeight + 5,
                width: '60%',
              },
            ]}>
            <TryPremiumLabel
              price={productInfo && productInfo.introductoryPrice}
              timerLabel={tryPremiumTimerLabel}
              visible={
                !premiumReallyPaid &&
                !trialExpired &&
                tryPremiumTimerLabel &&
                this.props.iapReady &&
                !premium.overriden &&
                !promoBadgeShown &&
                (!country || country !== 'Russia')
              }
              onPress={() => {
                MapScreenFirebaseAnalytics.tapInMapBanner('try_for_free_map_show');
                if (iapItemsError && this.state.country !== 'Russia') {
                  showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
                } else {
                  this.setState({ advantagesPaneVisible: true });
                }
              }}
            />
          </View>
          {this.state.realtime_switcher_design && (
            <SwitchItemForTopPanel
              isHasTopItem={
                !premiumReallyPaid &&
                !trialExpired &&
                tryPremiumTimerLabel &&
                this.props.iapReady &&
                !premium.overriden &&
                !promoBadgeShown &&
                (!country || country !== 'Russia')
              }
              defaultValue={this.state.isRealtimeSwitcherOn}
              onChangeRealtimeSwitcher={this.onChangeRealtimeSwitcher}
            />
          )}
          {this.state.isRealtimeSwitcherMapShow && <MapModal />}
        </View>
        <BottomTab indexTrigger={this.props.cancelBtnTrigger}>
          <TouchableWithoutFeedback onPress={() => EventRegister.emit('clickOutsideDeleteBtn')}>
            <View
              style={{
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                right: width / 21,
                zIndex: this.props.cancelBtnTrigger ? 3 : 0,
              }}>
              <ObjectBar
                setClick={(click) => (this.clickChild = click)}
                objects={objects}
                onPress={(oid) => {
                  this.setActiveOidAndCenter(oid);
                }}
                activeOid={activeOid}
                navigation={this.props.navigation}
                pulse={false}
                setRandomOidAndCenter={this.setRandomOidAndCenter.bind(this)}
              />
              <AddChildComponent onPress={this.onAddPhone.bind(this)} isMapPage={true} />
            </View>
          </TouchableWithoutFeedback>
          {this.props.cancelBtnTrigger && Platform.OS == 'ios' && (
            <TouchableOpacity
              onPress={() => {
                this.clickChild(), this.props.toggleCancelBtn(false);
              }}
              style={{
                position: 'absolute',
                zIndex: 2,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                backgroundColor: 'transparent',
              }}
            />
          )}
          <View style={{ alignItems: 'center' }}>
            <ChildDataPane
              visible={infoPaneVisible && objectCount > 0}
              child={activeObject}
              onShowHideKidPhoneProblemsModal={this.onShowHideKidPhoneProblemsModal}
              defaultValue={this.state.isRealtimeSwitcherOn}
              onChangeRealtimeSwitcher={this.onChangeRealtimeSwitcher}
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
            this.doRefreshObjectLocation(activeOid);
          }}
          isMapPage={true}
          trialBadgeShown={trialBadgeShown}
          promoBadgeShown={promoBadgeShown}
        />
        {noGpsData ? (
          <View style={styles.noGpsPane}>
            <Text style={styles.noGpsLabel}>{L('enable_gps_on_kid_phone')}</Text>
          </View>
        ) : null}

        {/* {alertPaneVisible ? (
          <View style={[styles.config_alert_pane_outer, objectCount > 1 ? styles.many_kids : styles.one_kid]}>
            <TouchableOpacity style={styles.config_alert_pane} onPress={this.openKidPhoneProblems.bind(this)}>
              <Text style={styles.config_alert_pane_text}>{L('phone_setup_required')}</Text>
              <Image source={require('../img/ic_circle_alert_32.png')} style={styles.config_alert_pane_icon} />
            </TouchableOpacity>
          </View>
        ) : null} */}

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
            false
            /*isParentPraised &&
            'support' !== username &&
            objectsLoaded &&
            0 === objectCount &&
            true === termsOfUseAccepted*/
          }
        />
        <AdvantagesPane
          product={productInfo ? productInfo : {}}
          timerLabel={tryPremiumTimerLabel}
          visible={this.state.advantagesPaneVisible}
          onSuccess={() => this.props.setPremiumThanksVisible(true)}
          onClose={() => this.setState({ advantagesPaneVisible: false })}
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
        />
        <TryPremiumPane
          visible={this.state.tryPremiumPaneVisible}
          onHide={() => {
            UserPrefs.setTryPremiumShown(true);
            this.setState({ tryPremiumPaneVisible: false });
          }}
        />
        <PinCodePane
          visible={showPinCodePane}
          onHide={() => {
            setShowPinCodePane(false);
          }}
        />
        <ConfigureChildPane
          activeChild={activeObject}
          visible={configureChildPaneVisible}
          onHide={() => {
            const { objectsLoaded } = this.props;
            setConfigureChildPaneVisible(false);

            if (objectsLoaded && objectCount > 0 && !UserPrefs.all.dontShowGpsDialog) {
              const now = new Date().getTime();
              const ts = UserPrefs.all.gpsDialogTs;
              var minutes = Math.floor((now - ts) / 1000 / 60);

              if (minutes > 60 * 24) {
                this.setState({ accuracyPaneVisible: true });
              }
            }
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
        {promoBadgeShown && (
          <SalePane
            visible={this.state.salePane || showPromoWebView}
            onHide={() => {
              this.setState({ salePane: false });
              UserPrefs.setPromoWebViewShown(true);
              setShowPromoWebView(false);
            }}
          />
        )}
        <CoronaSharePane
          visible={this.state.shareCoronaEventVisible}
          onPressCancel={() => {
            this.setState({ shareCoronaEventVisible: false });
            notifyAppShared();
          }}
        />
        <AccuracyPane
          visible={this.state.accuracyPaneVisible}
          onPressCancel={() => this.setState({ accuracyPaneVisible: false })}
        />
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        {isPremiumModalVisible && (
          <PremiumModal
            isVisible={isPremiumModalVisible}
            onHide={this.onShowHidePremiumModal}
            onGoToPaymentMethod={(productId) =>
              NavigationService.navigate('PayWithBankCard', { productId, backTo: 'Main' })
            }
            onPayWithIFree={(productId, kind) =>
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
        {this.state.isKidPhoneProblemsModalVisible && (
          <KidPhoneProblemsModal
            isVisible={this.state.isKidPhoneProblemsModalVisible}
            onHide={this.onShowHideKidPhoneProblemsModal}
            activeObject={activeObject}
            objects={objects}
            userId={userId}
          />
        )}
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
  state = {
    now: new Date().getTime(),
  };
  timer = null;

  componentDidMount() {
    const { setTryPremiumTimerLabel } = this.props;

    const MAX_PREMIUM_TIME = 24 * 60 * 60 * 1000;
    const _this = this;
    const timerFunc = () => {
      try {
        const state = { now: new Date().getTime() };
        const installTs = UserPrefs.all.installTs;
        if (installTs) {
          const diff = new Date().getTime() - UserPrefs.all.installTs;
          const timeLeft = MAX_PREMIUM_TIME - diff;
          setTryPremiumTimerLabel(timeLeft > 0 ? soundBalanceToStr(timeLeft) : null);
        }
        _this.setState(state);
      } catch (e) {}
    };

    timerFunc();
    this.timer = setInterval(timerFunc, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { objects, activeOid } = this.props;

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
    objects,
    activeOid,
    objectsLoaded,
    placesLoaded,
    positionVer,
    navigateOidFirstTime,
    pushToken,
    addrMap,
    wifiAddrMap,
    coordMode,
    configureChildPaneVisible,
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
    ossButtonImageUrl,
    promoData,
    showPromoWebView,
    showPinCodePane,
    providerPremium,
    iapItemsError,
  } = state.controlReducer;
  const { premium, demo, username, userId } = state.authReducer;
  const products = state.controlReducer.products;
  const { cancelBtnTrigger, isPremiumModalVisible, alertObj } = state.popupReducer;

  return {
    userId,
    premiumThanksVisible,
    isActiveFreeTrialModalVisible,
    products,
    username,
    demo,
    objects,
    activeOid,
    objectsLoaded,
    placesLoaded,
    positionVer,
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
    configureChildPaneVisible,
    iapReady,
    tryPremiumTimerLabel,
    addPhoneCode,
    ossToken,
    ossButtonImageUrl,
    promoData,
    showPromoWebView,
    showPinCodePane,
    providerPremium,
    cancelBtnTrigger,
    iapItemsError,
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
    setConfigureChildPaneVisible: bindActionCreators(controlActionCreators.setConfigureChildPaneVisible, dispatch),
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
    addPhoneTracker: bindActionCreators(controlActionCreators.addPhoneTracker, dispatch),
    stopAddPhoneTracker: bindActionCreators(controlActionCreators.stopAddPhoneTracker, dispatch),
    clearAddPhoneCode: bindActionCreators(controlActionCreators.clearAddPhoneCode, dispatch),
    setUserProperty: bindActionCreators(controlMiddlewareActionCreators.setUserProperty, dispatch),
    setUserAdId: bindActionCreators(controlMiddlewareActionCreators.setUserAdId, dispatch),
    modifyUserProperty: bindActionCreators(authActionCreators.modifyUserProperty, dispatch),
    linkInviteToken: bindActionCreators(controlActionCreators.linkInviteToken, dispatch),
    setShowPromoWebView: bindActionCreators(controlActionCreators.setShowPromoWebView, dispatch),
    setShowPinCodePane: bindActionCreators(controlActionCreators.setShowPinCodePane, dispatch),
    setOssPinData: bindActionCreators(controlActionCreators.setOssPinData, dispatch),
    sendOssPin: bindActionCreators(controlActionCreators.sendOssPin, dispatch),
    toggleCancelBtn: bindActionCreators(mapCancelBtnActionCreators.mainMapShowHideCancelBtn, dispatch),
    setProductsRussia: bindActionCreators(controlActionCreators.setProductsRussia, dispatch),
    setYooKassaSubscriptions: bindActionCreators(controlActionCreators.setYooKassaSubscriptions, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
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
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ff7c7c',
    padding: 20,
    margin: 20,
  },
  noGpsLabel: {
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
    height: HEADER_HEIGHT + 30,
    backgroundColor: '#ebef04',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
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
  },
  top_shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 25,
    zIndex: 9999,
  },
  cancelledChildOverlay: {
    position: 'absolute',
    zIndex: 2,
    elevation: 2,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomChildrenBar: {
    flex: 1,
    flexDirection: 'row',
    height: 80,
  },
});
