import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { popupActionCreators } from '../reducers/popupRedux';
import { L } from '@lang';

import { SuccessfulSubscriptionModal, NotEnoughBalanceModal } from './';

interface PurchaseStateModalsProps {
  isSuccessfulSubscriptionModalVisible: boolean;
  isThanksForMinutesPurchaseModalVisible: boolean;
  isNotEnoughBalanceModalVisible: boolean;
  showSuccessfulSubscriptionModal: (isSuccessfulSubscriptionModalVisible: boolean) => void;
  showThanksForMinutesPurchaseModal: (isThanksForMinutesPurchaseModalVisible: boolean) => void;
  showNotEnoughBalanceModal: (isNotEnoughBalanceModalVisible: boolean) => void;
}

class PurchaseStateModals extends Component<PurchaseStateModalsProps> {
  onShowHideSuccessfulSubscriptionModal = () => {
    const { showSuccessfulSubscriptionModal, showThanksForMinutesPurchaseModal } = this.props;

    showSuccessfulSubscriptionModal(false);
    showThanksForMinutesPurchaseModal(false);
  };

  onShowHideNotEnoughBalanceModal = () => {
    const { showNotEnoughBalanceModal } = this.props;

    showNotEnoughBalanceModal(false);
  };

  render() {
    const {
      isSuccessfulSubscriptionModalVisible,
      isNotEnoughBalanceModalVisible,
      isThanksForMinutesPurchaseModalVisible,
    } = this.props;

    return (
      <>
        <SuccessfulSubscriptionModal
          isVisible={isSuccessfulSubscriptionModalVisible}
          onCloseModal={this.onShowHideSuccessfulSubscriptionModal}
          thanksText={isThanksForMinutesPurchaseModalVisible ? L('thanks_for_purchase') : L('premium_was_activated')}
        />
        <NotEnoughBalanceModal
          isVisible={isNotEnoughBalanceModalVisible}
          onCloseModal={this.onShowHideNotEnoughBalanceModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    isSuccessfulSubscriptionModalVisible,
    isNotEnoughBalanceModalVisible,
    isThanksForMinutesPurchaseModalVisible,
  } = state.popupReducer;

  return {
    isSuccessfulSubscriptionModalVisible,
    isNotEnoughBalanceModalVisible,
    isThanksForMinutesPurchaseModalVisible,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showSuccessfulSubscriptionModal: bindActionCreators(popupActionCreators.showSuccessfulSubscriptionModal, dispatch),
    showNotEnoughBalanceModal: bindActionCreators(popupActionCreators.showNotEnoughBalanceModal, dispatch),
    showThanksForMinutesPurchaseModal: bindActionCreators(
      popupActionCreators.showThanksForMinutesPurchaseModal,
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseStateModals);
