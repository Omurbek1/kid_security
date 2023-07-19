import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking, Dimensions, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { AnyAction, Dispatch, bindActionCreators } from 'redux';
import * as RNIap from 'react-native-iap';
import { controlActionCreators } from '../../../../reducers/controlRedux';
import { popupActionCreators } from '../../../../reducers/popupRedux';
import { GetProductInfo } from '../../../../purchases/PurchasesInterface';
import * as IAP from '../../../../purchases/Purchases';
import { L } from '@lang';
import { NewColorScheme } from '../../../../shared/colorScheme';
import { isCreditCardPaymentIsAllowed } from '../../../../vendor/oss/oss';
import { RejectFreeTrialModal, ActiveFreeTrialModal } from '../../../../components';
import { GradientButton } from '../../..';
import { CustomProgressBar } from '../../../../Utils';
import Slide from '../Slide';
import { slideTypes } from '../types';
import styles from './style';
import { firebaseAnalitycsForOpenModal, firebaseAnalyticsForBeginCheckout, firebaseAnalyticsForNavigation } from '../../../../analytics';
import { APP_VERSION } from '../../../../shared/constants';

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR, PINK_COLOR_1, GREY_COLOR_4, PINK_COLOR_2 } = NewColorScheme;
const checkmark = require('../../../../img/check_green.png');
const lockmark = require('../../../../img/lock.png');

interface PurchasePageProps {
  setActiveFreeTrialModalVisible: (isActiveFreeTrialModalVisible: boolean) => void;
  products: [];
  setContext: any;
  showAlert: (
    isVisible: boolean,
    title: string,
    subtitle: string,
    isSupportVisible?: boolean,
    supportText?: string,
    actionTitle?: string,
    actions?: []
  ) => void;
}

interface PurchasePageState {
  isRejectFreeTrialModalVisible: boolean;
  purchase: string;
  isProgressBarVisible: boolean;
  checkPurchaseOnReusme: boolean;
  purchasedPremium: {};
  isPromoSelected: boolean;
  isActiveFreeTrialModalVisible: boolean;
}

class PurchasePage extends React.Component<PurchasePageProps, PurchasePageState> {
  state = {
    isRejectFreeTrialModalVisible: false,
    purchase: 'year',
    isProgressBarVisible: false,
    checkPurchaseOnReusme: false,
    purchasedPremium: {},
    isPromoSelected: true,
    isActiveFreeTrialModalVisible: false,
  };

  async componentDidMount() {
    await IAP.reinit();
    firebaseAnalyticsForNavigation('PurchasePage');
    firebaseAnalitycsForOpenModal('paywallAfterOnboarding', true);
  }

  openProgressbar = () => {
    this.setState({ isProgressBarVisible: true });
  };

  hideProgressbar = () => {
    this.setState({ isProgressBarVisible: false });
  };

  async onBuyPremium(kind: string) {
    const { setActiveFreeTrialModalVisible, showAlert } = this.props;

    this.openProgressbar();
    this.setState({ checkPurchaseOnReusme: true });

    // Ilia Y.: yearly with demo purchase fix
    const realKind = 'year' === kind ? 'year_trial' : kind;
    const result = await IAP.buyPremium(this, realKind);
    const { purchase, cancelled, error } = result;

    //Error code means that this product already have been purchased before
    if (error === 'E_ALREADY_OWNED') {
      showAlert(true, L('premium_account'), L('premium_already_purchased'));
      this.hideProgressbar();
      return;
    }

    if (error || cancelled) {
      this.hideProgressbar();
      return;
    }

    this.setState({ purchasedPremium: purchase });
    const ok = await IAP.verifyPurchase(purchase);
    this.hideProgressbar();

    if (ok) {
      await IAP.tryConsumeProducts(async (purchase: RNIap.ProductPurchase) => {
        await RNIap.finishTransaction(purchase).then(() => {
          console.log('approved IAP Premium', purchase);
        });
      });

      if (kind === 'year') {
        setActiveFreeTrialModalVisible(true);
      }

      return true;
    } else {
      setTimeout(() => {
        showAlert(
          true,
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : ''])
        );
      }, 250);

      return undefined;
    }
  }

  render() {
    const { products, setContext } = this.props;
    const {
      isRejectFreeTrialModalVisible,
      isPromoSelected,
      purchase,
      isProgressBarVisible,
      isActiveFreeTrialModalVisible,
    } = this.state;
    const {
      title,
      bottomWrapper,
      functionWrapper,
      check,
      lock,
      selected,
      checkWhite,
      promoText,
      boldWhiteText,
      sevenDays,
      priceText,
      notSelected,
      bottomText1,
      bottomText2,
      policyText,
      sectionHeader,
      featureSeparator,
      feature,
      subscriptionType,
      topWrapper,
      premiumIcon,
      premiumWrapper,
      notPromoSelected,
      bottomTextWrapper,
      trialInfoText,
    } = styles;
    const foreverProduct = GetProductInfo('FOREVER_PREMIUM', products);
    const yearlyProductDemo = GetProductInfo('YEARLY_PREMIUM_WITH_DEMO', products);
    const yearlyProduct = GetProductInfo('YEARLY_PREMIUM', products);
    const threeMonthProduct = GetProductInfo('THREEMONTHLY_PREMIUM_WITH_DEMO', products);
    const monthProduct = GetProductInfo('MONTHLY_PREMIUM', products);
    const dummyProduct = yearlyProduct || foreverProduct || monthProduct;
    const priceSymbol = dummyProduct?.localizedPrice?.replace(/[^₸£€₴₱$¥₼₺₽a-zA-Z]+/g, '');
    const prices = {
      forever: {
        monthPrice: L('monthly_estimate', [`${Math.round(foreverProduct?.price / 24)} ${priceSymbol}`]),
        productId: foreverProduct?.productId,
        sub: foreverProduct?.subscriptionPeriodAndroid,
        localizedPrice: foreverProduct?.localizedPrice,
        price: foreverProduct?.price,
      },
      year: {
        monthPrice: L('monthly_estimate', [`${Math.round(yearlyProductDemo?.price / 12)} ${priceSymbol}`]),
        productId: yearlyProductDemo?.productId,
        sub: yearlyProductDemo?.subscriptionPeriodAndroid,
        localizedPrice: yearlyProductDemo?.localizedPrice,
        price: yearlyProductDemo?.price,
      },
      threeMonth: {
        monthPrice: L('tree_mo_pay', [`${threeMonthProduct?.price} ${priceSymbol}`]),
        productId: threeMonthProduct?.productId,
        sub: threeMonthProduct?.subscriptionPeriodAndroid,
        localizedPrice: threeMonthProduct?.localizedPrice,
        price: threeMonthProduct?.price,
      },
      month: {
        monthPrice: L('monthly_estimate', [`${monthProduct?.price} ${priceSymbol}`]),
        productId: monthProduct?.productId,
        sub: monthProduct?.subscriptionPeriodAndroid,
        localizedPrice: monthProduct?.localizedPrice,
        price: monthProduct?.price,
      },
      symbol: priceSymbol,
    };
    const platformName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';

    const functionsList = [
      {
        title: L('child_location'),
        isStandard: true,
      },
      {
        title: L('kid_achievements'),
        isStandard: true,
      },
      {
        title: L('chats_control'),
        isStandard: false,
      },
      {
        title: L('zapic_zvuka'),
        isStandard: false,
      },
      {
        title: L('app_statistics'),
        isStandard: false,
      },
      {
        title: L('child_movement'),
        isStandard: false,
      },
      {
        title: L('podacha'),
        isStandard: false,
      },
    ];

    const renderFunction = (item: {}) => {
      const {
        index,
        item: { title, isStandard },
      } = item;
      const standard = isStandard ? checkmark : lockmark;
      const standardStyle = isStandard ? check : lock;

      return (
        <View>
          <View style={[functionWrapper, index === functionsList.length - 1 && { paddingBottom: 40 }]}>
            <View style={{ flex: 3 }}>
              <Text style={feature}>{title}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {index === 0 && <Image source={require('../../../../img/premium_wrapper.png')} style={premiumWrapper} />}
              <Image source={checkmark} style={check} />
            </View>
            <View style={{ flex: 1 }}>
              <Image source={standard} style={standardStyle} />
            </View>
          </View>
          {index !== functionsList.length - 1 && <View style={featureSeparator} />}
        </View>
      );
    };

    const keyExtractor = (_, index: number): string => `${index}`;

    const onDoneSliding = () => setContext((prev: any) => ({ ...prev, type: slideTypes.DONE }));

    const onShowHideRejectFreeTrialModal = () => {
      const { isRejectFreeTrialModalVisible } = this.state;

      this.setState({ isRejectFreeTrialModalVisible: !isRejectFreeTrialModalVisible });
    };

    const onShowHideActiveFreeTrialModal = () => {
      const { isActiveFreeTrialModalVisible } = this.state;

      this.setState({ isActiveFreeTrialModalVisible: !isActiveFreeTrialModalVisible });
    };

    const onSkip = () => {
      const { purchase } = this.state;

      if (purchase === 'year' && isCreditCardPaymentIsAllowed()) {
        onShowHideRejectFreeTrialModal();
      } else {
        onDoneSliding();
      }
    };

    const blackText = !isPromoSelected && { color: BLACK_COLOR };
    const whiteText = { color: isPromoSelected ? BLACK_COLOR : '#FFFFFF' };

    const SlideData = {
      id: 1,
      skip: onSkip,
      centerView: (
        <ScrollView
          style={{ backgroundColor: '#FFFFFF' }}
          contentContainerStyle={styles.scrollViewContentContainer}
          showsVerticalScrollIndicator={false}>
          <Text style={title}>{L('try_premium_premium_acc')}</Text>
          <View style={topWrapper}>
            <View style={{ width: '100%' }}>
              <FlatList
                data={functionsList}
                renderItem={renderFunction}
                keyExtractor={keyExtractor}
                ListHeaderComponent={
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 3 }} />
                      <View style={{ flex: 1 }}>
                        <Image source={require('../../../../img/premium_pink_small.png')} style={premiumIcon} />
                      </View>
                      <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 3 }}>
                        <Text style={[sectionHeader, { alignSelf: 'flex-start' }]}>{L('funckcii')}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[sectionHeader, { color: PINK_COLOR_1 }]}>{L('premium')}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={sectionHeader}>{L('standart')}</Text>
                      </View>
                    </View>
                  </View>
                }
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          <View style={bottomWrapper}>
            <TouchableOpacity onPress={() => this.setState({ isPromoSelected: true, purchase: 'year' })}>
              <View style={styles.promoView}>
                <Text style={promoText}>{L('akciya_pri')}</Text>
                <View style={[selected, !isPromoSelected && notPromoSelected]}>
                  {isPromoSelected && <Image source={require('../../../../img/check_white.png')} style={checkWhite} />}
                </View>
              </View>
              <View style={[styles.promoWrapper, !isPromoSelected && { backgroundColor: GREY_COLOR_4 }]}>
                <View>
                  <Text style={[sevenDays, blackText]}>{L('cem_dnei')}</Text>
                  <Text style={[boldWhiteText, blackText, { textAlign: 'left' }]}>{L('besplatno')}</Text>
                </View>
                <View>
                  <Text style={[boldWhiteText, blackText]}>{L('yearly')}</Text>
                  <Text style={[priceText, blackText]}>{prices?.year?.monthPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.monthlyView, !isPromoSelected && { backgroundColor: PINK_COLOR_1 }]}
              onPress={() => this.setState({ isPromoSelected: false, purchase: 'month' })}>
              <View style={[notSelected, !isPromoSelected && { borderColor: '#FFFFFF' }]}>
                {!isPromoSelected && <Image source={require('../../../../img/check_white.png')} style={checkWhite} />}
              </View>
              <View style={styles.monthlyWrapper}>
                <Text style={[priceText, whiteText]}>{L('monthly')}</Text>
                <Text style={[priceText, whiteText]}>{prices?.month?.monthPrice}</Text>
              </View>
            </TouchableOpacity>
            <GradientButton
              title={isPromoSelected ? L('poprobovat_besplatno') : L('dialog_subscribe')}
              onPress={async () => {
                firebaseAnalyticsForBeginCheckout(purchase);
                (await this.onBuyPremium(purchase)) !== undefined &&
                  setContext((prev: any) => ({ ...prev, type: slideTypes.DONE, purchase }));
              }}
              gradientStyle={{ marginTop: width / 19 }}
              titleStyle={{ fontFamily: 'Roboto-Bold' }}
            />
            <View style={bottomTextWrapper}>
              <View>
                <Text style={bottomText1}>{isPromoSelected ? L('platit_ne_nado') : ''}</Text>
                <Text style={bottomText2}>
                  {isPromoSelected ? L('bespl_potom_god', [prices?.year?.localizedPrice]) : ''}
                </Text>
                {isPromoSelected && (
                  <Text style={trialInfoText}>
                    {L('information_trial', [prices?.year?.localizedPrice, platformName, platformName])}
                  </Text>
                )}
                <View style={[styles.separator, !isPromoSelected && { backgroundColor: PINK_COLOR_2 }]} />
              </View>
              <Text style={policyText}>
                {L('policy_i_accept')}
                <Text onPress={() => Linking.openURL(L('terms_of_use_url'))}>{L('policy_terms_of_use')}</Text>{' '}
                {L('policy_and')}
                <Text onPress={() => Linking.openURL(L('policy_url'))}>{L('policy_privacy')}</Text>
              </Text>
              <Text style={styles.versionApp}>
                {L('app_version')}: {APP_VERSION}
              </Text>
            </View>
          </View>
          <RejectFreeTrialModal
            isVisible={isRejectFreeTrialModalVisible}
            onDone={onDoneSliding}
            onActivateFreeTrial={async () => {
              onShowHideRejectFreeTrialModal();
              firebaseAnalyticsForBeginCheckout(purchase);
              (await this.onBuyPremium(purchase)) !== undefined &&
                setContext((prev: any) => ({ ...prev, type: slideTypes.DONE, purchase }));
            }}
          />
          <ActiveFreeTrialModal isVisible={isActiveFreeTrialModalVisible} onClose={onShowHideActiveFreeTrialModal} />
          <CustomProgressBar visible={isProgressBarVisible} />
        </ScrollView>
      ),
    };

    return <Slide node={{ item: SlideData }} width={width} height={height} page="purchase" />;
  }
}

const mapStateToProps = (state: { controlReducer: { products: any; }; }) => {
  const { products } = state.controlReducer;

  return { products };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    setActiveFreeTrialModalVisible: bindActionCreators(controlActionCreators.setActiveFreeTrialModalVisible, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchasePage);
