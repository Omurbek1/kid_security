import React, { Fragment } from 'react';
import WebView from 'react-native-webview';
import {
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Linking,
  SafeAreaView,
  Modal,
  BackHandler,
  StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { authActionCreators } from '../reducers/authRedux';
import { L } from '../lang/Lang';
import NavigationService from '../navigation/NavigationService';
import * as Utils from '../Utils';
import RateAppPane from '../components/RateAppPane';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as IAP from '../purchases/Purchases';
import * as RNIap from 'react-native-iap';
import { CustomProgressBar } from '../Utils';
import { waitForConnection } from '../Helper';
import Rest from '../Rest';
import { getHeader } from '../shared/getHeader';
import { AppColorScheme } from '../shared/colorScheme';
import KsButton from '../components/atom/KsButton';
import TakeSurveyPane from '../components/TakeSurveyPane';
import Const from '../Const';
import { GetProductInfo } from '../purchases/PurchasesInterface';
import UserPrefs from '../UserPrefs';
import { NavigationEvents } from 'react-navigation';
import { popupActionCreators } from '../reducers/popupRedux';
import adaptiveText from '../components/textStyles';
import { isCreditCardPaymentIsAllowed } from '../vendor/oss/oss';
import AlertPane from '../components/AlertPane';
import { firebaseAnalitycsForOpenModal, firebaseAnalyticsForBeginCheckout } from '../analytics/firebase/firebase';
import SoundBalanceSalePane from 'components/SoundBalanceSalePane';

const { MONTHLY_AND_VOICE, MIN_30_LIVE_WIRE, MIN_180_LIVE_WIRE } = IAP;

@connectActionSheet
class OnlineSoundInitialPage extends React.Component {
  static navigationOptions = () => {
    return {
      // title: L('menu_wiretapping'),
      // headerTransparent: true,
      // headerStyle: { borderBottomWidth: 0 },
      ...getHeader({ title: L('menu_wiretapping'), noGradient: true }),
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
    loading: true,
    wiretapTimer: 0,
    cancelled: false,
    result: null,
    player: null,
    rateAppVisible: false,
    surveyVisible: false,
    salePaneShown: false,
    wirePromoActive: false,
    showModal: false,
    webview: false,
    isPaymentProblemModalVisible: false,
    country: '',
    productsRussia: [],
    showAlert: false,
  };

  constructor(props) {
    super(props);

    this.onPromoTimeIsUp = this.onPromoTimeIsUp.bind(this);
  }

  onPromoTimeIsUp() {
    this.initSubLiveWirePromo();
  }

  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this.setState({ oid: navigation.getParam('oid') });
  };

  componentDidMount() {
    const country = UserPrefs.all.userLocationCountry;

    this.setState({ country });
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    StatusBar.setBarStyle('light-content');
    if (this.state.showModal) {
      firebaseAnalitycsForOpenModal('paywallSoundAround', true);
    }
  }

  async consumeAll() {
    try {
      const ts = new Date().getTime();
      console.log('RNIap: LIVE: waiting for connection...');
      await waitForConnection(60);
      const ms = new Date().getTime() - ts;
      console.log('RNIap: LIVE: got connection in ' + ms + 'ms');
      Rest.get().debug({ LIVE_connection: ms + 'ms' });
    } catch (e) {
      console.warn('RNIap: LIVE: failed to get connection', e);
      Rest.get().debug({ LIVE_connection: 'timeout' });
    }

    await IAP.tryConsumeProducts(async (purchase) => {
      //console.log(' ============= check: ', purchase);
      if (
        purchase.productId === IAP.MIN_30_LIVE_WIRE_PRODUCT.productId ||
        purchase.productId === IAP.MIN_180_LIVE_WIRE_PRODUCT.productId
      ) {
        const approved = await this.approvePurchase(purchase);
        if (approved && purchase.productId === IAP.MIN_30_LIVE_WIRE_PRODUCT.productId) {
          UserPrefs.setPurchase_30Minutes('');
        }
        if (approved && purchase.productId === IAP.MIN_180_LIVE_WIRE_PRODUCT.productId) {
          UserPrefs.setPurchase_180Minutes('');
        }
        //console.log(' ============= approved: ' + purchase.productId);
        return approved;
      } else {
        await RNIap.finishTransaction(purchase).then(() => {
          console.log('approved IAP Wire Promo Sub', purchase);
        });
        this.setState({ salePaneShown: false });
        return true;
      }
    });

    await this.reloadBalance();
  }

  async approvePurchase(purchase) {
    const { purchaseLiveWire, setOnlineSoundBalance } = this.props;

    let promise = new Promise(async function (resolve, reject) {
      const params = {
        debug: __DEV__ ? true : false,
        purchase,
        products: IAP.MY_PRODUCTS,
      };
      purchaseLiveWire(params, (pr, packet) => {
        console.log(packet);
        const data = packet && packet.data ? packet.data : null;
        if (data && 0 === data.result) {
          setOnlineSoundBalance(data.balance);
          return resolve(true);
        }
        return resolve(false);
      });
    });

    return promise;
  }

  async reloadBalance() {
    const { getOnlineSoundBalance, setOnlineSoundBalance } = this.props;
    const _this = this;
    let promise = new Promise(async function (resolve, reject) {
      getOnlineSoundBalance((pr, packet) => {
        const data = packet && packet.data ? packet.data : null;
        if (data && 0 === data.result) {
          setOnlineSoundBalance(data.balance);
          setTimeout(_this.initSubLiveWirePromo, 100);
        }
        resolve();
      });
    });

    return promise;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    return null;
  }

  async onBonusPress() {
    //Linking.openURL('https://media.kidsecurity.net')

    /*this.setState({ webview: true })
    const { clearFriendTellBonus, notifyAppShared } = this.props;
    notifyAppShared((pr, packet) => {
      const data = packet && packet.data ? packet.data : null;
      if (data && 0 === data.result) {
        clearFriendTellBonus();
        this.reloadBalance();
      }
    });
    await waitForConnection(60);
    this.reloadBalance();*/

    this.setState({ rateAppVisible: true });
  }

  async rateApp() {
    this.setState({ rateAppVisible: false });
    const { clearFriendTellBonus, notifyAppShared } = this.props;
    notifyAppShared((pr, packet) => {
      const data = packet && packet.data ? packet.data : null;
      if (data && 0 === data.result) {
        clearFriendTellBonus();
        this.reloadBalance();
      }
    });

    if ('ios' === Platform.OS) {
      Linking.openURL(Const.IOS_APP_URL);
    } else {
      Linking.openURL(Const.ANDROID_APP_URL);
    }

    await waitForConnection(60);
    this.reloadBalance();
  }

  buySubLiveWire = async () => {
    const purchase = await this.buyProduct('sub_live_wire_promo', true);
    if (purchase) {
      console.log(' >>>>>>>>>>>>>>>>>>> MARK PROMO BOUGHT');
      UserPrefs.setOnlineSoundPromoBought(true);
    }
  };

  initSubLiveWirePromo = async () => {
    // for users that have < 3 minutes, but firstly updated app for this release
    const { onlineSoundBalance, wireValid } = this.props;

    const ts = await UserPrefs.getOnlineSoundPromoStartTs();
    let promoStartTs = ts ? new Date(ts) : null;
    let promoDialogShown = await UserPrefs.getOnlineSoundPromoDialogShown();
    let salePaneShown = this.state;

    if (wireValid) {
      if (promoStartTs) {
        // clear promo and quit if wire subscription was bought
        console.log(' >>>>>>>>>>>>>>>>>>> CLEARING PROMO DUE TO SUBS');
        await UserPrefs.setOnlineSoundPromoDialogShown(false);
        await UserPrefs.setOnlineSoundPromoStartTs(null);
        this.setState({
          promoStartTs: null,
          promoDialogShown: false,
          salePaneShown: false,
          wirePromoActive: false,
        });
      }
      return;
    }

    // it's time to start promo?
    console.log(
      ' >>>>>>>>>>>>>>>>>>> promoStartTs=',
      promoStartTs,
      'low_balance=',
      onlineSoundBalance < Const.WIRE_PROMO_BALANCE_TRIGGER,
      'wirevalid=',
      wireValid
    );
    if (!promoStartTs && onlineSoundBalance < Const.WIRE_PROMO_BALANCE_TRIGGER) {
      const alreadyBought = await UserPrefs.getOnlineSoundPromoBought();
      if (!alreadyBought) {
        console.log(' >>>>>>>>>>>>>>>>>>> STARTING PROMO');
        promoDialogShown = false;
        await UserPrefs.setOnlineSoundPromoDialogShown(false);
        promoStartTs = new Date();
        await UserPrefs.setOnlineSoundPromoStartTs(promoStartTs.getTime());
      } else {
        console.log(' >>>>>>>>>>>>>>>>>>> PROMO ALREADY BOUGHT');
      }
    }

    const now = new Date().getTime();
    const wirePromoActive = null != promoStartTs && now - promoStartTs.getTime() < Const.MAX_WIRE_PROMO_BUY_TIME;
    salePaneShown = wirePromoActive && !promoDialogShown;
    if (salePaneShown) {
      await UserPrefs.setOnlineSoundPromoDialogShown(true);
    }

    // if promo was started and timed out + balance refilled - clear promo to allow it to be started again
    console.log(
      ' >>>>>>>>>>>>>>>>>>> promoStartTs=',
      promoStartTs,
      ' wirePromoActive=',
      wirePromoActive,
      onlineSoundBalance >= Const.WIRE_PROMO_BALANCE_TRIGGER
    );
    if (promoStartTs && !wirePromoActive && onlineSoundBalance >= Const.WIRE_PROMO_BALANCE_TRIGGER) {
      console.log(' >>>>>>>>>>>>>>>>>>> CLEARING PROMO DUE TO TIME OUT AND REFILL');
      await UserPrefs.setOnlineSoundPromoDialogShown(false);
      await UserPrefs.setOnlineSoundPromoStartTs(null);
      promoStartTs = null;
      promoDialogShown = false;
      salePaneShown = false;
    }

    this.setState({
      promoStartTs,
      wirePromoActive,
      salePaneShown,
      promoDialogShown: promoDialogShown || salePaneShown,
    });
  };

  async takeSurvey() {
    this.setState({ surveyVisible: false });
    const { notifyQuestionaryPassed, clearSurveyBonus } = this.props;
    notifyQuestionaryPassed((pr, packet) => {
      Linking.openURL(Const.SURVEY_URL);
      const data = packet && packet.data ? packet.data : null;
      if (data && 0 === data.result) {
        clearSurveyBonus();
        this.reloadBalance();
      }
    });

    await waitForConnection(60);
    this.reloadBalance();
  }

  showPurchasesDialog() {
    const { liveMonthlyPrice, live30MinutesPrice, live180MinutesPrice } = this.props;

    options = [];
    if (liveMonthlyPrice) {
      options.push(L('wire_monthly', [liveMonthlyPrice]));
    }
    if (live30MinutesPrice) {
      options.push(L('wire_30_min', [live30MinutesPrice]));
    }
    if (live180MinutesPrice) {
      options.push(L('wire_180_min', [live180MinutesPrice]));
    }
    options.push(L('close'));

    const cancelButtonIndex = options.length - 1;
    const title = null;

    this.props.showActionSheetWithOptions(
      {
        title,
        options,
        destructiveButtonIndex: 0,
        cancelButtonIndex,
        textStyle: { flex: 1, borderWidth: 1, margin: 20, padding: 10, textAlign: 'center', borderRadius: 10 },
      },
      async (buttonIndex) => {
        if (buttonIndex == cancelButtonIndex) {
          return;
        }
        let result = null;
        if (0 === buttonIndex) {
          // monthly unlim
          this.buyProduct('monthly_wire');
        } else if (1 === buttonIndex) {
          // 30 minutes
          this.buyProduct('min_30_wire');
        } else if (2 === buttonIndex) {
          // 180 minues
          this.buyProduct('min_180_wire');
        }

        if (result && result.cancelled) {
          return;
        }
      }
    );
  }

  onBuy = (kind, isSubLiveWire, productId) => {
    const { country } = this.state;

    if (country && country === 'Russia' && isCreditCardPaymentIsAllowed()) {
      this.setState({ showModal: false });

      NavigationService.navigate('PaymentMethod', {
        productId,
        kind,
        isSubLiveWire,
        backTo: 'OnlineSoundInitial',
        isSubscription: false,
        showPremium: false,
      });
    } else {
      this.buyProduct(kind, isSubLiveWire);
    }
  };

  async buyProduct(kind, isSubLiveWire) {
    const { showSuccessfulSubscriptionModal, showThanksForMinutesPurchaseModal } = this.props;

    this.openProgressbar(L('processing_purchase'));
    const result = await IAP.buyLiveWire(this, kind);
    const { purchase, cancelled, error } = result;
    if (error) {
      if (isSubLiveWire) {
        this.onShowHidePaymentProblemModal();
      }

      this.hideProgressbar();

      return;
    }

    if (cancelled) {
      // TODO: dirty hack for android due to billing bug somewhere in iap native module
      if ('android' === Platform.OS && 'E_UNKNOWN' === error) {
        console.log('RNIap: BUG WORKAROUND: consuming all items...');
        try {
          await this.consumeAll();
        } catch (e) {
          console.warn(e);
        }
      }

      if (isSubLiveWire) {
        this.onShowHidePaymentProblemModal();
      }

      this.hideProgressbar();
      return;
    }

    try {
      await this.consumeAll();
      this.setState({ showModal: false });

      if (kind !== 'month_and_voice') {
        showThanksForMinutesPurchaseModal(true);
      }

      showSuccessfulSubscriptionModal(true);
    } catch (e) {
      console.warn(e);
    }

    this.hideProgressbar();
    return purchase;
  }

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onStartRecording() {
    const {
      onlineSoundBalance,
      wireValid,
      navigation,
      objects,
      showAlert,
    } = this.props;
    const oid = navigation.getParam('oid');
    var obj = objects[oid + ''];

    if (!obj) {
      this.setState({ showAlert: true });
      return;
    }

    if (onlineSoundBalance < 1 && !wireValid) {
      showAlert(true, L('error'), L('please_top_up_sound_balance'));
      return;
    }

    NavigationService.navigate('OnlineSoundProgress', { oid });
  }

  async onDidFocus() {
    await this.consumeAll();
  }

  onShowHidePaymentProblemModal = () => {
    const { isPaymentProblemModalVisible } = this.state;

    this.setState({ isPaymentProblemModalVisible: !isPaymentProblemModalVisible });
  };

  onBackButtonPress = () => {
    const { showModal } = this.state;
    const pageName = NavigationService.currentPageName();

    if (pageName === 'OnlineSoundInitial') {
      if (showModal) {
        this.setState({ showModal: false });
      } else {
        NavigationService.back();
      };
      return true;
    }

    return false;
  };

  render() {
    const {
      navigation,
      objects,
      onlineSoundBalance,
      friendTellBonus,
      wireValid,
      iapReady,
      //questionaryBonusUsed,
      products,
      buyLiveWireSubTimerLabel,
      liveMonthlyPrice,
      live30MinutesPrice,
      live180MinutesPrice,
      liveMonthlyProductId,
      live30MinutesProductId,
      live180MinutesProductId,
      productsRussia,
      iapItemsError,
      showAlert,
    } = this.props;
    const { wirePromoActive, webview, country } = this.state;

    const isRussia = country === 'Russia' && isCreditCardPaymentIsAllowed();

    const liveMonthlyRussia = productsRussia.find((item) => item.id === MONTHLY_AND_VOICE);
    const live30MinutesRussia = productsRussia.find((item) => item.id === MIN_30_LIVE_WIRE);
    const live180MinutesRussia = productsRussia.find((item) => item.id === MIN_180_LIVE_WIRE);
    const liveMonthlyRussiaPrice = liveMonthlyRussia ? liveMonthlyRussia.price : '...';
    const live30MinutesRussiaPrice = live30MinutesRussia ? live30MinutesRussia.price : '...';
    const live180MinutesRussiaPrice = live180MinutesRussia ? live180MinutesRussia.price : '...';
    const liveMonthlyRussiaId = liveMonthlyRussia ? liveMonthlyRussia.id : '...';
    const live30MinutesRussiaId = live30MinutesRussia ? live30MinutesRussia.id : '...';
    const live180MinutesRussiaId = live180MinutesRussia ? live180MinutesRussia.id : '...';

    const _liveMonthlyPrice = isRussia ? `${liveMonthlyRussiaPrice} руб` : liveMonthlyPrice;
    const _live30MinutesPrice = isRussia ? `${live30MinutesRussiaPrice} руб` : live30MinutesPrice;
    const _live180MinutesPrice = isRussia ? `${live180MinutesRussiaPrice} руб` : live180MinutesPrice;
    const _liveMonthlyId = isRussia ? liveMonthlyRussiaId : liveMonthlyProductId;
    const _live30MinutesId = isRussia ? live30MinutesRussiaId : live30MinutesProductId;
    const _live180MinutesId = isRussia ? live180MinutesRussiaId : live180MinutesProductId;

    const questionaryBonusUsed = true; // disable survey
    const oid = navigation.getParam('oid');
    const object = objects[oid + ''];
    const iosChatObject = Utils.isIosChatObject(object);
    const soundBalance = wireValid ? '∞' : Utils.soundBalanceToStr(onlineSoundBalance);
    const sub_live_wire_promo = GetProductInfo('SUB_LIVE_WIRE_PROMO', products);
    // console.log(
    //   'ios: ',
    //   'balance<3',
    //   onlineSoundBalance < Const.WIRE_PROMO_BALANCE_TRIGGER,
    //   'isValid',
    //   wireValid,
    //   'timer',
    //   buyLiveWireSubTimerLabel,
    //   'minutesAccrued',
    //   UserPrefs.all.minutesAccrued,
    //   'iapReady',
    //   iapReady,
    //   'time',
    //   Utils.soundBalanceToStr(UserPrefs.all.installWireTs)
    // );

    const ModalOptionButton = ({
      bestOption,
      label,
      badge,
      onPress,
      style = undefined,
      textStyle = undefined,
      badgeStyle = undefined,
    }) => {
      let newStyle = { ...(style || styles.modalOptionBtn) };
      let newTextStyle = { ...(textStyle || styles.modalOptionBtnText), ...adaptiveText.textSize(15) };
      let newBadgeStyle = { ...(badgeStyle || styles.modalOptionBtnBadgeText), ...adaptiveText.textSize(11) };
      return (
        <TouchableOpacity style={[newStyle, bestOption && { backgroundColor: '#ef4c77' }]} onPress={onPress}>
          {badge && <Text style={newBadgeStyle}>{badge}</Text>}
          <Text style={[newTextStyle, bestOption && { color: '#fff' }]}>{label}</Text>
        </TouchableOpacity>
      );
    };
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <NavigationEvents onDidFocus={this.onDidFocus.bind(this)} />
        <View style={styles.mainContainer}>
          {webview ? (
            <WebView
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              startInLoadingState
              source={{ uri: 'https://media.kidsecurity.net' }}
            />
          ) : (
            <View style={styles.whiteBox}>
              <View style={styles.container}>
                <View style={styles.topButtonsWrapper}>
                  {wirePromoActive && iapReady && (!country || country !== 'Russia') ? (
                    <Fragment>
                      <ConnectedOnlineSoundHeader onPromoTimeIsUp={this.onPromoTimeIsUp} />
                      <TouchableOpacity
                        style={styles.subscriptionSaleButton}
                        onPress={() => {
                          this.setState({ salePaneShown: true });
                        }}>
                        <Image style={styles.freeMark} source={require('../img/ic_open_gift_box.png')} />
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ color: '#000', fontSize: 12 }}>{`${L('event')}!`}</Text>
                          <Text style={{ color: '#000', fontSize: 12 }}>{buyLiveWireSubTimerLabel}</Text>
                        </View>
                      </TouchableOpacity>
                    </Fragment>
                  ) : (
                    <View />
                  )}
                  <TouchableOpacity style={styles.freeMinutesButton} onPress={this.props.popupInviteFriendShowHide}>
                    <Image style={styles.freeMark} source={require('../img/ic_free_mark.png')} />
                    <Text style={{ color: '#000', fontSize: 12, width: '75%' }}>
                      {L('how_to_get_minutes_for_free')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingBottom: 10 }}>
                  {iosChatObject ? (
                    <Text style={styles.unavailable_text}>{L('online_recording_is_unavailable')}</Text>
                  ) : (
                    <TouchableOpacity style={styles.play_button} onPress={this.onStartRecording.bind(this)}>
                      <View style={styles.play_button_icon_outer}>
                        <Icon
                          style={styles.play_button_icon}
                          type="material-community"
                          name="play"
                          color="white"
                          size={30}
                        />
                      </View>
                      <Text style={styles.play_button_text}>{L('start_listening')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={[
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
                    { marginTop: 20 },
                  ]}>
                  <Text style={{ fontSize: 14, color: 'black' }}>{L('minutes_balance')}</Text>
                  <View style={{ width: 10 }}></View>
                  <Text style={{ fontSize: 16, color: 'black' }}>{soundBalance}</Text>
                </View>
                {friendTellBonus > 0 && questionaryBonusUsed ? (
                  <TouchableOpacity style={styles.bonus} onPress={this.onBonusPress.bind(this)}>
                    <Text style={styles.bonus_hint}>{L('rate_app_and_get_free_minutes')}</Text>
                  </TouchableOpacity>
                ) : null}

                <View style={styles.bottomButton}>
                  <KsButton
                    titleStyle={{ textAlign: 'center', fontSize: 16 }}
                    disabled={country !== 'Russia' && !iapReady}
                    style={{ paddingVertical: 15, paddingHorizontal: 40 }}
                    onPress={() => {
                      if (iapItemsError && this.state.country !== 'Russia') {
                        showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
                      } else {
                        if (country === 'Russia' || iapReady) {
                          firebaseAnalitycsForOpenModal('paywallSoundAround', true);
                          this.setState({ showModal: true });
                        }
                      }
                    }}
                    title={L('buy_minutes')}
                  />
                  <Modal
                    animationType="fade"
                    visible={this.state.showModal}
                    transparent={true}
                    onRequestClose={this.onBackButtonPress}>
                    <View style={styles.modalWrapper}>
                      <TouchableOpacity
                        style={{ height: '100%', width: '100%' }}
                        onPress={() => {
                          this.setState({ showModal: false });
                        }}
                      />
                      <View style={styles.modalContainer}>
                        {_liveMonthlyPrice && (
                          <ModalOptionButton
                            bestOption={true}
                            label={L('unlim_wire_subsc', [_liveMonthlyPrice])}
                            badge={L('most_popular')}
                            onPress={(event) => {
                              event.stopPropagation();
                              firebaseAnalyticsForBeginCheckout('month_and_voice');
                              this.onBuy('month_and_voice', false, _liveMonthlyId);
                            }}
                          />
                        )}
                        {_live180MinutesPrice && (
                          <ModalOptionButton
                            label={L('wire_180_min', [_live180MinutesPrice])}
                            onPress={(event) => {
                              event.stopPropagation();
                              firebaseAnalyticsForBeginCheckout('min_180_wire');
                              this.onBuy('min_180_wire', false, _live180MinutesId);
                            }}
                          />
                        )}
                        {_live30MinutesPrice && (
                          <ModalOptionButton
                            label={L('wire_30_min', [_live30MinutesPrice])}
                            onPress={(event) => {
                              event.stopPropagation();
                              firebaseAnalyticsForBeginCheckout('min_30_wire');
                              this.onBuy('min_30_wire', false, _live30MinutesId);
                            }}
                          />
                        )}
                        <ModalOptionButton
                          label={L('close')}
                          style={styles.modalCloseBtn}
                          textStyle={styles.modalOptionBtnText}
                          onPress={(event) => {
                            event.stopPropagation();
                            this.setState({ showModal: false });
                          }}
                        />
                      </View>
                    </View>
                    <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
                  </Modal>
                </View>
              </View>
            </View>
          )}

          <SoundBalanceSalePane
            product={sub_live_wire_promo}
            visible={this.state.salePaneShown && iapReady && (!this.state.country || this.state.country !== 'Russia')}
            timerLabel={buyLiveWireSubTimerLabel}
            onPressCancel={() => {
              this.setState({ salePaneShown: false });
            }}
            onPressBuy={() => {
              if (iapItemsError && this.state.country !== 'Russia') {
                showAlert(true, L('error'), L('not_data'), true, L('if_try_write_us'));
              } else {
                this.buySubLiveWire();
              }
            }}
            isPaymentProblemModalVisible={this.state.isPaymentProblemModalVisible}
            onShowHidePaymentProblemModal={this.onShowHidePaymentProblemModal}
          />

          <RateAppPane
            visible={this.state.rateAppVisible}
            onPressCancel={() => this.setState({ rateAppVisible: false })}
            onPressRate={this.rateApp.bind(this)}
          />
          <TakeSurveyPane
            visible={this.state.surveyVisible}
            onPressSurvey={this.takeSurvey.bind(this)}
            onPressCancel={() => this.setState({ surveyVisible: false })}
          />
        </View>
        <AlertPane
          visible={this.state.showAlert}
          titleText={L('add_wiretapping')}
          actionButtonText={L('add')}
          onPressAction={() => {
            this.setState({ showAlert: false });
            NavigationService.forceReplace('Main', {});
            NavigationService.navigate('AddPhone', {});
          }}
        />
      </SafeAreaView>
    );
  }
}

class OnlineSoundHeader extends React.Component {
  state = {
    now: new Date().getTime(),
  };
  timer = null;

  async componentDidMount() {
    const { setBuyLiveWireSubTimerLabel } = this.props;

    await UserPrefs.loadAll();
    const { all } = UserPrefs;
    const _this = this;
    const timerFunc = () => {
      try {
        const state = { now: new Date().getTime() };
        const startTs = all.onlineSoundPromoStartTs;
        if (startTs) {
          const diff = new Date().getTime() - startTs;
          const timeLeft = Const.MAX_WIRE_PROMO_BUY_TIME - diff;
          setBuyLiveWireSubTimerLabel(timeLeft > 0 ? Utils.soundBalanceToStr(timeLeft) : null);
          if (timeLeft <= 0) {
            clearInterval(_this.timer);
            _this.props.onPromoTimeIsUp();
          }
        }
        _this.setState(state);
      } catch (e) { }
    };

    timerFunc();
    this.timer = setInterval(timerFunc, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <View></View>;
  }
}

const mapStateToPropsHeader = (state) => {
  const { objects, activeOid, buyLiveWireSubTimerLabel, wireValid } = state.controlReducer;
  const { onlineSoundBalance } = state.authReducer;

  return {
    objects,
    activeOid,
    onlineSoundBalance,
    wireValid,
    buyLiveWireSubTimerLabel,
  };
};

const mapDispatchToPropsHeader = (dispatch) => {
  return {
    setBuyLiveWireSubTimerLabel: bindActionCreators(controlActionCreators.setBuyLiveWireSubTimerLabel, dispatch),
  };
};

const ConnectedOnlineSoundHeader = connect(mapStateToPropsHeader, mapDispatchToPropsHeader)(OnlineSoundHeader);

const mapStateToProps = (state) => {
  const {
    objects,
    wiretappedRecords,
    liveMonthlyPrice,
    live30MinutesPrice,
    live180MinutesPrice,
    liveMonthlyProductId,
    live30MinutesProductId,
    live180MinutesProductId,
    wireValid,
    iapReady,
    products,
    buyLiveWireSubTimerLabel,
    showBuyLiveWirePromoPane,
    productsRussia,
    iapItemsError,
  } = state.controlReducer;
  const { onlineSoundBalance, friendTellBonus, questionaryBonusUsed } = state.authReducer;

  return {
    objects,
    wiretappedRecords,
    onlineSoundBalance,
    friendTellBonus,
    liveMonthlyPrice,
    live30MinutesPrice,
    live180MinutesPrice,
    liveMonthlyProductId,
    live30MinutesProductId,
    live180MinutesProductId,
    wireValid,
    questionaryBonusUsed,
    iapReady,
    products,
    buyLiveWireSubTimerLabel,
    showBuyLiveWirePromoPane,
    productsRussia,
    iapItemsError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    popupInviteFriendShowHide: bindActionCreators(popupActionCreators.popupInviteFriendShowHide, dispatch),
    getOnlineSoundBalance: bindActionCreators(controlActionCreators.getOnlineSoundBalance, dispatch),
    notifyAppShared: bindActionCreators(controlActionCreators.notifyAppShared, dispatch),
    deleteObjectMail: bindActionCreators(controlActionCreators.deleteObjectMail, dispatch),
    notifyQuestionaryPassed: bindActionCreators(controlActionCreators.notifyQuestionaryPassed, dispatch),
    purchaseLiveWire: bindActionCreators(controlActionCreators.purchaseLiveWire, dispatch),
    setOnlineSoundBalance: bindActionCreators(authActionCreators.setOnlineSoundBalance, dispatch),
    clearFriendTellBonus: bindActionCreators(authActionCreators.clearFriendTellBonus, dispatch),
    clearSurveyBonus: bindActionCreators(authActionCreators.clearSurveyBonus, dispatch),
    setBuyLiveWireSubTimerLabel: bindActionCreators(controlActionCreators.setBuyLiveWireSubTimerLabel, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showThanksForMinutesPurchaseModal: bindActionCreators(popupActionCreators.showThanksForMinutesPurchaseModal, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OnlineSoundInitialPage);

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    padding: 10,
    paddingTop: 80,
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'center',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
  },
  request_button: {
    marginTop: 0,
    borderRadius: 20,
    width: 220,
    height: 50,
  },
  whiteBox: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    alignContent: 'stretch',
    overflow: 'hidden',
  },
  play_button: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: AppColorScheme.accent,
    borderRadius: 25,
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  play_button_icon: {},
  play_button_icon_outer: {
    width: 50,
    height: 50,
    backgroundColor: AppColorScheme.accent,
    borderRadius: 24,
    overflow: 'hidden',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  play_button_text: {
    textAlign: 'center',
    flex: 1,
    color: AppColorScheme.accent,
  },
  balance: {
    flexDirection: 'column',
    alignContent: 'stretch',
    alignItems: 'center',
  },
  balance_hint: {
    textAlign: 'center',
  },
  balance_value: {
    textAlign: 'center',
  },
  bonus: {
    flexDirection: 'column',
    alignContent: 'stretch',
    alignItems: 'center',
  },
  bonus_hint: {
    textAlign: 'center',
    color: '#bebebe',
    textDecorationLine: 'underline',
  },
  bottomButton: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailable_text: {
    textAlign: 'center',
    opacity: 0.75,
  },
  topButtonsWrapper: {
    position: 'absolute',
    left: 0,
    right: 10,
    top: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscriptionSaleButton: {
    width: '45%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#00ca50',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.47,
    shadowRadius: 4.65,
    elevation: 6,
  },
  freeMinutesButton: {
    flexDirection: 'row',
    backgroundColor: '#ffff00',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.47,
    shadowRadius: 4.65,
    elevation: 6,
  },
  freeMark: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  modalWrapper: {
    height: '100%',
    backgroundColor: '#00000055',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: 250,
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  modalOptionBtn: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ED4B77FF',
    margin: 8,
    padding: 10,
  },
  modalOptionBtnText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOptionBtnBadgeText: {
    position: 'absolute',
    padding: 3,
    paddingHorizontal: 10,
    top: -15,
    right: -10,
    borderRadius: 5,
    backgroundColor: '#80A0E2FF',
    color: '#FFF',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  modalCloseBtn: {
    margin: 8,
    padding: 8,
  },
  modalCloseBtnText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
