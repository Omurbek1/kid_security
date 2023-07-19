export const types = {
  POPUP_INVITE_FRIEND_SHOW_HIDE: 'POPUP_INVITE_FRIEND_SHOW',
  TOGGLE_PIN_CODE_DIALOG: 'TOGGLE_PIN_CODE_DIALOG',
  TOGGLE_PIN_CODE_HINT_DIALOG: 'TOGGLE_PIN_CODE_HINT_DIALOG',
  TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL: 'TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL',
  TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL2: 'TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL2',
  CANCEL_BTN_SHOW_HIDE: 'CANCEL_BTN_SHOW_OR_HIDE',
  SHOW_NOT_ENOUGH_BALANCE_MODAL: 'SHOW_NOT_ENOUGH_BALANCE_MODAL',
  SHOW_SUCCESSFUL_SUBSCRIPTION_MODAL: 'SHOW_SUCCESSFUL_SUBSCRIPTION_MODAL',
  SHOW_THANKS_FOR_MINUTES_PURCHASE_MODAL: 'SHOW_THANKS_FOR_MINUTES_PURCHASE_MODAL',
  SHOW_PREMIUM_MODAL: 'SHOW_PREMIUM_MODAL',
  SHOW_ALERT: 'SHOW_ALERT',
};

export const popupActionCreators = {
  popupInviteFriendShowHide: () => {
    return { type: types.POPUP_INVITE_FRIEND_SHOW_HIDE };
  },
  togglePinCodeDialog: (data = undefined) => {
    return { type: types.TOGGLE_PIN_CODE_DIALOG, payload: data };
  },
  togglePinCodeHintDialog: (data = undefined) => {
    return { type: types.TOGGLE_PIN_CODE_HINT_DIALOG, payload: data };
  },
  toggleDialogPinCodeHintDetail: (data = undefined) => {
    return { type: types.TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL, payload: data };
  },
  showNotEnoughBalanceModal: (data) => {
    return { type: types.SHOW_NOT_ENOUGH_BALANCE_MODAL, payload: data };
  },
  showSuccessfulSubscriptionModal: (data) => {
    return { type: types.SHOW_SUCCESSFUL_SUBSCRIPTION_MODAL, payload: data };
  },
  showThanksForMinutesPurchaseModal: (data) => {
    return { type: types.SHOW_THANKS_FOR_MINUTES_PURCHASE_MODAL, payload: data };
  },
  showPremiumModal: (data) => {
    return { type: types.SHOW_PREMIUM_MODAL, payload: data };
  },
  showAlert: (
    isVisible,
    title,
    subtitle,
    isSupportVisible,
    supportText,
    actionTitle,
    actions,
  ) => {
    return {
      type: types.SHOW_ALERT,
      payload: {
        isVisible,
        title,
        subtitle,
        isSupportVisible,
        supportText,
        actionTitle,
        actions,
      },
    };
  },
};

//BOTTOM NAVIGATION ON LONG PRESS ACTION
export const mapCancelBtnActionCreators = {
  mainMapShowHideCancelBtn: (value) => {
    return { type: types.CANCEL_BTN_SHOW_HIDE, payload: value };
  },
};

const initialState = {
  popupInviteFriendVisible: false,
  dialogPinCode: false,
  dialogPinCodeHint: false,
  dialogPinCodeHintDetail: false,
  cancelBtnTrigger: false,
  isNotEnoughBalanceModalVisible: false,
  isSuccessfulSubscriptionModalVisible: false,
  isThanksForMinutesPurchaseModalVisible: false,
  isPremiumModalVisible: false,
  alertObj: {},
};

export const popupReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.POPUP_INVITE_FRIEND_SHOW_HIDE: {
      let visible = !state.popupInviteFriendVisible;
      return {
        ...state,
        popupInviteFriendVisible: visible,
      };
    }
    case types.TOGGLE_PIN_CODE_DIALOG: {
      return {
        ...state,
        dialogPinCode: payload || !state.dialogPinCode,
      };
    }
    case types.TOGGLE_PIN_CODE_HINT_DIALOG: {
      return {
        ...state,
        dialogPinCodeHint: payload || !state.dialogPinCodeHint,
      };
    }
    case types.TOGGLE_DIALOG_PIN_CODE_HINT_DETAIL: {
      return {
        ...state,
        dialogPinCodeHintDetail: payload || !state.dialogPinCodeHintDetail,
      };
    }

    //BOTTOM NAVIGATION ON LONG PRESS CANCELLBTN
    case types.CANCEL_BTN_SHOW_HIDE: {
      return {
        ...state,
        cancelBtnTrigger: payload,
      };
    }

    case types.SHOW_NOT_ENOUGH_BALANCE_MODAL: {
      return {
        ...state,
        isNotEnoughBalanceModalVisible: payload,
      };
    };

    case types.SHOW_SUCCESSFUL_SUBSCRIPTION_MODAL: {
      return {
        ...state,
        isSuccessfulSubscriptionModalVisible: payload,
      };
    };

    case types.SHOW_THANKS_FOR_MINUTES_PURCHASE_MODAL: {
      return {
        ...state,
        isThanksForMinutesPurchaseModalVisible: payload,
      };
    };

    case types.SHOW_PREMIUM_MODAL: {
      return {
        ...state,
        isPremiumModalVisible: payload,
      };
    };

    case types.SHOW_ALERT: {
      return {
        ...state,
        alertObj: payload,
      };
    };
  }

  return state;
};

export const popupSelectors = {
  getPopupInviteFriendVisible: (state) => state.popupReducer.popupInviteFriendVisible,
  getDialogPinCode: (state) => state.popupReducer.dialogPinCode,
  getDialogPinCodeHint: (state) => state.popupReducer.dialogPinCodeHint,
  getDialogPinCodeHintDetail: (state) => state.popupReducer.dialogPinCodeHintDetail,
  getPopupInviteFriendVisible: (state) => state.popupReducer.popupInviteFriendVisible,
  getNotEnoughBalanceModalVisible: (state) => state.popupReducer.isNotEnoughBalanceModalVisible,
  getSuccessfulSubscriptionModalVisible: (state) => state.popupReducer.isSuccessfulSubscriptionModalVisible,
  getThanksForMinutesPurchaseModalVisible: (state) => state.popupReducer.isThanksForMinutesPurchaseModalVisible,
  getPremiumModalVisible: (state) => state.popupReducer.isPremiumModalVisible,
  getAlert: (state) => state.popupReducer.alertObj,
};
