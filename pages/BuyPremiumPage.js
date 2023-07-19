import React from 'react';
import {
  ScrollView,
  Text,
  Alert,
  Linking,
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Badge,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationService from '../navigation/NavigationService';
import { controlActionCreators } from '../reducers/controlRedux';
import * as IAP from '../purchases/Purchases';
import * as RNIap from 'react-native-iap';

import { L } from '../lang/Lang';
import { Icon } from 'react-native-elements';
import { CustomProgressBar } from '../Utils';
import PremiumButton from '../components/atom/PremiumButton';
import KsText from '../components/atom/KsText';
import { GetProductInfo } from '../purchases/PurchasesInterface';
import { AppColorScheme } from '../shared/colorScheme';

class BuyPremiumPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onItemPress(item) {
    Linking.openURL(item.url);
  }

  async UNSAFE_componentWillMount() { }

  async componentDidMount() {
    await IAP.reinit();
  };

  componentWillUnmount() { }

  async onBuyPremium(kind) {
    const { navigation, setPremiumThanksVisible } = this.props;
    console.log('this is AN IAP =!!!!!', IAP);
    this.openProgressbar(L('processing_purchase'));
    this.setState({ checkPurchaseOnReusme: true });

    const result = await IAP.buyPremium(this, kind);
    const { purchase, cancelled, error } = result;
    //Error code means that this product alreave have been purchased before
    if (error === 'E_ALREADY_OWNED') {
      Alert.alert(L('premium_account'), L('premium_already_purchased'));
      this.hideProgressbar();
      return;
    }

    if (error || cancelled) {
      this.hideProgressbar();

      return;
    };

    this.setState({ purchasedPremium: purchase });
    const ok = await IAP.verifyPurchase(purchase);
    console.log(ok);
    this.hideProgressbar();
    if (ok) {
      await IAP.tryConsumeProducts(async (purchase) => {
        await RNIap.finishTransaction(purchase).then(() => {
          console.log('approved IAP Premium', purchase);
        });
      });
      setPremiumThanksVisible(true);
    } else {
      setTimeout(() => {
        Alert.alert(
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : '']),
          [{ text: 'OK' }],
          { cancelable: true }
        );
      }, 250);
      return;
    }

    const backTo = navigation.getParam('backTo');
    if (backTo) {
      NavigationService.navigate(backTo);
    } else {
      NavigationService.navigate('Map');
    }
  }

  async onBuyPremiumMonth() {
    return this.onBuyPremium('month');
  }
  async onBuyWireMonth() {
    return this.onBuyPremium('monthly_wire');
  }
  async onBuyPremiumMonthAndVoice() {
    return this.onBuyPremium('month_and_voice');
  }

  // async onBuyPremiumMonthWithDemo() {
  //   return this.onBuyPremium('month_trial');
  // }

  // async onBuyPremiumSixMonths() {
  //   return this.onBuyPremium('halfyear');
  // }

  async onBuyPremiumYear() {
    return this.onBuyPremium('year');
  }

  async onBuyPremiumForever() {
    return this.onBuyPremium('forever');
  }

  render() {
    // const foreverProduct = GetProductInfo('FOREVER_PREMIUM', this.props.products);
    // const yearlyProduct = GetProductInfo('YEARLY_PREMIUM', this.props.products);
    const monthProduct = GetProductInfo('MONTHLY_PREMIUM', this.props.products);
    const monthly_voice = GetProductInfo('MONTHLY_AND_VOICE', this.props.products);
    const monthWire = GetProductInfo('MONTHLY_LIVE_WIRE', this.props.products);
    console.log('MONTHLY AND VOICE !!!!====', monthWire);
    //console.log('products:', foreverProduct, yearlyProduct, monthProduct);
    const dummyProduct = monthProduct || monthly_voice;
    let priceSymbol = dummyProduct?.localizedPrice?.replace(/[^₸£€₴₱$¥₼₺₽a-zA-Z]+/g, '');
    if (!priceSymbol) {
      priceSymbol = '';
    }
    // const yearlyMonthlyPrice = yearlyProduct
    //   ? Math.floor(parseFloat(yearlyProduct.price.replace(',', '.')) / 12) + ' ' + priceSymbol
    //   : '...';
    // const foreverMonthlyPrice = foreverProduct
    //   ? Math.floor(parseFloat(foreverProduct.price.replace(',', '.')) / 24) + ' ' + priceSymbol
    //   : '...';
    // const foreverMonthlyEstimate = Platform.select({
    //   ios: [null],
    //   android: [foreverProduct ? L('monthly_estimate', [foreverMonthlyPrice]) : '...']
    // })[0];

    const { monthlyPrice, yearlyPrice, halfYearlyPrice, foreverPrice, navigation } = this.props;

    return (
      <ImageBackground source={require('../img/ic_sirius_back.jpg')} resizeMode="cover" style={{ flex: 1 }}>
        <ScrollView containerStyle={styles.scroll} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.whiteBox}>
              <Text style={styles.title}>{L('go_to_premium')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  const backTo = navigation.getParam('backTo');
                  if (backTo) {
                    NavigationService.navigate(backTo);
                  } else {
                    NavigationService.navigate('Map');
                  }
                }}>
                <Icon iconColor="black" name="close" type="material" size={18} />
              </TouchableOpacity>
              <Image source={require('../img/crown.png')} style={styles.image} />
              <Text style={styles.text}>{L('unlock_features_and_keep_calm')}</Text>
              {/* <View style={{ marginVertical: 10, width: '100%', alignItems: 'stretch' }}>
                <PremiumButton
                  style={{ backgroundColor: '#ef4c77', minHeight: 70 }}
                  textBaseStyle={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}
                  leftTop={L('forever_premium')}
                  leftBot={L('profit', ['80%'])}
                  onPress={this.onBuyPremiumForever.bind(this)}
                  rightTopStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  rightTop={foreverProduct ? foreverProduct.localizedPrice : '...'}
                  rightBot={foreverMonthlyEstimate}></PremiumButton>
              </View> */}
              {/* <View style={{ marginBottom: 15, width: '100%', alignItems: 'stretch' }}>
                <PremiumButton
                  style={{ backgroundColor: '#ef4c77', minHeight: 70 }}
                  textBaseStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
                  leftTop={L('yearly_premium')}
                  leftBot={L('profit', ['45%'])}
                  onPress={this.onBuyPremiumYear.bind(this)}
                  rightTopStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  rightTop={yearlyProduct ? yearlyProduct.localizedPrice : '...'}
                  rightBot={yearlyProduct ? L('monthly_estimate', [yearlyMonthlyPrice]) : '...'}></PremiumButton>
              </View> */}
              <View style={{ marginVertical: 10, width: '100%', alignItems: 'stretch' }}>
                <PremiumButton
                  style={{ backgroundColor: '#ef4c77', minHeight: 70, display: 'flex', justifyContent: 'center' }}
                  textBaseStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
                  leftTop={L('monthly_premium')}
                  onPress={this.onBuyPremiumMonth.bind(this)}
                  rightTopStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  rightTop={monthProduct ? monthProduct.localizedPrice : '...'}></PremiumButton>
              </View>
              <View style={{ marginBottom: 10, marginTop: 3, width: '100%', alignItems: 'stretch' }}>
                <PremiumButton
                  bestOffer={true}
                  style={{ backgroundColor: '#ef4c77', minHeight: 70, display: 'flex', justifyContent: 'center' }}
                  textBaseStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
                  leftTop={L('unlimite_month')}
                  leftTopStyle={{ fontSize: 14, fontWeight: 'bold', width: '50%' }}
                  onPress={this.onBuyPremiumMonthAndVoice.bind(this)}
                  rightTopStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  rightTop={monthly_voice ? monthly_voice?.localizedPrice : '...'}></PremiumButton>
              </View>
              <View style={{ marginBottom: 10, width: '100%', alignItems: 'stretch' }}>
                <PremiumButton
                  style={{ backgroundColor: '#ef4c77', minHeight: 70, display: 'flex', justifyContent: 'center' }}
                  textBaseStyle={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}
                  leftTop={L('unlim_live')}
                  leftTopStyle={{ width: '60%' }}
                  onPress={this.onBuyWireMonth.bind(this)}
                  rightTopStyle={{ fontSize: 14, fontWeight: 'bold' }}
                  rightTop={monthWire ? monthWire?.localizedPrice : '...'}></PremiumButton>
              </View>
              <View
                style={{
                  marginVertical: 10,
                  width: '100%',
                  alignItems: 'stretch',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  padding: 5,
                  marginHorizontal: 10,
                }}>
                <Text style={{ color: 'black', textAlign: 'center' }}>{L('subs_cancelable')}</Text>
              </View>

              <View style={styles.payment_info}>
                {/* <Text style={styles.info_text}>
                  {L('premium_info_1', [monthlyPrice, yearlyPrice, halfYearlyPrice, monthlyPrice])}
                </Text>
                <Text style={styles.info_text}>
                  {L('premium_info_2', [Platform.OS === 'ios' ? 'App Store' : 'Google Play'])}
                </Text>
                <Text style={styles.info_text}>{L('premium_info_4')}</Text>
                <Text style={styles.info_text}>{L('premium_info_3')}</Text>
                <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(Const.TERMS_OF_USE)}>
                  {L('premium_info_terms')}
                </Text>
                <Text style={styles.info_text}>{L('premium_info_and')}</Text>
                <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(Const.POLICY)}>
                  {L('premium_info_policy')}
                </Text> */}
              </View>
            </View>
            <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

// <TouchableOpacity style={styles.premiumButton1} onPress={this.onBuyPremiumForever.bind(this)}>
// <Text style={styles.buttonBold}>{L('forever_premium')}</Text>
// <Text style={styles.buttonLight}>{foreverPrice ? foreverPrice : '...'}</Text>
// <Text style={styles.profit_pane}>{L('profit', ['70%'])}</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.premiumButton2} onPress={this.onBuyPremiumYear.bind(this)}>
// <Text style={styles.buttonBold}>{L('yearly_premium')}</Text>
// <Text style={styles.buttonLight}>{(yearlyPrice ? yearlyPrice : '...') + ' ' + L('yearly')}</Text>
// <Text style={styles.profit_pane}>{L('profit', ['15%'])}</Text>
// </TouchableOpacity>
// <TouchableOpacity style={styles.premiumButton3} onPress={this.onBuyPremiumMonth.bind(this)}>
// <Text style={styles.buttonBold}>{L('monthly_premium')}</Text>
// <Text style={styles.buttonLight}>{(monthlyPrice ? monthlyPrice : '...') + ' ' + L('monthly')}</Text>
// </TouchableOpacity>

const mapStateToProps = (state) => {
  const { objects, monthlyPrice, yearlyPrice, halfYearlyPrice, foreverPrice, products } = state.controlReducer;
  const { authorized } = state.authReducer;

  return {
    products,
    objects,
    monthlyPrice,
    yearlyPrice,
    halfYearlyPrice,
    foreverPrice,
    authorized,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuyPremiumPage);

const styles = StyleSheet.create({
  mainContainer: {},
  logo: {
    marginTop: 25,
    marginBottom: 10,
    width: 120,
    height: 120,
  },
  listContainer: {},
  itemContainer: {},
  iconStyle: {
    color: '#FF666F',
    marginTop: 50,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  price: {
    fontSize: 48,
  },
  priceCurrency: {
    marginBottom: 10,
  },
  pricePane: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'column',
  },
  whiteBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    color: '#4B4B4B',
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: '#504D4D',
    marginTop: 10,
    textAlign: 'center',
  },
  premiumButton1: {
    width: 270,
    height: 60,
    backgroundColor: '#C93CC9',
    borderRadius: 10,
    marginTop: 20,
  },
  premiumButton2: {
    width: 270,
    height: 60,
    backgroundColor: '#51A83C',
    borderColor: '#51A83C',
    borderRadius: 10,
    marginTop: 20,
  },
  premiumButton3: {
    width: 270,
    height: 60,
    backgroundColor: '#FF7759',
    borderRadius: 10,
    marginTop: 20,
  },
  backToMenu: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  buttonBold: {
    fontSize: 17,
    marginTop: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonLight: {
    fontSize: 15,
    marginTop: 5,
    color: 'white',
    textAlign: 'center',
  },
  buttonFree: {
    fontSize: 15,
    color: '#51A83C',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    marginTop: 10,
    marginRight: 0,
    opacity: 50,
    width: 30,
    height: 30,
  },
  scroll: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 30 },
  payment_info: {
    marginTop: 50,
  },
  info_text: {
    textAlign: 'justify',
    marginBottom: 10,
    fontSize: 10,
    opacity: 0.75,
  },
  info_text2: {
    fontSize: 10,
    opacity: 0.75,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#FF7759',
    fontWeight: 'bold',
  },
  bottom_payment_info: {
    flex: 0,
    flexDirection: 'row',
    maxWidth: '100%',
  },
  profit_pane: {
    position: 'absolute',
    right: -10,
    top: -11,
    padding: 0,
    width: 122,
    backgroundColor: '#2579bf',
    borderWidth: 1,
    borderColor: '#4a90ca',
    borderRadius: 6,
    overflow: 'hidden',
    color: 'white',
    textAlign: 'center',
  },
});
