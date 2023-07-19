import React, { Fragment } from 'react';
import {
  Text,
  Alert,
  Linking,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NavigationService from '../../../../navigation/NavigationService';
import { controlActionCreators } from '../../../../reducers/controlRedux';
import * as IAP from '../../../../purchases/Purchases';
import * as RNIap from 'react-native-iap';
import { L } from '../../../../lang/Lang';
import { Icon } from 'react-native-elements';
import Slide from "../Slide";
import ActionButton from "../ActionButton";
import textStyle from "../textStyles";
import { borders } from "../style";
import { slideTypes } from "../types";

class SkipPage extends React.Component {
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

  async componentDidMount() {
    await IAP.reinit();
  };

  componentWillUnmount() { }

  async onBuyPremium(kind) {
    const { navigation, setPremiumThanksVisible } = this.props;

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
      return true;
    } else {
      setTimeout(() => {
        Alert.alert(
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : '']),
          [{ text: 'OK' }],
          { cancelable: true }
        );
      }, 250);
      return undefined;
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

  // async onBuyPremiumMonthWithDemo() {
  //   return this.onBuyPremium('month_trial');
  // }

  // async onBuyPremiumSixMonths() {
  //   return this.onBuyPremium('halfyear');
  // }

  async onBuyPremiumYear() {
    return this.onBuyPremium('year');
  }

  async onBuyPremiumForeverDiscount() {
    return this.onBuyPremium('forever_discount');
  }

  render() {
    let SlideData = {
      id: 1,
      skip: undefined,
      backgroundColor: "#FFFFFF",
      header: {
        style: { borderWidth: borders, marginTop: 25 },
        component: <TouchableOpacity
          style={{ width: "100%", alignItems: "flex-start", marginTop: 0, paddingLeft: 10 }}
          onPress={() => {
            this.props.setContext(prev => ({ ...prev, type: slideTypes.DONE, discountIsShown: true }))
          }}
        >
          <Icon color={"red"} name="ios-close-circle-outline" type="ionicon" size={32} />
        </TouchableOpacity>
      },
      topWrapper: {
        style: { borderWidth: borders, flex: 1, marginTop: 0 },
        component: <View>
          <View style={{ width: "80%", height: "100%", borderWidth: borders, alignItems: "center" }}>
            <Image
              source={require("../../../../img/assets/intro/discount50.png")}
              resizeMode="contain"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}
            />
          </View>
        </View>
      },
      centerWrapper: {
        style: { flexDirection: "column", justifyContent: 'center', padding: 10, flex: 0, height: 200 },
        component: <Fragment>
          <Text style={textStyle.h1TextRed}>{L("minus50")}</Text>
          <Text style={{ ...textStyle.h4TextBlack, marginTop: 10 }}>{L("secret_intro")}</Text>
        </Fragment>
      },
      bottomWrapper: {
        style: { padding: 25, borderWidth: borders },
        component: <Fragment>
          <ActionButton
            label={L("active_on")}
            onPress={async () => {
              (await this.onBuyPremium('forever_discount')) !== undefined &&
                this.props.setContext(prev => ({ ...prev, type: slideTypes.DONE, purchase: "forever_discount" }));
            }}
          />
          <Text style={{ ...textStyle.h4TextBlack, marginTop: 10 }}>{L("for_new_users")}</Text>
        </Fragment>
      },
    }

    return <View style={{ width: this.props.context.width, height: this.props.context.height }}>
      <Slide
        node={{ item: SlideData }}
        width={this.props.context.width}
        height={this.props.context.height}
      />
    </View>
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(SkipPage);
