// @ts-nocheck
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

} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationService from '../navigation/NavigationService';
import { controlActionCreators } from '../reducers/controlRedux';
import * as IAP from '../purchases/Purchases';
import { L } from '../lang/Lang';
import Const from '../Const';
import { Icon } from 'react-native-elements';
import { CustomProgressBar } from '../Utils';
import * as Metrica from '../analytics/Analytics';
import UserPrefs from 'UserPrefs';

class TryPremiumPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null,
    };
  };

  state = {
    isProgress: false,
    progressTitle: null,
  };

  openProgressbar = (/** @type {any} */ title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  /**
   * @param {{ url: string; }} item
   */
  onItemPress(item) {
    Linking.openURL(item.url);
  }

  async UNSAFE_componentWillMount() {
    await IAP.reinit();
  };

  /**
   * @param {string} kind
   */
  async onBuyPremium(kind) {
    const { navigation, setPremiumThanksVisible } = this.props;

    this.openProgressbar(L('processing_purchase'));
    const result = await IAP.buyPremium(this, kind);
    //console.log(result);
    const { purchase, cancelled, error } = result;
    if (error || cancelled) {
      this.hideProgressbar();

      return;
    };

    this.setState({ purchasedPremium: purchase });
    const ok = IAP.verifyPurchase(purchase);
    this.hideProgressbar();

    if (ok) {
      setPremiumThanksVisible(true);
      if (kind === 'month_trial' && !__DEV__) {
        Metrica.logStartTrialSubscription();
      }
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
      NavigationService.back();
    }
  }

  async onBuyPremiumYearWithDemo() {
    return this.onBuyPremium('year_trial');
  }

  render() {
    const { yearlyWithDemoPrice } = this.props;

    return (
      <ImageBackground
        source={require('../img/ic_sirius_back.jpg')}
        style={{ width: '100%', height: '100%', flex: 1, alignItems: 'center' }}>
        <ScrollView containerStyle={styles.scroll} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.mainContainer}>
            <View style={styles.whiteBox}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  UserPrefs.setTryPremiumShown(true);
                  NavigationService.back();
                }}>
                <Icon iconColor="black" name="close" type="material" size={18} />
              </TouchableOpacity>
              <Image source={require('../img/ic_prem_family.png')} style={styles.image} />
              <Text style={styles.big_text}>{L('prem_unlock_full_access')}</Text>

              <View style={styles.features}>
                <Text style={styles.text}>{L('prem_short_feature_1')}</Text>
                <Text style={styles.text}>{L('prem_short_feature_2')}</Text>
                <Text style={styles.text}>{L('prem_short_feature_3')}</Text>
                <Text style={styles.text}>{L('prem_short_feature_4')}</Text>
              </View>

              <View style={styles.trial_info_pane}>
                <Text style={styles.trial_info_text}>{L('start_your_free_trial')}</Text>
                <Text style={styles.trial_price_text}>
                  {L('next_yearly_payment_after_trial', [yearlyWithDemoPrice ? yearlyWithDemoPrice : '...'])}
                </Text>
              </View>

              <TouchableOpacity style={styles.premiumButton1} onPress={this.onBuyPremiumYearWithDemo.bind(this)}>
                <Text style={styles.buttonBold}>{L('subscribe_now')}</Text>
              </TouchableOpacity>

              <View style={styles.payment_info}>
                <Text style={styles.info_text}>{L('try_premium_info_1', [yearlyWithDemoPrice])}</Text>
                <Text style={styles.info_text}>{L('try_premium_info_2')}</Text>
                <Text style={styles.info_text}>{L('premium_info_4')}</Text>
                <Text style={styles.info_text}>{L('premium_info_3')}</Text>
                <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(Const.TERMS_OF_USE)}>
                  {L('premium_info_terms')}
                </Text>
                <Text style={styles.info_text}>{L('premium_info_and')}</Text>
                <Text style={[styles.info_text, styles.link]} onPress={() => Linking.openURL(Const.POLICY)}>
                  {L('premium_info_policy')}
                </Text>
              </View>
            </View>
            <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (/** @type {{ controlReducer: { objects: any; monthlyPrice: any; yearlyPrice: any; halfYearlyPrice: any; trialPrice: any; yearlyWithDemoPrice: any; }; authReducer: { authorized: any; }; }} */ state) => {
  const { objects, monthlyPrice, yearlyPrice, halfYearlyPrice, trialPrice, yearlyWithDemoPrice } = state.controlReducer;
  const { authorized } = state.authReducer;

  return {
    objects,
    monthlyPrice,
    yearlyPrice,
    halfYearlyPrice,
    trialPrice,
    authorized,
    yearlyWithDemoPrice,
  };
};

const mapDispatchToProps = (/** @type {import("redux").Dispatch<import("redux").AnyAction>} */ dispatch) => {
  return {
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TryPremiumPage);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
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
  image: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
  },
  text: {
    fontSize: 13,
    color: '#504D4D',
    marginTop: 0,
    textAlign: 'left',
  },
  trial_price_text: {
    fontSize: 12,
    color: '#504D4D',
    marginTop: 0,
    textAlign: 'left',
  },
  gray_text: {
    fontSize: 13,
    color: '#000',
    opacity: 0.35,
    marginTop: 0,
    textAlign: 'left',
  },
  text_try_trial: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#504D4D',
    textAlign: 'center',
  },
  premiumButton1: {
    width: 270,
    height: 60,
    backgroundColor: '#C93CC9',
    borderRadius: 10,
    marginTop: 0,

    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'stretch',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  bigPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
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
  scroll: {},
  scrollContainer: {},
  payment_info: {
    marginTop: 20,
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
  big_text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 125,
    textAlign: 'center',
  },
  features: {
    flexDirection: 'column',
    alignContent: 'space-around',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  trial_info_pane: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  trial_info_text: {
    fontSize: 16,
  },
});
