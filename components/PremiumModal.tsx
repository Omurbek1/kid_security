import React from 'react';
import {
  StyleSheet,
  Modal,
  View,
  Text,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  BackHandler,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Carousel from 'react-native-snap-carousel';
import * as RNIap from 'react-native-iap';
import GestureRecognizer from 'react-native-swipe-gestures';
import { popupActionCreators } from '../reducers/popupRedux';
import { L } from '@lang';


import { NewColorScheme } from '../shared/colorScheme';
import { GetProductInfo } from '../purchases/PurchasesInterface';
import * as IAP from '../purchases/Purchases';
import { CustomProgressBar } from '../Utils';
import UserPrefs from '../UserPrefs';
import { AvailableFeaturesModal, SwiperSlide } from './';
import { isCreditCardPaymentIsAllowed } from '../vendor/oss/oss';
import { firebaseAnalitycsForOpenModal, firebaseAnalyticsForBeginCheckout } from '../analytics/firebase/firebase';
import { CustomAlert } from '../components';

const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(width * 0.65);
const isIOS = Platform.OS === 'ios';
const { GREY_COLOR_3, BLACK_COLOR, ORANGE_COLOR_1, PINK_COLOR_1, ORANGE_COLOR_2_RGB } = NewColorScheme;
const { MONTHLY_AND_VOICE, MONTHLY_LIVE_WIRE, MONTHLY_PREMIUM } = IAP;
const MONTHLY_PREMIUM_RUSSIA = 'kz.sirius.siriuskids.sub_month';
const cancelSubscriptionLink = 'https://play.google.com/store/account/subscriptions';

interface PremiumModalProps {
  isVisible: boolean;
  products: [];
  onHide: () => void;
  onGoToPaymentMethod: (productId: string) => void;
  onSuccess: () => void;
  productsRussia: any[];
  YooKassaSubscriptions: any[];
  subscriptionInfoPacket: {};
  onPayWithIFree: (productId: string, kind: string) => void;
  showAlert: (
    isVisible: boolean,
    title: string,
    subtitle: string,
    isSupportVisible?: boolean,
    supportText?: string,
    actionTitle?: string,
    actions?: []
  ) => void;
  alertObj: {};
}

interface PremiumModalState {
  isFeaturesModalVisible: boolean;
  country: string;
  isProgress: boolean;
  progressTitle: string;
  activeIndex: number;
}

class PremiumModal extends React.Component<PremiumModalProps, PremiumModalState> {
  state = {
    isFeaturesModalVisible: false,
    country: '',
    isProgress: false,
    progressTitle: null,
    activeIndex: 0,
  };

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  async componentDidMount() {
    const { isVisible } = this.props;
    const country = UserPrefs.all.userLocationCountry;

    this.setState({ country });
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
    if (isVisible) {
      firebaseAnalitycsForOpenModal('paywallSecond', true);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onShowHideFunctionsModal = () => {
    const { isFeaturesModalVisible } = this.state;

    this.setState({ isFeaturesModalVisible: !isFeaturesModalVisible });
  };

  keyExtractor = (_, index: number): string => `${index}`;

  openProgressbar = (title: string) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onSwiperPress = (kind: string, productId?: string) => {
    firebaseAnalyticsForBeginCheckout(kind);
    const { country } = this.state;
    const { onHide, onGoToPaymentMethod, onPayWithIFree } = this.props;

    if (country && country === 'Russia' && isCreditCardPaymentIsAllowed()) {
      onHide();

      if (productId === MONTHLY_AND_VOICE) {
        onPayWithIFree(productId, kind);
      } else {
        onGoToPaymentMethod(productId);
      }
    } else {
      this.onBuyPremium(kind);
    }
  };

  async onBuyPremium(kind: string) {
    const { onHide, onSuccess, showAlert } = this.props;
    this.openProgressbar(L('processing_purchase'));

    const result = await IAP.buyPremium(this, kind);
    const { purchase, cancelled, error } = result;

    if (error === 'E_ALREADY_OWNED') {
      showAlert(true, L('premium_account'), L('premium_already_purchased'));
      this.hideProgressbar();
      return;
    }

    if (error || cancelled) {
      this.hideProgressbar();

      return;
    }

    const ok = await IAP.verifyPurchase(purchase);

    if (ok) {
      await IAP.tryConsumeProducts(async (purchase) => {
        await RNIap.finishTransaction(purchase).then(() => {
          console.log('approved IAP Premium', purchase);
        });
      });

      this.hideProgressbar();
      onHide();
      setTimeout(onSuccess, 500);
    } else {
      setTimeout(() => {
        showAlert(
          true,
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : ''])
        );
      }, 250);
      return;
    }
  }

  renderItem({ item }) {
    return item.render();
  }

  onBackButtonPress = () => {
    const { isVisible, onHide } = this.props;

    if (isVisible) {
      onHide();
      return true;
    }

    return false;
  };

  render() {
    const { isVisible, products, onHide, productsRussia, YooKassaSubscriptions, subscriptionInfoPacket, alertObj } =
      this.props;
    const { isFeaturesModalVisible, isProgress, progressTitle, activeIndex, country } = this.state;
    const {
      container,
      innerContainer,
      header,
      topTitle,
      youHaveText,
      topWrapper,
      mediumWrapper,
      bottomWrapper,
      separator,
      bottomTitle,
      policyText,
      dot,
      footerTop,
      alignCenter,
      dotsContainer,
      flexStyle,
      closeBtn,
      closeImg,
      underlinedText,
    } = styles;

    const isRussia = country === 'Russia' && isCreditCardPaymentIsAllowed();
    const getBackgroundColor = (index: number) => (activeIndex === index ? PINK_COLOR_1 : 'rgba(243, 105, 137, 0.3)');

    const monthlyWithVoiceNormal = GetProductInfo('MONTHLY_AND_VOICE', products);
    const monthlyWithWireNormal = GetProductInfo('MONTHLY_LIVE_WIRE', products);
    const monthlyPremiumNormal = GetProductInfo('MONTHLY_PREMIUM', products);
    const monthlyWithVoiceNormalPrice = monthlyWithVoiceNormal ? monthlyWithVoiceNormal.localizedPrice : '...';
    const monthlyWithWireNormalPrice = monthlyWithWireNormal ? monthlyWithWireNormal.localizedPrice : '...';
    const monthlyPremiumNormalPrice = monthlyPremiumNormal ? monthlyPremiumNormal.localizedPrice : '...';
    const monthlyWithVoiceNormalId = monthlyWithVoiceNormal ? monthlyWithVoiceNormal.productId : '...';
    const monthlyWithWireNormalId = monthlyWithWireNormal ? monthlyWithWireNormal.productId : '...';
    const monthlyPremiumNormalId = monthlyPremiumNormal ? monthlyPremiumNormal.productId : '...';

    const monthlyWithVoiceRussia = productsRussia.find((item) => item.id === MONTHLY_AND_VOICE);
    const monthlyWithWireRussia = productsRussia.find((item) => item.id === MONTHLY_LIVE_WIRE);
    const monthlyPremiumRussia = productsRussia.find((item) => item.id === MONTHLY_PREMIUM_RUSSIA);
    const monthlyWithVoiceRussiaPrice = monthlyWithVoiceRussia ? monthlyWithVoiceRussia.price : '...';
    const monthlyWithWireRussiaPrice = monthlyWithWireRussia ? monthlyWithWireRussia.price : '...';
    const monthlyPremiumRussiaPrice = monthlyPremiumRussia ? monthlyPremiumRussia.price : '...';
    const monthlyWithVoiceRussiaId = monthlyWithVoiceRussia ? monthlyWithVoiceRussia.id : '...';
    const monthlyWithWireRussiaId = monthlyWithWireRussia ? monthlyWithWireRussia.id : '...';
    const monthlyPremiumRussiaId = monthlyPremiumRussia ? monthlyPremiumRussia.id : '...';

    const monthlyWithVoicePrice = isRussia ? `${monthlyWithVoiceRussiaPrice} руб` : monthlyWithVoiceNormalPrice;
    const monthlyWithWirePrice = isRussia ? `${monthlyWithWireRussiaPrice} руб` : monthlyWithWireNormalPrice;
    const monthlyPremiumPrice = isRussia ? `${monthlyPremiumRussiaPrice} руб` : monthlyPremiumNormalPrice;

    const monthlyWithVoiceId = isRussia ? monthlyWithVoiceRussiaId : monthlyWithVoiceNormalId;
    const monthlyWithWireId = isRussia ? monthlyWithWireRussiaId : monthlyWithWireNormalId;
    const monthlyPremiumId = isRussia ? monthlyPremiumRussiaId : monthlyPremiumNormalId;

    const hasSubscriptions = YooKassaSubscriptions.length > 0;
    let subscriptionType = '';

    if (isRussia) {
      if (hasSubscriptions) {
        switch (YooKassaSubscriptions[0].productId) {
          case MONTHLY_AND_VOICE:
            subscriptionType = L('unlimite_month');
            break;
          case MONTHLY_LIVE_WIRE:
            subscriptionType = L('unlim_live');
            break;
          case MONTHLY_PREMIUM_RUSSIA:
            subscriptionType = L('monthly_premium');
            break;
        }
      }
    } else {
      let productId = '';

      if (subscriptionInfoPacket) {
        const {
          data: { validated },
        } = subscriptionInfoPacket;
        for (let i in validated) {
          productId = i;
        }
      }

      if (productId) {
        switch (productId) {
          case MONTHLY_AND_VOICE:
            subscriptionType = L('unlimite_month');
            break;
          case MONTHLY_LIVE_WIRE:
            subscriptionType = L('unlim_live');
            break;
          case MONTHLY_PREMIUM:
            subscriptionType = L('monthly_premium');
            break;
        }
      }
    }

    const currentUserSubscription = subscriptionType ? subscriptionType : L('free_version');

    const renderSlide1 = () => {
      return (
        <SwiperSlide
          backgroundColor={PINK_COLOR_1}
          title1Text={`${L('online_list_2').replace('+', '')} \n +`}
          title2Text={L('premium_free')}
          dailyPriceText={L('day_ru', [Math.round(monthlyWithVoiceRussiaPrice / 30)])}
          monthlyPriceText={L('month_one', [monthlyWithVoicePrice])}
          isFeature1Available={true}
          isFeature2Available={true}
          isPremiumSlide={true}
          onAllFeaturesPress={this.onShowHideFunctionsModal}
          onSwiperPress={() => this.onSwiperPress('month_and_voice', monthlyWithVoiceId)}
          isRussia={isRussia}
        />
      );
    };

    const renderSlide2 = () => {
      return (
        <SwiperSlide
          backgroundColor={ORANGE_COLOR_2_RGB}
          title1Text={L('online_list_2').replace('+', '')}
          title2Text={L('for_month')}
          dailyPriceText={L('day_ru', [Math.round(monthlyWithWireRussiaPrice / 30)])}
          monthlyPriceText={L('month_one', [monthlyWithWirePrice])}
          isFeature1Available={false}
          isFeature2Available={true}
          mainIcon={require('../img/sound_pink.png')}
          mainIconStyle={{ width: width / 8, height: height / 20 }}
          onAllFeaturesPress={this.onShowHideFunctionsModal}
          onSwiperPress={() => this.onSwiperPress('monthly_wire', monthlyWithWireId)}
          isRussia={isRussia}
        />
      );
    };

    const renderSlide3 = () => {
      return (
        <SwiperSlide
          backgroundColor={ORANGE_COLOR_2_RGB}
          title1Text={L('premium')}
          title2Text={L('for_month')}
          dailyPriceText={L('day_ru', [Math.round(monthlyPremiumRussiaPrice / 30)])}
          monthlyPriceText={L('month_one', [monthlyPremiumPrice])}
          isFeature1Available={true}
          isFeature2Available={false}
          mainIcon={require('../img/premium_pink.png')}
          mainIconStyle={{ width: width / 9, height: height / 20 }}
          onAllFeaturesPress={this.onShowHideFunctionsModal}
          onSwiperPress={() => this.onSwiperPress('month', monthlyPremiumId)}
          isRussia={isRussia}
        />
      );
    };

    const DATA = [
      {
        render: renderSlide1,
      },
      {
        render: renderSlide2,
      },
      {
        render: renderSlide3,
      },
    ];

    return (
      <GestureRecognizer style={flexStyle} onSwipeDown={onHide}>
        <Modal visible={isVisible} transparent={true} onRequestClose={this.onBackButtonPress}>
          <View style={container}>
            <TouchableWithoutFeedback style={flexStyle} onPress={onHide}>
              <View style={flexStyle} />
            </TouchableWithoutFeedback>
            <View style={[innerContainer, { height: isIOS ? '90%' : '95%' }]}>
              <View style={topWrapper}>
                <View style={header} />
                <TouchableOpacity onPress={onHide} style={closeBtn}>
                  <Image source={require('../img/close_black.png')} style={closeImg} />
                </TouchableOpacity>
                <View style={alignCenter}>
                  <Text style={topTitle}>{L('connect_premium')}</Text>
                  {/* <Text style={youHaveText}>
                                    {L('your_tariff') + ' ' + currentUserSubscription}
                                </Text> */}
                </View>
              </View>
              <View style={mediumWrapper}>
                <Carousel
                  ref={(c) => (this.carousel = c)}
                  data={DATA}
                  renderItem={this.renderItem}
                  sliderWidth={width}
                  itemWidth={ITEM_WIDTH}
                  inactiveSlideShift={0}
                  onSnapToItem={(activeIndex) => this.setState({ activeIndex })}
                  useScrollView={true}
                />
                <View style={dotsContainer}>
                  <View style={[dot, { backgroundColor: getBackgroundColor(0) }]} />
                  <View style={[dot, { marginHorizontal: 14, backgroundColor: getBackgroundColor(1) }]} />
                  <View style={[dot, { backgroundColor: getBackgroundColor(2) }]} />
                </View>
              </View>
              <View style={bottomWrapper}>
                <View style={footerTop}>
                  <View style={separator} />
                  <Text style={bottomTitle}>{L('subs_cancelable')}</Text>
                  {/* <Text style={underlinedText}>{L('vostanovit)}</Text> */}
                  {!isIOS && (
                    <Text onPress={() => Linking.openURL(cancelSubscriptionLink)} style={underlinedText}>
                      {L('cancel_subscription')}
                    </Text>
                  )}
                </View>
                <View>
                  <Text style={policyText}>{L('premium_info_3')}</Text>
                  <Text onPress={() => Linking.openURL(L('terms_of_use_url'))} style={[policyText, underlinedText]}>
                    {L('premium_info_terms')}
                  </Text>
                  <Text onPress={() => Linking.openURL(L('policy_url'))} style={[policyText, underlinedText]}>
                    {L('premium_info_and')}
                    {L('premium_info_policy')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <AvailableFeaturesModal isVisible={isFeaturesModalVisible} onHide={this.onShowHideFunctionsModal} />
          <CustomProgressBar visible={isProgress} title={progressTitle} />
          {alertObj.isVisible && <CustomAlert />}
        </Modal>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 39,
  },
  header: {
    width: 75,
    height: 6,
    backgroundColor: GREY_COLOR_3,
    borderRadius: 15,
  },
  topTitle: {
    fontSize: width / 14,
    fontWeight: '700',
    color: PINK_COLOR_1,
  },
  youHaveText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
    marginTop: 5,
  },
  topWrapper: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mediumWrapper: {
    flex: 4.5,
    height: '100%',
    width: '100%',
  },
  bottomWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: GREY_COLOR_3,
  },
  bottomTitle: {
    fontSize: width / 26,
    fontWeight: '500',
    color: BLACK_COLOR,
    marginTop: 22,
  },
  policyText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footerTop: {
    alignItems: 'center',
    width: '100%',
  },
  alignCenter: {
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 10,
  },
  flexStyle: {
    flex: 1,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 23,
  },
  closeImg: {
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
  },
  underlinedText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: ORANGE_COLOR_1,
    textDecorationLine: 'underline',
  },
});

const mapStateToProps = (state) => {
  const { controlReducer, popupReducer } = state;
  const { products, productsRussia, YooKassaSubscriptions, subscriptionInfoPacket } = controlReducer;
  const { alertObj } = popupReducer;

  return {
    products,
    productsRussia,
    YooKassaSubscriptions,
    subscriptionInfoPacket,
    alertObj,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PremiumModal);
