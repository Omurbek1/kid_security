import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsername, getPassword, getLanguage } from './UserPrefs';
import * as Utils from './Utils';
import Const from './Const';

class API {
  username = '';
  password = '';
  baseHeader = null;
  language = '';
  devHost = '';

  constructor() {
    this.initialize();
  };

  initialize() {
    Promise.all([getUsername(), getPassword(), getLanguage()]).then((data) => {
      this.username = data[0];
      this.password = data[1];
      this.language = data[2];
      this.baseHeader = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        Username: this.username,
        Password: this.password,
      };
    });
  };

  oldBaseClient(endpoint: string, customConfig: any) {
    const config = {
      method: 'POST',
      headers: { ...this.baseHeader },
      ...customConfig,
    };

    return fetch(`${Utils.getApiParentUrl()}${endpoint}/`, config).then(async (response) => {
      const data = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        return Promise.reject(data);
      };
    });
  };

  newBaseClient(endpoint: string, customConfig?: any) {
    const config = {
      method: 'POST',
      headers: { ...this.baseHeader },
      ...customConfig,
    };

    return fetch(`${Utils.getApiCommonUrl()}${endpoint}/`, config)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok && data.success) {
          return data;
        } else {
          return Promise.reject(data);
        };
      })
      .catch((e) => console.log(`Error child code request [${endpoint}]`, e, config));
  };

  getChildCode = () => {
    const body = JSON.stringify({
      oldFormat: true,
    });

    return this.newBaseClient('emit_parent_code', { body });
  };

  checkChildCode = (data: number) => {
    const body = JSON.stringify({
      code: `${data}`,
    });

    return this.newBaseClient('parent_code_status', { body });
  };

  fetchCounters = (oid: number) => {
    const body = JSON.stringify({
      oid,
      locale: this.language,
    });

    return this.oldBaseClient('counters', { body });
  };

  fetchUnconfirmedParentTasks = (oid: number) => {
    const body = JSON.stringify({
      oid,
      locale: this.language,
    });

    return this.oldBaseClient('unconfirmed_parent_task_list', { body });
  };

  fetchUnconfirmedTasks = (oid: number) => {
    const body = JSON.stringify({
      oid,
      locale: this.language,
    });

    return this.oldBaseClient('unconfirmed_task_list', { body });
  };

  addNewUnconfirmedParentTask = (oid: number, name: string, reward: number) => {
    const body = JSON.stringify({
      oid,
      name,
      reward,
      locale: this.language,
    });

    return this.oldBaseClient('new_task', { body });
  };

  cancelUnconfirmedParentTask = (taskId: number) => {
    const body = JSON.stringify({
      taskId,
      locale: this.language,
    });

    return this.oldBaseClient('delete_task', { body });
  };

  fetchConfirmedTasks = (oid: number, limit: number = 50) => {
    const body = JSON.stringify({
      oid,
      limit,
      locale: this.language,
    });

    return this.oldBaseClient('confirmed_task_list', { body });
  };

  confirmChildTask = (finishedTaskId: number, praiseComment?: string, reward?: number) => {
    const body = JSON.stringify({
      finishedTaskId,
      praiseComment: praiseComment || '',
      reward,
      locale: this.language,
    });

    return this.oldBaseClient('confirm_task', { body });
  };

  declineChildTask = (finishedTaskId: number) => {
    const body = JSON.stringify({
      finishedTaskId,
      locale: this.language,
    });

    return this.oldBaseClient('decline_task', { body });
  };

  fetchChildDreams = (oid: number) => {
    const body = JSON.stringify({
      oid,
      locale: this.language,
    });

    return this.oldBaseClient('daydream_list', { body });
  };

  confirmChildDream = (daydreamId: number, price: number) => {
    const body = JSON.stringify({
      daydreamId,
      price,
      locale: this.language,
    });

    return this.oldBaseClient('confirm_daydream', { body });
  };

  declineChildDream = (daydreamId: number) => {
    const body = JSON.stringify({
      daydreamId,
      locale: this.language,
    });

    return this.oldBaseClient('decline_daydream', { body });
  };

  fulfillChildDream = (daydreamId: number) => {
    const body = JSON.stringify({
      daydreamId,
      locale: this.language,
    });

    return this.oldBaseClient('fulfill_daydream', { body });
  };

  getMessengersList = (oid: number) => {
    const body = JSON.stringify({
      oid,
    });

    return this.newBaseClient('get_chat_messengers/json', { body });
  };

  getMessengerChats = (oid: number, messengerId: number) => {
    const body = JSON.stringify({
      oid,
      messengerId,
    });

    return this.newBaseClient('get_messenger_rooms/json', { body });
  };

  getMessagesOfChat = (roomId: number, limit?: number, baseTs?: number) => {
    const body = JSON.stringify({
      roomId,
      limit,
      baseTs,
    });

    return this.newBaseClient('get_room_messages/json', { body });
  };

  buyWithYooKassa = (productId: string, phoneNumber: string, email: string) => {
    const body = JSON.stringify({
      method: 'POST',
      productId,
      phoneNumber,
      email,
    });

    return this.newBaseClient('yoo_checkout', { body });
  };

  getYooKassaPaymentStatus = (orderId: string) => {
    const body = JSON.stringify({
      method: 'POST',
      orderId,
    });

    return this.newBaseClient('yoo_payment_status', { body });
  };

  getProductsRussia = () => {
    return this.newBaseClient('get_products_rf');
  };

  getYooKassaSubscriptions = () => {
    return this.newBaseClient('yoo_get_subscriptions');
  };

  getVerifiedPhoneNumbers = () => {
    return this.newBaseClient('callisto_get_verified_phone_numbers/');
  };

  startPhoneNumberVerification = (phoneNumber: string) => {
    const body = JSON.stringify({
      phoneNumber,
    });

    return this.newBaseClient('callisto_start_phone_number_verification/', { body });
  };

  finishPhoneNumberVerification = (phoneNumber: string, pinCode: string) => {
    const body = JSON.stringify({
      phoneNumber,
      pinCode,
    });

    return this.newBaseClient('callisto_finish_phone_number_verification/', { body });
  };

  buyWithCallisto = (phoneNumber: string, productId: string) => {
    const body = JSON.stringify({
      phoneNumber,
      productId,
    });

    return this.newBaseClient('callisto_buy/', { body });
  };

  getCallistoPaymentStatus = (orderId: string) => {
    const body = JSON.stringify({
      orderId,
    });

    return this.newBaseClient('callisto_payment_status/', { body });
  };

  refreshCallistoPaymentStatus = (orderId: string) => {
    const body = JSON.stringify({
      orderId,
    });

    return this.newBaseClient('callisto_refresh_status/', { body });
  };

  getMobileOperators = (caseUsage: string) => {
    const body = JSON.stringify({
      caseUsage,
    });

    return this.newBaseClient('get_mobile_operators/', { body })
  };

  getAppStats = async (bundle: string, userLanguage: string) => {
    const config = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    return await fetch(`${Utils.getAppStatsUrl()}?bundle=${bundle}&android=1&lang=${userLanguage}`, config)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          return data;
        } else {
          return Promise.reject(data);
        };
      })
      .catch(err => console.log('Error getting app statistics', err));
  };

  createIFreeSubscription = (phoneNumber: string) => {
    const body = JSON.stringify({
      phoneNumber,
    });

    return this.newBaseClient('ifree_create_subscription/json', { body });
  };

  approveIFreeSubscription = (phoneNumber: string, pinCode: string) => {
    const body = JSON.stringify({
      phoneNumber,
      pinCode,
    });

    return this.newBaseClient('ifree_approve_subscription/json', { body });
  };

  cancelIFreeSubscription = (phoneNumber: string) => {
    const body = JSON.stringify({
      phoneNumber,
    });

    return this.newBaseClient('ifree_cancel_subscription/json', { body });
  };

  getIFreeSubscriptionStatus = (phoneNumber: string) => {
    const body = JSON.stringify({
      phoneNumber,
    });

    return this.newBaseClient('ifree_status_subscription/json', { body });
  };

  deleteAccount = () => {
    return this.newBaseClient('disable_user/');
  };

  saveParentFormData = async (body: {}) => {
    const config = {
      method: 'POST',
      headers: { ...this.baseHeader },
      body: JSON.stringify(body),
    };

    return await fetch(`${Const.API_BASE_URL}api/form/store`, config)
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          await AsyncStorage.removeItem('PARENT_FORM_DATA');
          return data;
        } else {
          await AsyncStorage.setItem('PARENT_FORM_DATA', JSON.stringify(body));
          return Promise.reject(data);
        };
      })
      .catch(async (err) => {
        console.log("Error saving parent's form data", err);
        await AsyncStorage.setItem('PARENT_FORM_DATA', JSON.stringify(body));
      });
  };
};

export const APIService = new API();
export default API;
