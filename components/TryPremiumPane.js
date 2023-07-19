import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Image } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '../lang/Lang';
import { Icon } from 'react-native-elements';
import Const from '../Const';
import { CustomProgressBar } from '../Utils';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import * as IAP from '../purchases/Purchases';
import { PaymentProblemModal } from '../components';

const defaultProps = {
  visible: false,
  onHide: null,
};

class _TryPremiumPane extends Component {
  state = {
    isProgress: false,
    isPaymentProblemModalVisible: false,
  };

  openProgressbar = (title) => {
    this.setState({ isProgress: true, progressTitle: title });
  };

  hideProgressbar = () => {
    this.setState({ isProgress: false });
  };

  onBuy() {
    this.onBuyPremium('year');
  }

  async onBuyPremium(kind) {
    const { setPremiumThanksVisible, showAlert } = this.props;

    this.openProgressbar(L('processing_purchase'));
    const result = await IAP.buyPremium(this, kind);
    //console.log(result);
    const { purchase, cancelled, error } = result;
    if (error || cancelled) {
      this.onShowHidePaymentProblemModal();
      this.hideProgressbar();

      return;
    };

    this.setState({ purchasedPremium: purchase });
    const ok = IAP.verifyPurchase(purchase);
    this.hideProgressbar();

    if (ok) {
      setPremiumThanksVisible(true);
    } else {
      setTimeout(() => {
        showAlert(
          true,
          L('menu_premium'),
          L('failed_to_proceed_purchase', [error ? ', ' + L('error') + ': ' + error : '']),
        );
      }, 250);
      return;
    }

    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  onShowHidePaymentProblemModal = () => {
    const { isPaymentProblemModalVisible } = this.state;

    this.setState({ isPaymentProblemModalVisible: !isPaymentProblemModalVisible });
  };

  render() {
    const { iapReady, yearlyPrice } = this.props;

    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={styles.addPhonePaneContent}>
          <TouchableOpacity style={styles.closeButton} onPress={props.onHide}>
            <Icon iconColor="black" name="close" type="material" size={18} />
          </TouchableOpacity>

          <Image source={require('../img/ic_present.png')} style={styles.image} />
          <Text style={styles.text_big}>{L('today_your_last_chance_for_premium')}</Text>
          <View style={styles.sale_block}>
            <View style={styles.redsubline}>
              <Text style={styles.text_sale}>{L('save_up_to')}</Text>
              <Text style={[styles.text_sale, { fontWeight: 'bold' }]}>55%</Text>
            </View>
            <Text style={styles.text_sale}>{L('save_in_compare_width')}</Text>
          </View>
          <Text style={styles.text_sale}>{L('save_month_fee')}</Text>

          <View style={styles.button_wrapper}>
            <TouchableOpacity style={styles.premiumButton1} onPress={this.onBuy.bind(this)}>
              <Text style={styles.buttonBold}>{L('subscribe_for_year_now', [yearlyPrice ? yearlyPrice : '...'])}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>{L('try_premium_agreement_1')}</Text>
        </View>
        <CustomProgressBar visible={this.state.isProgress} title={this.state.progressTitle} />
        <PaymentProblemModal
          isVisible={this.state.isPaymentProblemModalVisible}
          onCloseModal={this.onShowHidePaymentProblemModal} />
      </View>
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { iapReady, yearlyPrice } = state.controlReducer;

  return {
    iapReady,
    yearlyPrice,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPrices: bindActionCreators(controlActionCreators.setPrices, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

const TryPremiumPane = connect(mapStateToProps, mapDispatchToProps)(_TryPremiumPane);
export default TryPremiumPane;

const styles = StyleSheet.create({
  addPhonePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '5%',
    paddingTop: 20 + Const.HEADER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 120,
  },

  button: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 45,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  button_text: {
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  text_big: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingTop: 20,
    color: '#000',
    paddingBottom: 10,
  },
  sale_block: {
    flexDirection: 'row',
  },
  text_sale: {
    fontSize: 14,
    color: '#000',
  },
  premiumButton1: {
    width: 270,
    height: 60,
    backgroundColor: '#ef4c77',
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,

    flexDirection: 'row',
    /*flex: 1,*/
    justifyContent: 'space-around',
    alignItems: 'center',
    alignContent: 'stretch',
  },
  buttonBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  terms: {
    fontSize: 10,
    textAlign: 'justify',
    color: '#000',
  },
  redsubline: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ff0202',
  },
  button_wrapper: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
