import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

import { StyleSheet } from 'react-native';
import Const from '../Const';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import WebView from 'react-native-webview';
import { L } from '../lang/Lang';
import * as IAP from '../purchases/Purchases';
import * as RNIap from 'react-native-iap';
import { CustomProgressBar } from '../Utils';
import UserPrefs from '../UserPrefs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentProblemModal } from '../components';

const { width, height } = Dimensions.get('window');

const defaultProps = {
  title: 'Title',
  image: require('../img/ic_wiretap.png'),
  onAccept: null,
  disabled: false,
  visible: true,
};

class SalePane extends Component {
  state = { isProgress: false, progressTitle: null, isPaymentProblemModalVisible: false };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  async onBuyPremium(kind) {
    const {
      setPremiumThanksVisible,
      promoData,
      setPromoData,
      showAlert,
    } = this.props;

    this.openProgressbar(L('processing_purchase'));
    this.setState({ checkPurchaseOnReusme: true });

    const result = await IAP.buyPremium(this, kind);
    const { purchase, cancelled, error } = result;
    //Error code means that this product alreave have been purchased before
    if (error === 'E_ALREADY_OWNED') {
      showAlert(true, L('premium_account'), L('premium_already_purchased'));
      this.hideProgressbar();
      this.props.onHide();
      return;
    }

    if (error || cancelled) {
      this.onShowHidePaymentProblemModal();
      this.hideProgressbar();

      return;
    };

    this.setState({ purchasedPremium: purchase });
    const ok = await IAP.verifyPurchase(purchase);
    console.log(ok);
    this.hideProgressbar();
    this.props.onHide();
    if (ok) {
      await IAP.tryConsumeProducts(async (purchase) => {
        await RNIap.finishTransaction(purchase).then(() => {
          console.log('approved IAP Premium', purchase);
        });
      });
      setPremiumThanksVisible(true);
      setPromoData(null);
      await UserPrefs.setPromoCache(promoData.id);
    } else {
      setTimeout(() => {
        showAlert(
          true,
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : '']));
      }, 250);
      return;
    }

    // const backTo = navigation.getParam('backTo');
    // if (backTo) {
    //   NavigationService.navigate(backTo);
    // } else {
    //   NavigationService.navigate('Map');
    // }
  }

  onMessage(e) {
    const props = { ...defaultProps, ...this.props };
    // alert(e.nativeEvent.data);
    this.onBuyPremium(props.promoData.sku);
  }

  onShowHidePaymentProblemModal = () => {
    const { isPaymentProblemModalVisible } = this.state;
    const { onHide } = this.props;

    this.setState({ isPaymentProblemModalVisible: !isPaymentProblemModalVisible });
  };

  render() {
    const props = { ...defaultProps, ...this.props };
    const runFirst = `
      var inputs = document.querySelectorAll("a[href='https://pay.kidsecurity.net']")
      for (i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('click', function() {
          window.ReactNativeWebView.postMessage('pressed');
        });
      }
      true; // note: this is required, or you'll sometimes get silent failures
    `;
    const { supported } = props.promoData;
    const lang = UserPrefs.all.language;
    const langWebPageExist = supported.includes(lang);
    const url = `${props.promoData.url}`.replace('{lang}', `${langWebPageExist ? lang : 'en'}`);

    return props.visible ? (
      <View pointerEvents="auto" style={styles.container}>
        <View style={styles.modal}>
          <WebView
            javaScriptEnabled
            javaScriptEnabledAndroid
            originWhitelist={['*']}
            onMessage={(e) => this.onMessage(e)}
            startInLoadingState={true}
            style={{ flex: 1, borderRadius: 20 }}
            injectedJavaScript={runFirst}
            source={{ uri: url }}
          />
          <TouchableOpacity style={styles.closeButton} onPress={props.onHide}>
            <Icon iconColor="black" name="close" type="material" />
          </TouchableOpacity>
          <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        </View>
        <PaymentProblemModal
          isVisible={this.state.isPaymentProblemModalVisible}
          onCloseModal={this.onShowHidePaymentProblemModal}
          onHide={this.props.onHide} />
      </View>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { ossToken, promoData } = state.controlReducer;
  return {
    ossToken,
    promoData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redeemOssToken: bindActionCreators(controlActionCreators.redeemOssToken, dispatch),
    setPromoData: bindActionCreators(controlActionCreators.setPromoData, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalePane);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 45 + Const.HEADER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 5,
  },
  modal: {
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    width: width * 0.9,
    height: height * 0.7,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    height: 30,
    width: 30,
    elevation: 15,
  },
});
