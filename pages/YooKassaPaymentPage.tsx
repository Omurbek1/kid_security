import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';
import { controlActionCreators } from '../reducers/controlRedux';
import { popupActionCreators } from '../reducers/popupRedux';
import { APIService } from '../Api';
import NavigationService from '../navigation/NavigationService';
import { getHeader } from '../shared/getHeader';
import * as IAP from '../purchases/Purchases';
import { L } from '@lang';

const { MIN_30_LIVE_WIRE, MIN_180_LIVE_WIRE } = IAP;

interface YooKassaPaymentPageProps {
  navigation: {};
  setYooKassaSubscriptions: (subscriptions: []) => void;
  showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
  showThanksForMinutesPurchaseModal: (isThanksForMinutesPurchaseModalVisible: boolean) => void;
}

class YooKassaPaymentPage extends React.Component<YooKassaPaymentPageProps> {
  static navigationOptions = () => {
    return {
      ...getHeader({ title: L('oplata_with_card'), isOldHeader: false }),
      headerRight: null,
    };
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

  getYooKassaPaymentStatus = (orderId: string) => {
    const {
      showSuccessfulSubscriptionModal,
      navigation: { getParam },
      showThanksForMinutesPurchaseModal,
    } = this.props;
    const backTo = getParam('backTo');
    const productId = getParam('productId');

    APIService.getYooKassaPaymentStatus(orderId)
      .then(async (res) => {
        const { success, status } = res;

        if (success && status === 'succeeded') {
          this.getYooKassaSubscriptions();
          if (backTo) {
            NavigationService.navigate(backTo);
          }

          if (productId === MIN_180_LIVE_WIRE || productId === MIN_30_LIVE_WIRE) {
            showThanksForMinutesPurchaseModal(true);
          }

          showSuccessfulSubscriptionModal(true);

          await IAP.checkPremiumPurchased(this);
        }
      })
      .catch((err) => console.log('Error getting YooKassa payment status', err));
  };

  render() {
    const {
      navigation: { getParam },
    } = this.props;
    const orderId = getParam('orderId');
    const { container, loadingView } = styles;
    const paddingTop = 56 + Constants.statusBarHeight;

    const renderLoader = () => {
      return (
        <View style={loadingView}>
          <ActivityIndicator size="large" />
        </View>
      );
    };

    return (
      <View style={[container, { paddingTop }]}>
        <WebView
          source={{ uri: `https://yoomoney.ru/checkout/payments/v2/contract/bankcard?orderId=${orderId}` }}
          onNavigationStateChange={(state) => this.getYooKassaPaymentStatus(orderId)}
          startInLoadingState
          renderLoading={renderLoader}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    setYooKassaSubscriptions: bindActionCreators(controlActionCreators.setYooKassaSubscriptions, dispatch),
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showThanksForMinutesPurchaseModal: bindActionCreators(
      popupActionCreators.showThanksForMinutesPurchaseModal,
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(YooKassaPaymentPage);
