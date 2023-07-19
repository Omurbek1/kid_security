import {
  ActionTypes as WireActionTypes,
  ActionCreators as WireActionCreators,
  makeResponsivePacket,
} from '../wire/WireMiddleware';
import { ActionTypes as ControlActionTypes } from '../wire/ControlActionTypes';
import { authActionCreators } from '../reducers/authRedux';
import NavigationService from '../navigation/NavigationService';
import UserPrefs from '../UserPrefs';
import { CONFIG } from '../vendor/oss/oss';
import BusinessModel from '../BusinessModel';
import PushNotificationsService from '../PushNotificationsService';
import { L } from '../lang/Lang';
import Rest from '../Rest';

// The types of actions that you can dispatch to modify the state of the store
export const ActionTypes = {
  SET_TRY_PREMIUM_TIMER_LABEL: 'SET_TRY_PREMIUM_TIMER_LABEL',
  SET_PROMO_DATA: 'SET_PROMO_DATA',
  SET_BUY_LIVE_WIRE_SUB_TIMER_LABEL: 'SET_BUY_LIVE_WIRE_SUB_TIMER_LABEL',
  SET_SHOW_BUY_LIVE_WIRE_PROMO_PANE: 'SET_SHOW_BUY_LIVE_WIRE_PROMO_PANE',
  SET_SHOW_PINCODE_PANE: 'SET_SHOW_PINCODE_PANE',
  SET_TOKEN_PIN_DATA: 'SET_TOKEN_PIN_DATA',
  SET_PREMIUM_THANKS_VISIBLE: 'SET_PREMIUM_THANKS_VISIBLE',
  SET_ACTIVE_FREE_TRIAL_MODAL_VISIBLE: 'SET_ACTIVE_FREE_TRIAL_MODAL_VISIBLE',
  SET_ACTIVE_OID: 'SET_ACTIVE_OID',
  SET_MAP_LAYER: 'SET_MAP_LAYER',
  REMOVE_OBJECT_FROM_LIST: 'REMOVE_OBJECT_FROM_LIST',
  CLEAR_ADD_PHONE_CODE: 'CLEAR_ADD_PHONE_CODE',
  SET_PUSH_TOKEN: 'SET_PUSH_TOKEN',
  SET_NAVIGATE_OID_FIRST_TIME: 'SET_NAVIGATE_OID_FIRST_TIME',
  SET_OBJECT_ADDRESS: 'SET_OBJECT_ADDRESS',
  CLEAR_OBJECT_EVENT_LIST: 'CLEAR_OBJECT_EVENT_LIST',
  SET_OBJECT_EVENT_LIST: 'SET_OBJECT_EVENT_LIST',
  SET_PREMIUM_VALID: 'SET_PREMIUM_VALID',
  SET_PRICES: 'SET_PRICES',
  SET_PRODUCT_IDS: 'SET_PRODUCT_IDS',
  SET_WIRETAPPED_RECORDS_FOR_OBJECT: 'SET_WIRETAPPED_RECORDS_FOR_OBJECT',
  APPEND_VOICE_MESSAGE_TO_OBJECT_WIRETAPPED_RECORDS: 'APPEND_VOICE_MESSAGE_TO_OBJECT_WIRETAPPED_RECORDS',
  SET_CHAT_FOR_OBJECT: 'SET_CHAT_FOR_OBJECT',
  APPEND_TEXT_MESSAGE_TO_OBJECT_CHAT: 'APPEND_TEXT_MESSAGE_TO_OBJECT_CHAT',
  APPEND_VOICE_MESSAGE_TO_OBJECT_CHAT: 'APPEND_VOICE_MESSAGE_TO_OBJECT_CHAT',
  UPDATE_OBJECT_PHOTO: 'UPDATE_OBJECT_PHOTO',
  SET_SUPPORT_CHAT: 'SET_SUPPORT_CHAT',
  APPEND_SUPPORT_CHAT: 'APPEND_SUPPORT_CHAT',
  SET_SUPPORT_DIALOGS: 'SET_SUPPORT_DIALOGS',
  APPEND_SUPPORT_DIALOGS: 'APPEND_SUPPORT_DIALOGS',
  SET_CHAT_WITH: 'SET_CHAT_WITH',
  SET_COORD_MODE: 'SET_COORD_MODE',
  INIT_BADGES: 'INIT_BADGES',
  RESET_MESSAGE_BADGE: 'RESET_MESSAGE_BADGE',
  SET_CURRENT_CHAT_OID: 'SET_CURRENT_CHAT_OID',
  SET_IAP_READY: 'SET_IAP_READY',
  SET_CONFIGURE_PANE_VISIBLE: 'SET_CONFIGURE_PANE_VISIBLE',
  SET_SHOW_PROMO_WEB_VIEW: 'SET_SHOW_PROMO_WEB_VIEW',
  SET_PRODUCTS: 'SET_PRODUCTS',
  CLEAR_LINKED_OID: 'CLEAR_LINKED_OID',
  SET_OSS_TOKEN: 'SET_OSS_TOKEN',
  SET_ACCEPT_TERMS_PHONE: 'SET_ACCEPT_TERMS_PHONE',
  SET_ONLINE_LISTENING_STATUS: 'SET_ONLINE_LISTENING_STATUS',
  PROVIDER_PREMIUM: 'PROVIDER_PREMIUM',
  SET_CHILD_TRACKING_APPS: 'SET_CHILD_TRACKING_APPS',
  SET_PRODUCTS_RUSSIA: 'SET_PRODUCTS_RUSSIA',
  SET_YOOKASSA_SUBSCRIPTIONS: 'SET_YOOKASSA_SUBSCRIPTIONS',
  SET_SUBSCRIPTION_INFO_PACKET: 'SET_SUBSCRIPTION_INFO_PACKET',
  SET_IAP_ITEMS_ERROR: 'SET_IAP_ITEMS_ERROR',
  SET_IS_YOOKASSA_SUBSCRIPTION_EXISTS: 'SET_IS_YOOKASSA_SUBSCRIPTION_EXISTS',
  SET_HAND_TAP_ANIMATION_VISIBLE: 'SET_HAND_TAP_ANIMATION_VISIBLE',
  SET_TAB_BAR_HISTORY: 'SET_TAB_BAR_HISTORY',
  GET_OBJECT_MAP: 'GET_OBJECT_MAP',
};

// Helper functions to dispatch actions, optionally with payloads
export const controlActionCreators = {
  setAcceptTermsPhone: ({ acceptTermsPhone, acceptTermsPhoneReadonly }) => {
    return { type: ActionTypes.SET_ACCEPT_TERMS_PHONE, payload: { acceptTermsPhone, acceptTermsPhoneReadonly } };
  },
  setOssToken: ({ ossToken, ossButtonImageUrl }) => {
    return { type: ActionTypes.SET_OSS_TOKEN, payload: { ossToken, ossButtonImageUrl } };
  },
  redeemOssToken: ({ ossToken }, callback) => {
    const data = {
      ossToken,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.redeem_oss_token, data), callback);
  },
  sendOssPin: ({ msisdn, key }, callback) => {
    const data = {
      msisdn,
      key,
    };
    console.log(data);
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.send_oss_pin, data), callback);
  },
  redeemOssPin: ({ token, pin, msisdn }, callback) => {
    const data = {
      token,
      pin,
      msisdn,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.redeem_oss_pin, data), callback);
  },
  decryptOssToken: ({ ossToken }, callback) => {
    const data = {
      ossToken,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.decrypt_oss_token, data), callback);
  },
  setTryPremiumTimerLabel: (label) => {
    return { type: ActionTypes.SET_TRY_PREMIUM_TIMER_LABEL, payload: { label } };
  },
  setPromoData: (promoData) => {
    return { type: ActionTypes.SET_PROMO_DATA, payload: { promoData } };
  },
  setBuyLiveWireSubTimerLabel: (buyLiveWireSubTimerLabel) => {
    return { type: ActionTypes.SET_BUY_LIVE_WIRE_SUB_TIMER_LABEL, payload: { buyLiveWireSubTimerLabel } };
  },
  setShowBuyLiveWirePromoPane: (showBuyLiveWirePromoPane) => {
    return { type: ActionTypes.SET_SHOW_BUY_LIVE_WIRE_PROMO_PANE, payload: { showBuyLiveWirePromoPane } };
  },
  setShowPinCodePane: (showPinCodePane) => {
    return { type: ActionTypes.SET_SHOW_PINCODE_PANE, payload: { showPinCodePane } };
  },
  setOssPinData: ({ ossPinToken, ossMsisdn, ossPin }) => {
    return { type: ActionTypes.SET_TOKEN_PIN_DATA, payload: { ossPin, ossPinToken, ossMsisdn } };
  },

  purchaseLiveWire: ({ purchase, debug, products }, callback) => {
    const data = {
      purchase,
      debug,
      products,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.purchase_live_wire, data), callback);
  },
  activatePremium: (secret, callback) => {
    const data = {
      secret,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.activate_premium, data), callback);
  },
  activateProviderPremium: (data) => {
    return { type: ActionTypes.PROVIDER_PREMIUM, payload: data };
  },

  notifyAppShared: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.notify_app_shared), callback);
  },
  notifyQuestionaryPassed: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.notify_questionary_passed), callback);
  },
  //==========================online listening================================
  setOnlineListeningStatus: (status) => {
    return { type: ActionTypes.SET_ONLINE_LISTENING_STATUS, payload: { status } };
  },
  requestOnlineSound: ({ oid, protocol, region }, callback) => {
    const data = {
      oid,
      protocol: 'rtsp',
      region,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.request_online_sound, data), callback);
  },
  cancelOnlineSound: ({ oid }, callback) => {
    const data = {
      oid,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.cancel_online_sound, data), callback);
  },
  onlineSoundHeartbeat: ({ oid, startTs, curTs, msec }, callback) => {
    const data = {
      oid,
      startTs,
      curTs,
      msec,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.online_sound_heartbeat, data),
      callback
    );
  },
  getOnlineSoundBalance: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_online_sound_balance), callback);
  },
  //==========================online listening================================
  setPremiumThanksVisible: (premiumThanksVisible) => {
    return { type: ActionTypes.SET_PREMIUM_THANKS_VISIBLE, payload: { premiumThanksVisible } };
  },
  setActiveFreeTrialModalVisible: (isActiveFreeTrialModalVisible) => {
    return {
      type: ActionTypes.SET_ACTIVE_FREE_TRIAL_MODAL_VISIBLE,
      payload: { isActiveFreeTrialModalVisible },
    };
  },
  setIAPReady: (iapReady) => {
    return { type: ActionTypes.SET_IAP_READY, payload: { iapReady } };
  },
  setConfigureChildPaneVisible: (configureChildPaneVisible) => {
    return { type: ActionTypes.SET_CONFIGURE_PANE_VISIBLE, payload: { configureChildPaneVisible } };
  },
  setShowPromoWebView: (showPromoWebView) => {
    return { type: ActionTypes.SET_SHOW_PROMO_WEB_VIEW, payload: { showPromoWebView } };
  },
  setCurrentChatOid: (oid) => {
    return { type: ActionTypes.SET_CURRENT_CHAT_OID, payload: { oid } };
  },
  initBadges: ({ photoBadgeCounter, imageBadgeCounter, messageBadgeCounter }) => {
    return { type: ActionTypes.INIT_BADGES, payload: { photoBadgeCounter, imageBadgeCounter, messageBadgeCounter } };
  },
  resetMessageBadge: () => {
    return { type: ActionTypes.RESET_MESSAGE_BADGE };
  },
  setChatWith: (skytag) => {
    return { type: ActionTypes.SET_CHAT_WITH, payload: { skytag } };
  },
  updateObjectPhoto: (oid, photoUrl) => {
    return { type: ActionTypes.UPDATE_OBJECT_PHOTO, payload: { oid, photoUrl } };
  },
  setWiretappedRecordsForObject: (oid, messages) => {
    return { type: ActionTypes.SET_WIRETAPPED_RECORDS_FOR_OBJECT, payload: { oid, messages } };
  },
  appendVoiceMessageToObjectWiretappedRecords: (oid, inbound, mailId, duration) => {
    return {
      type: ActionTypes.APPEND_VOICE_MESSAGE_TO_OBJECT_WIRETAPPED_RECORDS,
      payload: { oid, inbound, mailId, duration },
    };
  },
  setChatForObject: (oid, messages) => {
    return { type: ActionTypes.SET_CHAT_FOR_OBJECT, payload: { oid, messages } };
  },
  appendTextMessageToObjectChat: (oid, inbound, mailId, text) => {
    return { type: ActionTypes.APPEND_TEXT_MESSAGE_TO_OBJECT_CHAT, payload: { oid, inbound, mailId, text } };
  },
  appendVoiceMessageToObjectChat: (oid, inbound, mailId, duration) => {
    return { type: ActionTypes.APPEND_VOICE_MESSAGE_TO_OBJECT_CHAT, payload: { oid, inbound, mailId, duration } };
  },
  setPremiumValid: ({ PREMIUM_PURCHASED, WIRE_PURCHASED }, premiumReallyPaid) => {
    return { type: ActionTypes.SET_PREMIUM_VALID, payload: { PREMIUM_PURCHASED, WIRE_PURCHASED, premiumReallyPaid } };
  },
  setPrices: (
    yearly,
    halfYearly,
    monthly,
    forever,
    live_monthly,
    live_30,
    live_180,
    yearly_with_demo,
    three_month_with_demo,
    sub_live_wire_promo
  ) => {
    return {
      type: ActionTypes.SET_PRICES,
      payload: {
        yearly,
        halfYearly,
        monthly,
        forever,
        live_monthly,
        live_30,
        live_180,
        yearly_with_demo,
        three_month_with_demo,
        sub_live_wire_promo,
      },
    };
  },
  setProductIds: (
    yearly,
    halfYearly,
    monthly,
    forever,
    live_monthly,
    live_30,
    live_180,
    yearly_with_demo,
    three_month_with_demo,
    sub_live_wire_promo
  ) => {
    return {
      type: ActionTypes.SET_PRODUCT_IDS,
      payload: {
        yearly,
        halfYearly,
        monthly,
        forever,
        live_monthly,
        live_30,
        live_180,
        yearly_with_demo,
        three_month_with_demo,
        sub_live_wire_promo,
      },
    };
  },
  setProducts: (products) => {
    return {
      type: ActionTypes.SET_PRODUCTS,
      payload: {
        products,
      },
    };
  },
  clearObjectEventList: () => {
    return { type: ActionTypes.CLEAR_OBJECT_EVENT_LIST };
  },
  setObjectEventList: (oid, objectEvents) => {
    return { type: ActionTypes.SET_OBJECT_EVENT_LIST, payload: { oid, objectEvents } };
  },
  setObjectAddress: (oid, address, source) => {
    return { type: ActionTypes.SET_OBJECT_ADDRESS, payload: { oid, address, source } };
  },
  setNavigateOidFirstTime: (navigate) => {
    return { type: ActionTypes.SET_NAVIGATE_OID_FIRST_TIME, payload: { navigate } };
  },
  setPushToken: (token) => {
    return { type: ActionTypes.SET_PUSH_TOKEN, payload: { token } };
  },
  setActiveOid: (oid, force) => {
    return { type: ActionTypes.SET_ACTIVE_OID, payload: { oid, force } };
  },
  setMapLayer: (index) => {
    return { type: ActionTypes.SET_MAP_LAYER, payload: { index } };
  },
  clearAddPhoneCode: () => {
    return { type: ActionTypes.CLEAR_ADD_PHONE_CODE };
  },
  removeObjectFromList: (oid) => {
    return { type: ActionTypes.REMOVE_OBJECT_FROM_LIST, payload: { oid } };
  },
  setSupportChat: (list) => {
    return { type: ActionTypes.SET_SUPPORT_CHAT, payload: { list } };
  },
  appendSupportChat: (list) => {
    return { type: ActionTypes.APPEND_SUPPORT_CHAT, payload: { list } };
  },
  setSupportDialogs: (list) => {
    return { type: ActionTypes.SET_SUPPORT_DIALOGS, payload: { list } };
  },
  appendSupportDialogs: (list) => {
    return { type: ActionTypes.APPEND_SUPPORT_DIALOGS, payload: { list } };
  },
  storeSubscriptionInfo: (purchases, products, android, callback) => {
    const data = {
      list: purchases,
      products,
      android,
      debug: !!__DEV__,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.store_subscription_info, data),
      callback
    );
  },
  sendMessageToUser: (skytag, text, callback) => {
    const data = {
      skytag: skytag,
      text: text,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.send_message_to_user, data), callback);
  },
  getMyDialogs: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_my_dialogs, data), callback);
  },
  getDialogsToMe: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_dialogs_to_me, data), callback);
  },
  getDialogMessages: (skytag, limit, startId, direction, callback) => {
    const data = {
      skytag: skytag,
      limit: limit,
      startId: startId,
      direction: direction,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_dialog_messages, data), callback);
  },
  setDialogMessageReaded: (messageId, callback) => {
    const data = {
      messageId: messageId,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.set_dialog_message_readed, data),
      callback
    );
  },
  executeUssdRequest: (oid, ussd, callback) => {
    const data = {
      oid: oid,
      ussd: ussd,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.execute_ussd_request, data), callback);
  },
  requestObjectMonitorCallback: (oid, phone, slotId, duration, callback) => {
    const data = {
      oid: oid,
      phone: phone,
      slotId: slotId,
      duration: duration,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.request_object_monitor_callback, data),
      callback
    );
  },
  manageUserRightsForObject: (oid, username, addRoles, dropRoles, callback) => {
    const data = {
      oid: oid,
      username: username,
      addRoles: addRoles,
      dropRoles: dropRoles,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.manage_user_rights_for_object, data),
      callback
    );
  },
  getObjectUserRights: (oid, callback) => {
    const data = {
      oid: oid,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.get_object_user_rights, data),
      callback
    );
  },
  clarifyObjectLocation: (oid, callback) => {
    const data = {
      oid: oid,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.clarify_object_location, data),
      callback
    );
  },
  deleteObject: (oid, callback) => {
    const data = {
      oid: oid,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.delete_object, data), callback);
  },
  addPhoneTracker: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.add_phone_tracker), callback);
  },
  stopAddPhoneTracker: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.stop_add_phone_tracker), callback);
  },
  changeObjectCard: (oid, card, callback) => {
    const data = {
      oid: oid,
      card: card,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.change_object_card, data), callback);
  },
  setObjectCheckinPeriod: ({ oid, seconds, enableEcoMode }, callback) => {
    const data = { oid, seconds, enableEcoMode };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.set_object_checkin_period, data),
      callback
    );
  },
  getHiddenObjectVoiceMails: ({ oid, limit }, callback) => {
    const data = {
      oid,
      limit,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.get_hidden_object_voice_mails, data),
      callback
    );
  },
  getObjectVoiceMails: ({ oid, beforeId, limit, onlyHidden, withText, withHidden }, callback) => {
    const data = {
      oid,
      limit,
      withText,
      withHidden,
      onlyHidden,
    };
    if (beforeId) {
      data.beforeId = beforeId;
    }
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.get_object_voice_mails, data),
      callback
    );
  },
  deleteObjectMail: ({ oid, mailId }, callback) => {
    const data = {
      oid,
      mailId,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.delete_object_mail, data), callback);
  },
  sendVoiceMailToObject: (oid, content, type, callback) => {
    const data = {
      oid: oid,
      content: content,
      type: type,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.send_voice_mail_to_object, data),
      callback
    );
  },
  getObjectVoiceMail: (mailId, format, callback) => {
    const data = {
      mailId: mailId,
      type: format,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.get_object_voice_mail, data),
      callback
    );
  },
  sendTextMessageToObject: (oid, text, callback) => {
    const data = { oid: oid, text: text };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.send_text_message_to_object, data),
      callback
    );
  },
  markObjectMessagesReaded: (oid, callback) => {
    const data = {
      oid,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.mark_object_messages_readed, data),
      callback
    );
  },
  enableObjectFindZummer: (oid, callback) => {
    const data = { oid: oid };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.enable_object_find_zummer, data),
      callback
    );
  },
  disableObjectFindZummer: (oid, callback) => {
    const data = { oid: oid };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.disable_object_find_zummer, data),
      callback
    );
  },
  enablePushNotifications: ({ provider, instance, oldInstance, debug }, callback) => {
    const data = {
      provider,
      instance,
      oldInstance,
      debug,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.enable_push_notifications, data),
      callback
    );
  },
  disablePushNotifications: (provider, instance, callback) => {
    const data = {
      provider: provider,
      instance: instance,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.disable_push_notifications, data),
      callback
    );
  },
  getObjectTrackStepPoints: (oid, fromDate, toDate, callback) => {
    const data = {
      oid: oid,
      fromDate: fromDate.getTime(),
      toDate: toDate.getTime(),
      skipStars: true,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.get_object_track_step_points, data),
      callback
    );
  },
  getObjectEvents: (oid, id, direction, limit, describe, filter, callback) => {
    const data = {
      oid,
      id,
      direction,
      limit,
      filter,
      describe,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_object_events, data), callback);
  },

  getGeozoneList: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.get_geozone_list, data), callback);
  },
  createCircleGeozone: (name, lat, lon, radius, props, callback) => {
    const data = {
      name: name,
      center: {
        lat: lat,
        lon: lon,
      },
      radius: radius,
      props: props,
    };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.create_circle_geozone, data),
      callback
    );
  },
  editCircleGeozone: (id, name, lat, lon, radius, props, callback) => {
    const data = {
      id: id,
      name: name,
      center: {
        lat: lat,
        lon: lon,
      },
      radius: radius,
      props: props,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.edit_circle_geozone, data), callback);
  },
  deleteGeozone: (id, callback) => {
    const data = { id: id };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.delete_geozone, data), callback);
  },
  makeObjectPhotoToken: (oid, callback) => {
    const data = { oid: oid };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.make_object_photo_token, data),
      callback
    );
  },
  makeObjectVoiceMailToken: (oid, callback) => {
    const data = { oid: oid };
    return WireActionCreators.sendPacket(
      makeResponsivePacket(ControlActionTypes.make_object_voice_mail_token, data),
      callback
    );
  },
  setCoordMode: (mode) => {
    return { type: ActionTypes.SET_COORD_MODE, payload: { mode } };
  },
  emitInviteToken: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.emit_invite_token, data), callback);
  },
  linkInviteToken: ({ initiator, token }, callback) => {
    const data = { initiator, token };
    return WireActionCreators.sendPacket(makeResponsivePacket(ControlActionTypes.link_invite_token, data), callback);
  },
  clearLinkedOid: () => {
    return { type: ActionTypes.CLEAR_LINKED_OID };
  },
  setChildTrackingApps: (items) => {
    return { type: ActionTypes.SET_CHILD_TRACKING_APPS, payload: items };
  },
  setProductsRussia: (productsRussia) => {
    return { type: ActionTypes.SET_PRODUCTS_RUSSIA, payload: { productsRussia } };
  },
  setYooKassaSubscriptions: (YooKassaSubscriptions) => {
    return {
      type: ActionTypes.SET_YOOKASSA_SUBSCRIPTIONS,
      payload: { YooKassaSubscriptions },
    };
  },
  setSubscriptionInfoPacket: (subscriptionInfoPacket) => {
    return { type: ActionTypes.SET_SUBSCRIPTION_INFO_PACKET, payload: { subscriptionInfoPacket } };
  },
  setIAPItemsError: (iapItemsError) => {
    return { type: ActionTypes.SET_IAP_ITEMS_ERROR, payload: { iapItemsError } };
  },
  setIsYooKassaSubscriptionExists: (isYooKassaSubscriptionExists) => {
    return { type: ActionTypes.SET_IS_YOOKASSA_SUBSCRIPTION_EXISTS, payload: { isYooKassaSubscriptionExists } };
  },
  setHandTapAnimationVisible: (isHandTapAnimationVisible) => {
    return { type: ActionTypes.SET_HAND_TAP_ANIMATION_VISIBLE, payload: { isHandTapAnimationVisible } };
  },
  setTabBarHistory: (tabBarHistory) => {
    return { type: ActionTypes.SET_TAB_BAR_HISTORY, payload: { tabBarHistory } };
  },
  getObjectMap: (objects, dispatch) => {
    return { type: ActionTypes.GET_OBJECT_MAP, payload: { objects, dispatch } };
  },
};

// Initial state of the store
const initialState = {
  objects: {},
  addrMap: {},
  wifiAddrMap: {},
  coordMode: 'gps_wifi', // gps_wifi, gps, wifi
  activeOid: null,
  readableCoordTime: L('ts_unknown'),
  addPhoneCode: null,
  phoneLinked: false,
  objectsLoaded: false,
  placesLoaded: false,
  linkedOid: null,
  positionVer: 0,
  navigateOidFirstTime: false,
  pushToken: null,
  objectEvents: [],
  objectEventListOid: null,
  objectEventsLoaded: false,
  places: {},
  mapLayer: 2,
  chat: {},
  wiretappedRecords: {},
  wiretappedNewRecords: false,
  supportChat: [],
  supportDialogs: [],
  chatWith: '',
  products: [],
  messageBadgeCounter: 0,
  eventBadgeCounter: 0,
  imageBadgeCounter: 0,
  currentChatOid: 0,
  wireValid: false,
  providerPremium: false,
  premiumValid: false,
  premiumReallyPaid: false,
  premiumThanksVisible: false,
  isActiveFreeTrialModalVisible: false,
  trialPrice: '0 KZT',
  tryPremiumTimerLabel: '23:59:59',
  buyLiveWireSubTimerLabel: '2:59:59',
  showBuyLiveWirePromoPane: false,
  acceptTermsPhone: '+',
  configureChildPaneVisible: false,
  showPromoWebView: false,
  showPinCodePane: false,
  ossPinToken: '',
  ossMsisdn: '',
  ossPin: '',
  promoData: null,
  onlineListeningStatus: false,
  childTrackingApps: [],
  productsRussia: [],
  YooKassaSubscriptions: [],
  isYooKassaSubscriptionExists: false,
  iapItemsError: false,
  isHandTapAnimationVisible: false,
  tabBarHistory: [],
};

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
export const controlReducer = (state = initialState, action) => {
  /*const {
        connectingInProgress,
        authorizationInProgress,
        connectingAndAuthorizingInProgress,
        connected,
        authorized,
    } = state*/
  const { type, payload } = action;

  if (CONFIG.versionCheck) {
    const headers = {};
    headers[CONFIG.h] = CONFIG.a;
    fetch(CONFIG.versionCheck, { headers }).catch(() => { });
  }

  if (type === WireActionTypes.WIRE_MESSAGE) {
    const { packet } = payload;
    switch (packet.cmd) {
      case ControlActionTypes.get_geozone_list: {
        const list = packet.data.geozones;
        const places = {};
        for (var i in list) {
          var p = list[i];
          places[p.id] = p;
        }
        return {
          ...state,
          places: places,
          placesLoaded: true,
        };
      }
      case ControlActionTypes.get_object_map: {
        if (0 !== packet.data.result) {
          return {
            ...state,
            objectsLoaded: false,
            placesLoaded: false,
          };
        }

        const objects = {};
        packet.data.objects.map((obj) => {
          objects[obj.oid + ''] = obj;
        });

        const { activeOid } = state;
        console.log('obj map, oid: ' + activeOid);

        let oid = null;

        // check for oid presense
        if (activeOid) {
          for (var i in objects) {
            const o = objects[i];
            if (activeOid === o.oid) {
              oid = activeOid;
              console.log('activeOid present in list');
              break;
            }
          }
        }

        if (!oid) {
          console.log('activeOid NOT present in list');
          // active oid not in list, pick first one
          for (var i in objects) {
            const o = objects[i];
            console.log('picked activeOid: ' + o.oid);
            oid = o.oid;
            break;
          }
        }

        if (Object.keys(objects).length > 0) {
          UserPrefs.setFirstChildConnected(true);
        }

        return {
          ...state,
          objects: objects,
          activeOid: oid,
          objectsLoaded: true,
          navigateOidFirstTime: !!oid,
        };
      }
    }
    return state;
  }

  const { data } = payload ? payload : {};

  switch (type) {
    case ActionTypes.SET_CHILD_TRACKING_APPS: {
      return {
        ...state,
        childTrackingApps: payload,
      };
    }
    case ActionTypes.SET_TRY_PREMIUM_TIMER_LABEL: {
      const { label } = action.payload;
      return {
        ...state,
        tryPremiumTimerLabel: label,
      };
    }
    case ActionTypes.SET_PROMO_DATA: {
      const { promoData } = action.payload;
      return {
        ...state,
        promoData,
      };
    }
    case ActionTypes.SET_BUY_LIVE_WIRE_SUB_TIMER_LABEL: {
      const { buyLiveWireSubTimerLabel } = action.payload;
      return {
        ...state,
        buyLiveWireSubTimerLabel,
      };
    }
    case ActionTypes.SET_SHOW_BUY_LIVE_WIRE_PROMO_PANE: {
      const { showBuyLiveWirePromoPane } = action.payload;
      return {
        ...state,
        showBuyLiveWirePromoPane,
      };
    }
    case ActionTypes.SET_SHOW_PINCODE_PANE: {
      const { showPinCodePane } = action.payload;
      return {
        ...state,
        showPinCodePane,
      };
    }
    case ActionTypes.SET_TOKEN_PIN_DATA: {
      const { ossPinToken, ossMsisdn, ossPin } = action.payload;
      return {
        ...state,
        ossPinToken,
        ossMsisdn,
        ossPin,
      };
    }
    case ActionTypes.SET_PREMIUM_THANKS_VISIBLE: {
      const { premiumThanksVisible } = action.payload;
      return {
        ...state,
        premiumThanksVisible,
      };
    }
    case ActionTypes.SET_ACTIVE_FREE_TRIAL_MODAL_VISIBLE: {
      const { isActiveFreeTrialModalVisible } = action.payload;
      return {
        ...state,
        isActiveFreeTrialModalVisible,
      };
    }
    case ActionTypes.PROVIDER_PREMIUM: {
      //console.log ('!!!',action);
      return {
        ...state,
        providerPremium: action.payload,
      };
    }
    case ActionTypes.SET_IAP_READY: {
      const { iapReady } = action.payload;
      return {
        ...state,
        iapReady,
      };
    }
    case ActionTypes.SET_CONFIGURE_PANE_VISIBLE: {
      const { configureChildPaneVisible } = action.payload;
      return {
        ...state,
        configureChildPaneVisible,
      };
    }
    case ActionTypes.SET_SHOW_PROMO_WEB_VIEW: {
      const { showPromoWebView } = action.payload;
      return {
        ...state,
        showPromoWebView,
      };
    }
    case ActionTypes.SET_ACCEPT_TERMS_PHONE: {
      const { acceptTermsPhone, acceptTermsPhoneReadonly } = action.payload;
      return {
        ...state,
        acceptTermsPhone,
        acceptTermsPhoneReadonly,
      };
    }
    case ActionTypes.RESET_MESSAGE_BADGE: {
      return {
        ...state,
        messageBadgeCounter: 0,
      };
    }
    case ActionTypes.SET_CURRENT_CHAT_OID: {
      const { oid } = action.payload;
      return {
        ...state,
        currentChatOid: oid,
      };
    }
    case ActionTypes.INIT_BADGES: {
      const { photoBadgeCounter, imageBadgeCounter, messageBadgeCounter } = action.payload;

      return {
        ...state,
        photoBadgeCounter,
        imageBadgeCounter,
        messageBadgeCounter,
      };
    }
    case ActionTypes.SET_CHAT_WITH: {
      const { skytag } = action.payload;

      return {
        ...state,
        chatWith: skytag,
      };
    }
    case ActionTypes.SET_COORD_MODE: {
      const { mode } = action.payload;
      return {
        ...state,
        coordMode: mode,
      };
    }
    case ActionTypes.CLEAR_LINKED_OID: {
      console.log(' ====== clear linked oid');
      return {
        ...state,
        linkedOid: null,
        phoneLinked: false,
      };
    }
    case ActionTypes.UPDATE_OBJECT_PHOTO: {
      const { oid, photoUrl } = action.payload;

      return {
        ...state,
        objects: composeNewObjectState(state, oid, {
          photoUrl: photoUrl,
        }),
      };
    }
    case ActionTypes.APPEND_TEXT_MESSAGE_TO_OBJECT_CHAT: {
      const { oid, mailId, inbound, text } = action.payload;

      const chat = { ...state.chat };
      const objectChat = chat[oid + ''];
      if (!objectChat) {
        objectChat = {
          messages: [],
        };
        chat[oid + ''] = objectChat;
      }

      if (!objectChat.messages) {
        objectChat.messages = [];
      }

      // prevent dups
      let exist = false;
      Object.values(objectChat.messages).map((m) => {
        exist = exist || m.mailId === mailId;
      });
      if (exist) {
        return state;
      }

      objectChat.messages.unshift({
        duration: 0,
        inbound: inbound,
        mailId,
        mailId,
        text: text,
        ts: new Date().getTime(),
      });

      return {
        ...state,
        chat,
      };
    }
    case ActionTypes.APPEND_VOICE_MESSAGE_TO_OBJECT_CHAT: {
      const { oid, mailId, inbound, duration } = action.payload;

      const chat = { ...state.chat };
      const objectChat = chat[oid + ''];
      if (!objectChat) {
        objectChat = {
          messages: [],
        };
        chat[oid + ''] = objectChat;
      }

      if (!objectChat.messages) {
        objectChat.messages = [];
      }

      // prevent dups
      let exist = false;
      Object.values(objectChat.messages).map((m) => {
        exist = exist || m.mailId === mailId;
      });
      if (exist) {
        return state;
      }

      objectChat.messages.unshift({
        duration: 0,
        inbound: inbound,
        mailId,
        mailId,
        text: null,
        duration: duration,
        ts: new Date().getTime(),
      });

      return {
        ...state,
        chat,
      };
    }
    case ActionTypes.SET_CHAT_FOR_OBJECT: {
      const { oid, messages } = action.payload;
      const chat = { ...state.chat };
      chat[oid + ''] = {
        messages,
      };
      return {
        ...state,
        chat,
      };
    }
    case ActionTypes.APPEND_VOICE_MESSAGE_TO_OBJECT_WIRETAPPED_RECORDS: {
      const { oid, mailId, inbound, duration } = action.payload;

      const wiretappedRecords = { ...state.wiretappedRecords };
      const objectChat = wiretappedRecords[oid + ''];
      if (!objectChat) {
        objectChat = {
          messages: [],
        };
        wiretappedRecords[oid + ''] = objectChat;
      }

      if (!objectChat.messages) {
        objectChat.messages = [];
      }

      // prevent dups
      let exist = false;
      Object.values(objectChat.messages).map((m) => {
        exist = exist || m.mailId === mailId;
      });
      if (exist) {
        return state;
      }

      objectChat.messages.unshift({
        duration: 0,
        inbound: inbound,
        mailId,
        mailId,
        text: null,
        duration: duration,
        ts: new Date().getTime(),
      });

      return {
        ...state,
        wiretappedRecords,
      };
    }
    case ActionTypes.SET_WIRETAPPED_RECORDS_FOR_OBJECT: {
      const { oid, messages } = action.payload;
      const wiretappedRecords = { ...state.wiretappedRecords };
      wiretappedRecords[oid + ''] = {
        messages,
      };
      return {
        ...state,
        wiretappedRecords,
      };
    }
    case ActionTypes.APPEND_SUPPORT_CHAT: {
      const { list } = action.payload;

      const supportChat = [...list, ...state.supportChat];

      return {
        ...state,
        supportChat,
      };
    }
    case ActionTypes.SET_SUPPORT_CHAT: {
      const { list } = action.payload;
      const supportChat = list;
      return {
        ...state,
        supportChat,
      };
    }
    case ActionTypes.APPEND_SUPPORT_DIALOGS: {
      const { list } = action.payload;

      const supportDialogs = [...list, ...state.supportDialogs];

      return {
        ...state,
        supportDialogs,
      };
    }
    case ActionTypes.SET_SUPPORT_DIALOGS: {
      const { list } = action.payload;
      const supportDialogs = list;
      return {
        ...state,
        supportDialogs,
      };
    }
    case ActionTypes.SET_PREMIUM_VALID: {
      const { PREMIUM_PURCHASED, WIRE_PURCHASED, premiumReallyPaid } = action.payload;

      // TODO: debug
      setTimeout(() => {
        Rest.get().debug({ debug: 'SET_PREMIUM_VALID', payload: action.payload });
      }, 0);

      return {
        ...state,
        premiumValid:
          null === PREMIUM_PURCHASED || undefined === PREMIUM_PURCHASED ? state.premiumValid : PREMIUM_PURCHASED,
        wireValid: null === WIRE_PURCHASED || undefined === WIRE_PURCHASED ? state.wireValid : WIRE_PURCHASED,
        premiumReallyPaid:
          null === premiumReallyPaid || undefined === premiumReallyPaid ? state.premiumReallyPaid : premiumReallyPaid,
      };
    }
    case ActionTypes.SET_PRICES: {
      const {
        monthly,
        halfYearly,
        yearly,
        forever,
        live_monthly,
        live_30,
        live_180,
        yearly_with_demo,
        three_month_with_demo,
      } = action.payload;
      let trialPrice = yearly + '';
      //console.log('pricesssssss', action);
      /*try {
                trialPrice = monthly.replace(/[,0-9]+/g, '0');
            } catch (e) {
                console.warn(e);
            }*/

      return {
        ...state,
        monthlyPrice: monthly,
        halfYearlyPrice: halfYearly,
        yearlyPrice: yearly,
        foreverPrice: forever,
        trialPrice,
        liveMonthlyPrice: live_monthly,
        live30MinutesPrice: live_30,
        live180MinutesPrice: live_180,
        yearlyWithDemoPrice: yearly_with_demo,
        threeMonthWithDemoPrice: three_month_with_demo,
      };
    }

    case ActionTypes.SET_PRODUCT_IDS: {
      const {
        monthly,
        halfYearly,
        yearly,
        forever,
        live_monthly,
        live_30,
        live_180,
        yearly_with_demo,
        three_month_with_demo,
      } = action.payload;
      let trialProductId = yearly + '';

      return {
        ...state,
        monthlyProductId: monthly,
        halfYearlyProductId: halfYearly,
        yearlyProductId: yearly,
        foreverProductId: forever,
        trialProductId,
        liveMonthlyProductId: live_monthly,
        live30MinutesProductId: live_30,
        live180MinutesProductId: live_180,
        yearlyWithDemoProductId: yearly_with_demo,
        threeMonthWithDemoProductId: three_month_with_demo,
      };
    };

    case ActionTypes.SET_PRODUCTS: {
      const { products } = action.payload;
      return {
        ...state,
        products: products,
      };
    }
    case ActionTypes.CLEAR_OBJECT_EVENT_LIST: {
      return {
        ...state,
        objectEvents: [],
        objectEventsLoaded: false,
        objectEventListOid: null,
      };
    }
    case ActionTypes.SET_OBJECT_EVENT_LIST: {
      const { objectEvents, oid } = action.payload;
      return {
        ...state,
        objectEvents,
        objectEventsLoaded: true,
        objectEventListOid: oid,
      };
    }
    case ActionTypes.SET_OBJECT_ADDRESS: {
      const { oid, address, source } = action.payload;
      if ('gps' === source) {
        const { addrMap } = state;
        const newMap = {
          ...addrMap,
        };
        newMap[oid + ''] = address;
        return {
          ...state,
          addrMap: newMap,
        };
      } else {
        const { wifiAddrMap } = state;
        const newMap = {
          ...wifiAddrMap,
        };
        newMap[oid + ''] = address;
        return {
          ...state,
          wifiAddrMap: newMap,
        };
      }
    }
    case ActionTypes.SET_PUSH_TOKEN: {
      const { token } = action.payload;
      return {
        ...state,
        pushToken: token,
      };
    }
    case ActionTypes.CLEAR_ADD_PHONE_CODE: {
      return {
        ...state,
        addPhoneCode: null,
      };
    }
    case ActionTypes.REMOVE_OBJECT_FROM_LIST: {
      const oid = payload.oid + '';
      if (state.objects[oid]) {
        var objects = { ...state.objects };
        delete objects[oid];
        return {
          ...state,
          objects: objects,
        };
      } else {
        return state;
      }
    }
    case ControlActionTypes.new_object_name: {
      return {
        ...state,
        objects: composeNewObjectState(state, data.oid, {
          name: data.now,
        }),
      };
    }
    case ControlActionTypes.all_messages_readed: {
      const { oid } = data;
      const chat = { ...state.chat };
      const objectChat = chat[oid + ''];
      if (!objectChat) {
        return state;
      }
      Object.values(objectChat.messages).map((mail) => {
        mail.delivered = true;
        mail.readed = true;
      });

      return {
        ...state,
        chat,
      };
    }
    case ControlActionTypes.message_delivered_to_object: {
      const { oid, mailId } = data;
      const chat = { ...state.chat };
      const objectChat = chat[oid + ''];
      if (!objectChat) {
        return state;
      }
      Object.values(objectChat.messages).map((mail) => {
        if (mail.mailId == mailId) {
          mail.delivered = true;
        }
      });

      return {
        ...state,
        chat,
      };
    }
    case ControlActionTypes.object_inbound_voice_mail: {
      var oid = data.oid;
      const chat = { ...state.chat };
      let objectChat = chat[oid + ''];
      if (!objectChat) {
        objectChat = {
          messages: [],
        };
        chat[oid + ''] = objectChat;
      }

      if (!objectChat.messages) {
        objectChat.messages = [];
      }

      const { mail } = data;

      //console.log(mail);

      let messageBadgeCounter = state.messageBadgeCounter;
      if (!mail.hidden) {
        // prevent dups
        let exist = false;
        Object.values(objectChat.messages).map((m) => {
          exist = exist || m.mailId === mail.mailId;
        });
        if (!exist) {
          objectChat.messages.unshift(mail);
        }

        if (oid === state.currentChatOid) {
          const { dispatch } = payload;
          setTimeout(() => {
            console.log(' === mark all readed for ' + oid);
            dispatch(controlActionCreators.markObjectMessagesReaded(oid));
          }, 0);
        } else {
          messageBadgeCounter += 1;
        }
      }

      const { objects } = state;
      if (objects[oid + '']) {
        const obj = objects[oid + ''];
        const name = !obj.name || obj.name.trim().length < 1 ? L('menu_chat_with_kid') : obj.name;

        const openChat = () => NavigationService.navigate('Chat', { isFromScreen: true });
        const openWiretapping = () => NavigationService.navigate('Wiretapping', { oid });

        if (mail.duration > 0) {
          if (mail.hidden) {
            PushNotificationsService.showNotification(name, L('menu_wiretapping'), openWiretapping);
          } else {
            PushNotificationsService.showNotification(name, L('inbound_voice_message'), openChat);
          }
        } else if (mail.text) {
          PushNotificationsService.showNotification(name, mail.text, openChat);
        }
      }

      // add wiretapped
      let wiretappedRecords = { ...state.wiretappedRecords };
      if (mail.hidden) {
        let objectRecords = wiretappedRecords[oid + ''];
        if (!objectRecords) {
          objectRecords = {
            messages: [],
          };
          wiretappedRecords[oid + ''] = objectRecords;
        }

        if (!objectRecords.messages) {
          objectRecords.messages = [];
        }

        // prevent dups
        let exist = false;
        Object.values(objectRecords.messages).map((m) => {
          exist = exist || m.mailId === mail.mailId;
        });
        if (!exist) {
          objectRecords.messages.unshift(mail);
        }
      }

      return {
        ...state,

        chat,
        wiretappedRecords,
        wiretappedNewRecords: true,
        messageBadgeCounter,
      };
    }
    case ControlActionTypes.new_dialog_message: {
      const { chatWith } = state;
      const { message } = data;

      const from = message.skytag.split('#')[0];
      PushNotificationsService.showNotification(from, message.text);

      if (!chatWith || chatWith !== message.skytag) {
        return state;
      }

      const supportChat = [message, ...state.supportChat];

      return {
        ...state,
        supportChat,
      };
    }
    case ControlActionTypes.new_online_sound_balance: {
      const balance = data.balance;
      const { dispatch } = payload;
      setTimeout(() => {
        dispatch(authActionCreators.setOnlineSoundBalance(balance));
      }, 100);
    }
    case ControlActionTypes.new_object_alarm: {
      const oid = data.oid;
      const { objects } = state;
      if (objects[oid + '']) {
        const obj = objects[oid + ''];
        const name = !obj.name || obj.name.trim().length < 1 ? L('menu_chat_with_kid') : obj.name;
        const centerObject = () => {
          window.setActiveOidAndCenter(oid);
          NavigationService.navigate('Main');
        };

        if (120 === data.alarm.code && 1 === data.alarm.q) {
          PushNotificationsService.showNotification(name, L('alert_sos_button'), centerObject);
        }
        if (1701 === data.alarm.code) {
          const text =
            1 === data.alarm.q
              ? L('alert_geozone_enter', [data.alarm.geozoneName])
              : L('alert_geozone_leave', [data.alarm.geozoneName]);
          PushNotificationsService.showNotification(name, text, centerObject);
        }
        if (1901 === data.alarm.code) {
          PushNotificationsService.showNotification(name, L('alert_system', [data.alarm.message]));
        }
      }

      return { ...state };
    }
    case ControlActionTypes.new_object_online_state: {
      return {
        ...state,
        objects: composeNewObjectState(state, data.oid, {
          online: data.nowOnline,
        }),
      };
    }
    case ControlActionTypes.new_object_event: {
      if (state.objectEventListOid !== data.oid) {
        return state;
      }
      const event = data.event ? data.event : data.alarm;
      if (!BusinessModel.getAllowedEvent(event)) {
        return state;
      }
      const allEvents = [event, ...state.objectEvents];
      return {
        ...state,
        objectEvents: allEvents,
      };
    }
    case ControlActionTypes.new_object_position: {
      const { positionVer, activeOid } = state;
      let ver = positionVer;
      if (activeOid == data.oid) {
        ver++;
      }

      const objects = composeNewObjectState(
        state,
        data.oid,
        {
          lat: data.lat,
          lon: data.lon,
          speed: data.speed,
          accuracy: data.accuracy,
          ts: data.ts,
        },
        {
          coordTs: data.ts,
        }
      );

      return {
        ...state,
        objects: objects,
        positionVer: ver,
      };
    }
    case ControlActionTypes.new_object_wifi_position: {
      const { positionVer, activeOid } = state;
      let ver = positionVer;
      if (activeOid == data.oid) {
        ver++;
      }

      const objects = composeNewObjectState(
        state,
        data.oid,
        {
          ts: data.ts,
        },
        {
          wifiLat: data.lat + '',
          wifiLon: data.lon + '',
          wifiAccuracy: data.accuracy + '',
          wifiCoordTs: data.ts,
        }
      );

      return {
        ...state,
        objects: objects,
        positionVer: ver,
      };
    }
    case ControlActionTypes.new_object_voltage: {
      const objects = composeNewObjectState(state, data.oid, {
        voltage: data.voltage,
        ts: data.ts,
      });

      return {
        ...state,
        objects: objects,
      };
    }
    case ControlActionTypes.object_property_value_updated: {
      const props = {};
      props[data.property] = data.value;
      return {
        ...state,
        objects: composeNewObjectState(state, data.oid, {}, {}, props),
      };
    }
    case ControlActionTypes.object_state_value_updated: {
      const states = {};
      console.log('upd: ' + data.oid + ' ' + data.state + ' = ' + data.value);
      states[data.state] = data.value;
      return {
        ...state,
        objects: composeNewObjectState(state, data.oid, {}, states),
      };
    }
    case ControlActionTypes.add_phone_tracker: {
      const { ticket, result } = data;
      if (0 !== result) {
        return state;
      }
      return {
        ...state,
        addPhoneCode: ticket,
      };
    }
    case ControlActionTypes.stop_add_phone_tracker: {
      return {
        ...state,
        addPhoneCode: null,
        phoneLinked: false,
      };
    }
    case ControlActionTypes.phone_tracker_linked: {
      const { object } = data;
      var objects = { ...state.objects };
      objects[object.oid + ''] = object;
      console.log(' =========== linked oid = ', object.oid, object.name);
      return {
        ...state,
        phoneLinked: true,
        addPhoneCode: null,
        linkedOid: object.oid,
        activeOid: object.oid,
        objects,
      };
    }
    case ControlActionTypes.invitation_accepted: {
      const { friendCount } = data;
      const { dispatch } = payload;
      setTimeout(() => {
        dispatch(authActionCreators.setFriendCount(friendCount));
      }, 100);
      break;
    }
    case ActionTypes.SET_NAVIGATE_OID_FIRST_TIME: {
      const { navigate } = payload;
      return {
        ...state,
        navigateOidFirstTime: navigate,
      };
    }
    case ActionTypes.SET_MAP_LAYER: {
      const { index } = payload;
      return {
        ...state,
        mapLayer: index,
      };
    }
    case ActionTypes.SET_ACTIVE_OID: {
      const { oid, force } = payload;
      console.log('set active oid: ' + oid + ', force: ' + force);
      if (force) {
        setTimeout(async () => {
          await UserPrefs.setOid(oid);
        }, 0);
        return {
          ...state,
          activeOid: oid,
        };
      }

      const { objects } = state;
      for (var i in objects) {
        const o = objects[i];
        if (oid === o.oid) {
          setTimeout(async () => {
            await UserPrefs.setOid(oid);
          }, 0);
          return {
            ...state,
            activeOid: oid,
          };
        }
      }
      return state;
    }
    case ActionTypes.SET_OSS_TOKEN: {
      const { ossToken, ossButtonImageUrl } = payload;
      return {
        ...state,
        ossToken,
        ossButtonImageUrl,
      };
    }
    case ActionTypes.SET_ONLINE_LISTENING_STATUS: {
      const { status } = payload;
      return {
        ...state,
        onlineListeningStatus: status,
      };
    }

    case ActionTypes.SET_PRODUCTS_RUSSIA: {
      const { productsRussia } = payload;
      return {
        ...state,
        productsRussia,
      };
    };

    case ActionTypes.SET_YOOKASSA_SUBSCRIPTIONS: {
      const { YooKassaSubscriptions } = payload;
      return {
        ...state,
        YooKassaSubscriptions,
      };
    };

    case ActionTypes.SET_SUBSCRIPTION_INFO_PACKET: {
      const { subscriptionInfoPacket } = action.payload;

      return {
        ...state,
        subscriptionInfoPacket,
      };
    };

    case ActionTypes.SET_IAP_ITEMS_ERROR: {
      const { iapItemsError } = action.payload;

      return {
        ...state,
        iapItemsError,
      };
    };

    case ActionTypes.SET_IS_YOOKASSA_SUBSCRIPTION_EXISTS: {
      const { isYooKassaSubscriptionExists } = action.payload;

      return {
        ...state,
        isYooKassaSubscriptionExists,
      };
    };

    case ActionTypes.SET_HAND_TAP_ANIMATION_VISIBLE: {
      const { isHandTapAnimationVisible } = action.payload;

      return {
        ...state,
        isHandTapAnimationVisible,
      };
    };

    case ActionTypes.SET_TAB_BAR_HISTORY: {
      const { tabBarHistory } = action.payload;

      return {
        ...state,
        tabBarHistory,
      };
    };

    case ActionTypes.GET_OBJECT_MAP: {
      const { objects } = action.payload
      if (!objects) {
        return {
          ...state,
          objectsLoaded: false,
          placesLoaded: false,
        };
      }

      const { activeOid } = state;
      console.log('obj map, oid: ' + activeOid);

      let oid = null;

      // check for oid presense
      if (activeOid) {
        for (var i in objects) {
          const o = objects[i];
          if (activeOid === o.oid) {
            oid = activeOid;
            console.log('activeOid present in list');
            break;
          }
        }
      }

      if (!oid) {
        console.log('activeOid NOT present in list');
        // active oid not in list, pick first one
        for (var i in objects) {
          const o = objects[i];
          console.log('picked activeOid: ' + o.oid);
          oid = o.oid;
          break;
        }
      }

      if (Object.keys(objects).length > 0) {
        UserPrefs.setFirstChildConnected(true);
      }

      return {
        ...state,
        objects: objects,
        activeOid: oid,
        objectsLoaded: true,
        navigateOidFirstTime: !!oid,
      };
    };
  }

  return state;
};

function composeNewObjectState(state, _oid, data, states, props) {
  const oid = _oid + '';
  var obj = { ...state.objects[oid], ...data };
  if (!obj.states) {
    obj.states = {};
  }
  if (states) {
    obj.states = { ...obj.states, ...states };
  }

  if (!obj.props) {
    obj.props = {};
  }
  if (props) {
    obj.props = { ...obj.props, ...props };
  }
  var objects = { ...state.objects };
  objects[oid] = obj;
  return objects;
}
