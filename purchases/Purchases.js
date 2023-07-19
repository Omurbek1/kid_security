import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';
import analytics from '@react-native-firebase/analytics';

import UserPrefs from '../UserPrefs';
import Rest from '../Rest';
import { waitForConnection } from '../Helper';
import { firebaseAnalitycsForBuyPurchases } from '../analytics/firebase/firebase';
import { L } from '@lang';

import * as Metrica from '../analytics/Analytics';

const ios = Platform.OS === 'ios';

const OVERRIDE_PREMIUM = false;
const FAKE = OVERRIDE_PREMIUM;

const MONTHLY_PREMIUM_ANDROID = 'kz.sirius.siriuskids.sub_month';
const MONTHLY_PREMIUM_ANDROID_WITH_DEMO = 'kz.sirius.siriuskids.sub_month_with_demo';
const YEARLY_PREMIUM_ANDROID_WITH_DEMO = 'kz.sirius.siriuskids.sub_year_with_demo';
const THREEMONTHLY_PREMIUM_ANDROID_WITH_DEMO = 'kz.sirius.siriuskids.sub_three_months_with_demo';
const SIXMONTHLY_PREMIUM_ANDROID = 'kz.sirius.siriuskids.sub_six_months';
const YEARLY_PREMIUM_ANDROID = 'kz.sirius.siriuskids.sub_year';
const FOREVER_PREMIUM_ANDROID = 'kz.sirius.siriuskids.premium_forever';
const FOREVER_PREMIUM_DISCOUNT_ANDROID = 'kz.sirius.siriuskids.premium_forever_discount';
const MONTHLY_LIVE_WIRE_ANDROID = 'kz.sirius.siriuskids.sub_live_wire';
const MIN_30_LIVE_WIRE_ANDROID = 'kz.sirius.siriuskids.live_30';
const MIN_180_LIVE_WIRE_ANDROID = 'kz.sirius.siriuskids.live_180';
const SUB_LIVE_WIRE_PROMO_ANDROID = 'kz.sirius.siriuskids.sub_live_wire_promo';
const MONTHLY_VOICE_PREMIUM_ANDROID = 'kz.sirius.siriuskids.sub.premium_live_month';

const MONTHLY_PREMIUM_IOS = 'kz.sirius.siriuskids.sub_month_alt';
const MONTHLY_PREMIUM_IOS_WITH_DEMO = 'kz.sirius.siriuskids.sub_month_with_demo';
const YEARLY_PREMIUM_IOS_WITH_DEMO = 'kz.sirius.siriuskids.sub_year_with_demo';
const THREEMONTHLY_PREMIUM_IOS_WITH_DEMO = 'kz.sirius.siriuskids.sub_three_months_with_demo';
const SIXMONTHLY_PREMIUM_IOS = 'kz.sirius.siriuskids.sub_six_months';
const YEARLY_PREMIUM_IOS = 'kz.sirius.siriuskids.sub_year';
const FOREVER_PREMIUM_IOS = 'kz.sirius.siriuskids.premium_forever';
const FOREVER_PREMIUM_DISCOUNT_IOS = 'kz.sirius.siriuskids.premium_forever_discount';
const MONTHLY_LIVE_WIRE_IOS = 'kz.sirius.siriuskids.sub_live_wire';
const MIN_30_LIVE_WIRE_IOS = 'kz.sirius.siriuskids.live_30';
const MIN_180_LIVE_WIRE_IOS = 'kz.sirius.siriuskids.live_180';
const SUB_LIVE_WIRE_PROMO_IOS = 'kz.sirius.siriuskids.sub_live_wire_promo';
const MONTHLY_VOICE_PREMIUM_IOS = 'kz.sirius.siriuskids.sub.premium_live_month';

let INITIALIZED = false;
let INITIALIZING = false;

const itemSkus = Platform.select({
  ios: [
    MONTHLY_PREMIUM_IOS,
    SIXMONTHLY_PREMIUM_IOS,
    YEARLY_PREMIUM_IOS,
    MONTHLY_PREMIUM_IOS_WITH_DEMO,
    FOREVER_PREMIUM_IOS,
    MONTHLY_LIVE_WIRE_IOS,
    MIN_30_LIVE_WIRE_IOS,
    MIN_180_LIVE_WIRE_IOS,
    YEARLY_PREMIUM_IOS_WITH_DEMO,
    THREEMONTHLY_PREMIUM_IOS_WITH_DEMO,
    SUB_LIVE_WIRE_PROMO_IOS,
    FOREVER_PREMIUM_DISCOUNT_IOS,
    MONTHLY_VOICE_PREMIUM_IOS,
  ],
  android: [
    MONTHLY_PREMIUM_ANDROID,
    SIXMONTHLY_PREMIUM_ANDROID,
    YEARLY_PREMIUM_ANDROID,
    MONTHLY_PREMIUM_ANDROID_WITH_DEMO,
    FOREVER_PREMIUM_ANDROID,
    MONTHLY_LIVE_WIRE_ANDROID,
    MIN_30_LIVE_WIRE_ANDROID,
    MIN_180_LIVE_WIRE_ANDROID,
    YEARLY_PREMIUM_ANDROID_WITH_DEMO,
    THREEMONTHLY_PREMIUM_ANDROID_WITH_DEMO,
    SUB_LIVE_WIRE_PROMO_ANDROID,
    FOREVER_PREMIUM_DISCOUNT_ANDROID,
    MONTHLY_VOICE_PREMIUM_ANDROID,
  ],
});

export const MONTHLY_PREMIUM = itemSkus[0];
export const SIXMONTHLY_PREMIUM = itemSkus[1];
export const YEARLY_PREMIUM = itemSkus[2];
export const MONTHLY_PREMIUM_WITH_DEMO = itemSkus[3];
export const FOREVER_PREMIUM = itemSkus[4];
export const MONTHLY_LIVE_WIRE = itemSkus[5];
export const MIN_30_LIVE_WIRE = itemSkus[6];
export const MIN_180_LIVE_WIRE = itemSkus[7];
export const YEARLY_PREMIUM_WITH_DEMO = itemSkus[8];
export const THREEMONTHLY_PREMIUM_WITH_DEMO = itemSkus[9];
export const SUB_LIVE_WIRE_PROMO = itemSkus[10];
export const FOREVER_PREMIUM_DISCOUNT = itemSkus[11];
export const MONTHLY_AND_VOICE = itemSkus[12];

export let MONTHLY_PREMIUM_PRODUCT = null;
export let SIXMONTHLY_PREMIUM_PRODUCT = null;
export let YEARLY_PREMIUM_PRODUCT = null;
export let YEARLY_PREMIUM_WITH_DEMO_PRODUCT = null;
export let MONTHLY_PREMIUM_WITH_DEMO_PRODUCT = null;
export let FOREVER_PREMIUM_PRODUCT = null;
export let FOREVER_PREMIUM_DISCOUNT_PRODUCT = null;
export let MONTHLY_LIVE_WIRE_PRODUCT = null;
export let MIN_30_LIVE_WIRE_PRODUCT = null;
export let MIN_180_LIVE_WIRE_PRODUCT = null;
export let THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT = null;
export let SUB_LIVE_WIRE_PROMO_PRODUCT = null;
export let MONTHLY_AND_VOICE_PRODUCT = null;

export let MY_PURCHASES = null;
export let MY_PRODUCTS = null;
let PREMIUM_PURCHASED = false;
let WIRE_PURCHASED = false;
let IAP_READY = false;
let TRIAL_EXPIRED_HINT = true;

export function isReady() {
  return IAP_READY;
}

export function setTrialExpiredHint(expired) {
  TRIAL_EXPIRED_HINT = expired;
}

export function isPremiumPurchased() {
  return PREMIUM_PURCHASED;
}

export function isWirePurchased() {
  return WIRE_PURCHASED;
}

let _storeSubscriptionInfo = null;
let _setPremiumValid = null;
let _setPrices = null;
let _setProductIds = null;
let _setIAPReady = null;
let _context = null;
let _setProducts = null;
let _setSubscriptionInfoPacket = null;
let _setIAPItemsError = null;
let _setIsYooKassaSubscriptionExists = null;
let _showAlert = null;

export async function reinit() {
  if (FAKE) {
    return;
  }
  if (INITIALIZED || INITIALIZING) {
    return;
  }
  INITIALIZING = true;

  let result = false;
  try {
    console.log('RNIap: REINIT');
    await RNIap.endConnection();
    result = await RNIap.initConnection();
    console.log('RNIap: result', result);
    console.log('RNIap: ', Rest.get().debug);

    const products = await getItems();
    //console.log('THESE ARE RNIP PRODUCTS !!!!====', products, MONTHLY_PREMIUM_PRODUCT);
    if (
      _setPrices &&
      FOREVER_PREMIUM_PRODUCT &&
      YEARLY_PREMIUM_PRODUCT &&
      SIXMONTHLY_PREMIUM_PRODUCT &&
      MONTHLY_PREMIUM_PRODUCT
    ) {
      _setPrices(
        YEARLY_PREMIUM_PRODUCT.localizedPrice,
        SIXMONTHLY_PREMIUM_PRODUCT.localizedPrice,
        MONTHLY_PREMIUM_PRODUCT.localizedPrice,
        FOREVER_PREMIUM_PRODUCT ? FOREVER_PREMIUM_PRODUCT.localizedPrice : null,
        MONTHLY_LIVE_WIRE_PRODUCT ? MONTHLY_LIVE_WIRE_PRODUCT.localizedPrice : null,
        MIN_30_LIVE_WIRE_PRODUCT ? MIN_30_LIVE_WIRE_PRODUCT.localizedPrice : null,
        MIN_180_LIVE_WIRE_PRODUCT ? MIN_180_LIVE_WIRE_PRODUCT.localizedPrice : null,
        YEARLY_PREMIUM_WITH_DEMO_PRODUCT ? YEARLY_PREMIUM_WITH_DEMO_PRODUCT.localizedPrice : null,
        THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT ? THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.localizedPrice : null,
        SUB_LIVE_WIRE_PROMO_PRODUCT ? SUB_LIVE_WIRE_PROMO_PRODUCT.localizedPrice : null,
        FOREVER_PREMIUM_DISCOUNT_PRODUCT ? FOREVER_PREMIUM_DISCOUNT_PRODUCT.localizedPrice : null,
        MONTHLY_AND_VOICE_PRODUCT ? MONTHLY_AND_VOICE_PRODUCT.localizedPrice : null
      );
    }

    if (
      _setProductIds &&
      FOREVER_PREMIUM_PRODUCT &&
      YEARLY_PREMIUM_PRODUCT &&
      SIXMONTHLY_PREMIUM_PRODUCT &&
      MONTHLY_PREMIUM_PRODUCT
    ) {
      _setProductIds(
        YEARLY_PREMIUM_PRODUCT.productId,
        SIXMONTHLY_PREMIUM_PRODUCT.productId,
        MONTHLY_PREMIUM_PRODUCT.productId,
        FOREVER_PREMIUM_PRODUCT ? FOREVER_PREMIUM_PRODUCT.productId : null,
        MONTHLY_LIVE_WIRE_PRODUCT ? MONTHLY_LIVE_WIRE_PRODUCT.productId : null,
        MIN_30_LIVE_WIRE_PRODUCT ? MIN_30_LIVE_WIRE_PRODUCT.productId : null,
        MIN_180_LIVE_WIRE_PRODUCT ? MIN_180_LIVE_WIRE_PRODUCT.productId : null,
        YEARLY_PREMIUM_WITH_DEMO_PRODUCT ? YEARLY_PREMIUM_WITH_DEMO_PRODUCT.productId : null,
        THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT ? THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId : null,
        SUB_LIVE_WIRE_PROMO_PRODUCT ? SUB_LIVE_WIRE_PROMO_PRODUCT.productId : null,
        FOREVER_PREMIUM_DISCOUNT_PRODUCT ? FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId : null,
        MONTHLY_AND_VOICE_PRODUCT ? MONTHLY_AND_VOICE_PRODUCT.productId : null
      );
    }

    if (_setProducts) {
      _setProducts(products);
    }

    const purchaseResult = await checkPremiumPurchased(_context);
    PREMIUM_PURCHASED = purchaseResult.PREMIUM_PURCHASED;
    WIRE_PURCHASED = purchaseResult.WIRE_PURCHASED;
    _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, null);

    INITIALIZED = true;
    IAP_READY = result;
  } catch (err) {
    IAP_READY = false;
    const country = await UserPrefs.getUserLocationCountry();

    if (err && err.code) {
      console.warn(err.code, err.message);

      if (_setIAPItemsError) {
        _setIAPItemsError(true);
      }

      Metrica.event('iap_error', { error: `${err.code} ${err.message}`, country });
      Rest.get().debug({ RNIap_error: err, reinit: true });
    }
  }
  console.log('RNIap: ready: ' + result);
  if (_setIAPReady) _setIAPReady(IAP_READY);
  INITIALIZING = false;
}

export async function init(
  context,
  setPremiumValid,
  setPrices,
  setProductIds,
  storeSubscriptionInfo,
  setIAPReady,
  setProducts,
  setSubscriptionInfoPacket,
  setIAPItemsError,
  setIsYooKassaSubscriptionExists,
  showAlert
) {
  _setPremiumValid = setPremiumValid;
  _setPrices = setPrices;
  _setProductIds = setProductIds;
  _storeSubscriptionInfo = storeSubscriptionInfo;
  _setIAPReady = setIAPReady;
  _setProducts = setProducts;
  _setSubscriptionInfoPacket = setSubscriptionInfoPacket;
  _setIAPItemsError = setIAPItemsError;
  _setIsYooKassaSubscriptionExists = setIsYooKassaSubscriptionExists;
  _showAlert = showAlert;
  _context = context;

  if (INITIALIZING) {
    return;
  }

  let result = false;
  try {
    if (FAKE) {
      return;
    }
    console.log('RNIap: INIT');
    INITIALIZING = true;
    PREMIUM_PURCHASED = await UserPrefs.getCachedPremiumPurchased();
    console.log(' === PREM: check purchased from cache: ' + PREMIUM_PURCHASED);
    Rest.get().debug({ PREM_cached_purchase: PREMIUM_PURCHASED });
    await RNIap.endConnection();
    result = await RNIap.initConnection();
    console.log('RNIap: result', result);

    const products = await getItems();
    if (_setPrices && YEARLY_PREMIUM_PRODUCT && SIXMONTHLY_PREMIUM_PRODUCT && MONTHLY_PREMIUM_PRODUCT) {
      _setPrices(
        YEARLY_PREMIUM_PRODUCT.localizedPrice,
        SIXMONTHLY_PREMIUM_PRODUCT.localizedPrice,
        MONTHLY_PREMIUM_PRODUCT.localizedPrice,
        FOREVER_PREMIUM_PRODUCT ? FOREVER_PREMIUM_PRODUCT.localizedPrice : null,
        MONTHLY_LIVE_WIRE_PRODUCT ? MONTHLY_LIVE_WIRE_PRODUCT.localizedPrice : null,
        MIN_30_LIVE_WIRE_PRODUCT ? MIN_30_LIVE_WIRE_PRODUCT.localizedPrice : null,
        MIN_180_LIVE_WIRE_PRODUCT ? MIN_180_LIVE_WIRE_PRODUCT.localizedPrice : null,
        YEARLY_PREMIUM_WITH_DEMO_PRODUCT ? YEARLY_PREMIUM_WITH_DEMO_PRODUCT.localizedPrice : null,
        THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT ? THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.localizedPrice : null,
        SUB_LIVE_WIRE_PROMO_PRODUCT ? SUB_LIVE_WIRE_PROMO_PRODUCT.localizedPrice : null,
        FOREVER_PREMIUM_DISCOUNT_PRODUCT ? FOREVER_PREMIUM_DISCOUNT_PRODUCT.localizedPrice : null,
        MONTHLY_AND_VOICE_PRODUCT ? MONTHLY_AND_VOICE_PRODUCT.localizedPrice : null
      );
    }

    if (_setProductIds && YEARLY_PREMIUM_PRODUCT && SIXMONTHLY_PREMIUM_PRODUCT && MONTHLY_PREMIUM_PRODUCT) {
      _setProductIds(
        YEARLY_PREMIUM_PRODUCT.productId,
        SIXMONTHLY_PREMIUM_PRODUCT.productId,
        MONTHLY_PREMIUM_PRODUCT.productId,
        FOREVER_PREMIUM_PRODUCT ? FOREVER_PREMIUM_PRODUCT.productId : null,
        MONTHLY_LIVE_WIRE_PRODUCT ? MONTHLY_LIVE_WIRE_PRODUCT.productId : null,
        MIN_30_LIVE_WIRE_PRODUCT ? MIN_30_LIVE_WIRE_PRODUCT.productId : null,
        MIN_180_LIVE_WIRE_PRODUCT ? MIN_180_LIVE_WIRE_PRODUCT.productId : null,
        YEARLY_PREMIUM_WITH_DEMO_PRODUCT ? YEARLY_PREMIUM_WITH_DEMO_PRODUCT.productId : null,
        THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT ? THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId : null,
        SUB_LIVE_WIRE_PROMO_PRODUCT ? SUB_LIVE_WIRE_PROMO_PRODUCT.productId : null,
        FOREVER_PREMIUM_DISCOUNT_PRODUCT ? FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId : null,
        MONTHLY_AND_VOICE_PRODUCT ? MONTHLY_AND_VOICE_PRODUCT.productId : null
      );
    }

    if (_setProducts) {
      _setProducts(products);
    }

    const purchaseResult = await checkPremiumPurchased(_context);
    PREMIUM_PURCHASED = purchaseResult.PREMIUM_PURCHASED;
    WIRE_PURCHASED = purchaseResult.WIRE_PURCHASED;
    _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, null);

    INITIALIZED = true;
    IAP_READY = result;
  } catch (err) {
    IAP_READY = false;
    const country = await UserPrefs.getUserLocationCountry();

    await checkPremiumPurchasedYooKassa();

    if (err && err.code) {
      console.warn(err.code, err.message);

      if (_setIAPItemsError) {
        _setIAPItemsError(true);
      }

      Metrica.event('iap_error', { error: `${err.code} ${err.message}`, country });
      Rest.get().debug({ RNIap_error: err });
    }
  }
  console.log('RNIap: ready: ' + result);
  if (_setIAPReady) _setIAPReady(IAP_READY);
  INITIALIZING = false;
  return IAP_READY;
}

const requestPurchase = async (sku) => {
  try {
    return RNIap.requestPurchase(sku, false);
  } catch (err) {
    console.warn(err.code, err.message);
  }
};
const requestSubscription = async (sku) => {
  try {
    return RNIap.requestSubscription(sku, false);
  } catch (err) {
    _showAlert(true, L('error'), err.message);
  }
};

export async function tryConsumeProducts(callback) {
  console.log('RNIap: CONSUME: load purchases...');
  let purchases = [];
  if (ios) {
    const iaps = [await UserPrefs.getPurchase_30Minutes(), await UserPrefs.getPurchase_180Minutes()];
    for (let i in iaps) {
      const iap = iaps[i];
      if (iap === '') {
        continue;
      }
      try {
        purchases.push(JSON.parse(iap));
      } catch (e) {
        console.log(e);
      }
    }
  } else {
    purchases = await RNIap.getAvailablePurchases();
  }
  //console.log('getAvailablePurchases', purchases);
  console.log('RNIap: CONSUME: purchases loaded: ' + purchases.length);
  purchases.forEach(async (purchase) => {
    //console.log(purchase);
    if (!purchase.isAcknowledgedAndroid) {
      if (await callback(purchase)) {
        // do not consume "premium forever"
        if (
          (FOREVER_PREMIUM_PRODUCT && FOREVER_PREMIUM_PRODUCT.productId === purchase.productId) ||
          (FOREVER_PREMIUM_DISCOUNT_PRODUCT && FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId === purchase.productId)
        ) {
          // MANUAL REVOKE: await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
          try {
            await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
            await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          } catch (error) {
            console.warn('foreverPremium', error);
          }
          firebaseAnalitycsForBuyPurchases(purchase);
        } else {
          try {
            // need to clear from purchases list: Ilia 17.02.2021
            await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
            await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
          } catch (e) {
            console.warn(e);
          }
          await RNIap.finishTransaction(purchase);
        }
      }
    }
  });
  console.log('RNIap: CONSUME: purchases checked: ' + purchases.length);
}

export async function checkPremiumPurchased(context, awaitConnection) {
  let result = await checkPremiumPurchasedInternal(context, awaitConnection, false);
  if (!result && ios) {
    result = await checkPremiumPurchasedInternal(context, awaitConnection, true);
  }
  return result;
}

export async function checkPremiumPurchasedInternal(context, awaitConnection, secondChance) {
  if (OVERRIDE_PREMIUM) {
    PREMIUM_PURCHASED = true;
    return true;
  }

  if (FAKE) {
    return false;
  }

  const cached = await UserPrefs.getCachedPremiumPurchased();
  const wireCached = await UserPrefs.getCachedWirePurchased();

  Rest.get().debug({ PREM_cached_purchase: cached, WIRE_cached_purchase: wireCached, secondChance });

  try {
    console.log('RNIap: load purchases...');
    const purchases = await RNIap.getAvailablePurchases();
    console.log('RNIap: purchases loaded: ' + purchases.length);

    // DEPRECATED: strip ios transactionReceipt
    /*for (let i = 1; i < purchases.length; i++) {
      if (purchases[i].transactionReceipt) {
        purchases[i].transactionReceipt = '';
      }
    }*/

    MY_PURCHASES = purchases;
    //console.log('available purchases: ', purchases);
    if (awaitConnection) {
      // if new purchase
      PREMIUM_PURCHASED = false;
      let premiumForever = false;
      for (let i in purchases) {
        const p = purchases[i];
        if (MONTHLY_PREMIUM_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: monthly');
          PREMIUM_PURCHASED = true;
        } else if (SIXMONTHLY_PREMIUM_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: halfyearly');
          PREMIUM_PURCHASED = true;
        } else if (MONTHLY_AND_VOICE_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: halfyearly');
          PREMIUM_PURCHASED = true;
        } else if (YEARLY_PREMIUM_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: yearly');
          PREMIUM_PURCHASED = true;
        } else if (MONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: trial monthly');
          PREMIUM_PURCHASED = true;
        } else if (YEARLY_PREMIUM_WITH_DEMO_PRODUCT && YEARLY_PREMIUM_WITH_DEMO_PRODUCT.productId === p.productId) {
          //console.log(' === PREM: trial yearly');
          PREMIUM_PURCHASED = true;
        } else if (
          THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT &&
          THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId === p.productId
        ) {
          console.log(' === PREM: trial three month');
          PREMIUM_PURCHASED = true;
        } else if (
          (FOREVER_PREMIUM_PRODUCT && FOREVER_PREMIUM_PRODUCT.productId === p.productId) ||
          (FOREVER_PREMIUM_DISCOUNT_PRODUCT && FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId === p.productId)
        ) {
          // TODO: fixme bug ^^^^^^^^^^^^ здесь отвал
          //console.log(' === PREM: forever');
          PREMIUM_PURCHASED = true;
          premiumForever = true;
        }
      }
      Rest.get().debug({ PREM_fresh_purchase: true, forever: premiumForever });
    } else {
      // if common check
      PREMIUM_PURCHASED = cached;
    }

    const prods = {
      MY_PURCHASES: MY_PURCHASES != null,
      MY_PRODUCTS: MY_PRODUCTS != null,
      MY_PURCHASES_count: MY_PURCHASES ? MY_PURCHASES.length : 0,
      MY_PRODUCTS_count: MY_PRODUCTS ? MY_PRODUCTS.length : 0,
    };
    Rest.get().debug(prods);

    if (_storeSubscriptionInfo && MY_PURCHASES && MY_PRODUCTS) {
      let promise = new Promise(async function (resolve, reject) {
        try {
          const ts = new Date().getTime();
          console.log('RNIap: waiting for connection...');
          await waitForConnection(60);
          const ms = new Date().getTime() - ts;
          console.log('RNIap: got connection in ' + ms + 'ms');
          Rest.get().debug({ PREM_connection: ms + 'ms' });
        } catch (e) {
          console.warn('RNIap: failed to get connection', e);
          Rest.get().debug({ PREM_connection: 'timeout' });
        }

        _storeSubscriptionInfo(MY_PURCHASES, MY_PRODUCTS, !ios, async function (ps, packet) {
          let purchased = false;
          let wirePurchased = false;
          if (packet && packet.data && packet.data.validated) {
            if (_setSubscriptionInfoPacket) {
              _setSubscriptionInfoPacket(packet);
            }

            if (_setIsYooKassaSubscriptionExists) {
              const yooKassaSubscriptions = packet.data.yoo;

              if (yooKassaSubscriptions) {
                for (let i in yooKassaSubscriptions) {
                  const isSubscription =
                    i === MONTHLY_AND_VOICE || i === MONTHLY_LIVE_WIRE || i === MONTHLY_PREMIUM_ANDROID;

                  if (isSubscription && yooKassaSubscriptions[i]) {
                    _setIsYooKassaSubscriptionExists(true);
                    break;
                  }
                }
              }
            }

            // validate premium through backend
            let validated = packet.data.validated;
            let success = [];
            let foreverPremiumValidated = false;
            let foreverPremiumPurchased = false;
            var premiumPurchase = null;
            // check premium forever in purchases ONLY FOR ANDROID
            if (!ios && (FOREVER_PREMIUM_PRODUCT || FOREVER_PREMIUM_DISCOUNT_PRODUCT)) {
              for (var j in MY_PURCHASES) {
                var purchase = MY_PURCHASES[j];
                if (
                  FOREVER_PREMIUM_PRODUCT.productId === purchase.productId ||
                  FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId === purchase.productId
                ) {
                  foreverPremiumPurchased = true;
                  premiumPurchase = purchase;
                  break;
                }
              }
            }

            for (var i in validated) {
              let productId = i;
              let valid = validated[i];

              if (valid) {
                success.push(productId);
              }
              //console.log(' === PREM: test: ' + productId + ': ' + valid + ' ' + MONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId)
              if (MONTHLY_PREMIUM_PRODUCT.productId === productId || MONTHLY_PREMIUM_ANDROID === productId) {
                // ios + yokassa monthly premium workaround
                purchased = purchased || valid;
                //console.log(' === PREM: MONTHLY_PREMIUM_PRODUCT')
              } else if (SIXMONTHLY_PREMIUM_PRODUCT.productId === productId) {
                purchased = purchased || valid;
                //console.log(' === PREM: SIXMONTHLY_PREMIUM_PRODUCT')
              } else if (MONTHLY_AND_VOICE_PRODUCT.productId === productId) {
                //console.log(' === PREM: halfyearly');
                PREMIUM_PURCHASED = true;
                wirePurchased = true;
                purchased = purchased || valid;
              } else if (YEARLY_PREMIUM_PRODUCT.productId === productId) {
                purchased = purchased || valid;
                //console.log(' === PREM: YEARLY_PREMIUM_PRODUCT')
              } else if (MONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId === productId) {
                purchased = purchased || valid;
                //console.log(' === PREM: MONTHLY_PREMIUM_WITH_DEMO_PRODUCT')
              } else if (YEARLY_PREMIUM_WITH_DEMO_PRODUCT && YEARLY_PREMIUM_WITH_DEMO_PRODUCT.productId === productId) {
                purchased = purchased || valid;
              } else if (
                THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT &&
                THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId === productId
              ) {
                /*console.log(
                  ' >>>>>>>>>>>>>>>>>>>>>> ',
                  purchased,
                  valid,
                  productId,
                  THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT.productId
                );*/
                purchased = purchased || valid;
              } else if (
                (FOREVER_PREMIUM_PRODUCT && FOREVER_PREMIUM_PRODUCT.productId === productId) ||
                (FOREVER_PREMIUM_DISCOUNT_PRODUCT && FOREVER_PREMIUM_DISCOUNT_PRODUCT.productId === productId)
              ) {
                purchased = purchased || valid;
                //console.log(' === PREM: FOREVER_PREMIUM_PRODUCT')
                foreverPremiumValidated = foreverPremiumValidated || valid;
              } else if (MONTHLY_LIVE_WIRE_PRODUCT.productId === productId) {
                wirePurchased = wirePurchased || valid;
                //console.log(' === LIVE: MONTHLY_LIVE_WIRE_PRODUCT')
              } else if (SUB_LIVE_WIRE_PROMO_PRODUCT.productId === productId) {
                wirePurchased = wirePurchased || valid;
                //console.log(' === LIVE: SUB_LIVE_WIRE_PROMO_PRODUCT')
              }
              console.log(
                ' === PREM: !!! subscription validated: ' +
                  productId +
                  ': (purchased=' +
                  purchased +
                  ', wirepurchased=' +
                  wirePurchased +
                  '), valid=' +
                  valid,
                ' (forever: ' + foreverPremiumValidated + ')'
              );
            }
            UserPrefs.setForeverPremiumValidated(foreverPremiumValidated);
            // premium was purchased, but validation failed - GPA transaction was rolled back
            const foreverPremiumConsumed = foreverPremiumPurchased && !foreverPremiumValidated;
            if (foreverPremiumConsumed) {
              console.log(' === PREM: !!! CONSUME PREM FOREVER');
              await RNIap.consumePurchaseAndroid(premiumPurchase.purchaseToken);
              await RNIap.acknowledgePurchaseAndroid(premiumPurchase.purchaseToken);
            }
            // firebaseAnalitycsForBuyPurchases(purchased);
            //console.log('successsss', success, purchased, purchase);

            Rest.get().debug({
              PREM_validated: success,
              PREM_purchased: purchased,
              trial_expired: TRIAL_EXPIRED_HINT,
              forever: foreverPremiumValidated,
              WIRE_purchased: wirePurchased,
              forever_consumed: foreverPremiumConsumed,
            });
          } else {
            // fallback
            if (packet && packet.data && packet.data.error === 1) {
              purchased = awaitConnection || cached;
              wirePurchased = awaitConnection || wireCached;
            }
            Rest.get().debug({
              PREM_validation_failed: true,
              trial_expired: TRIAL_EXPIRED_HINT,
              packet: packet,
              MY_PURCHASES: MY_PURCHASES,
              MY_PRODUCTS: MY_PRODUCTS,
              PREM_purchased: purchased,
              trial_expired: TRIAL_EXPIRED_HINT,
              WIRE_purchased: wirePurchased,
            });
          }
          PREMIUM_PURCHASED = purchased || !TRIAL_EXPIRED_HINT;
          WIRE_PURCHASED = wirePurchased;
          console.log(
            ' === PREM: save premium purchased state to cache: ' +
              PREMIUM_PURCHASED +
              ', trial expired: ' +
              TRIAL_EXPIRED_HINT +
              ', WIRE: ' +
              PREMIUM_PURCHASED +
              ', reallyPaid: ' +
              purchased
          );
          Rest.get().debug({ PREM_cache: PREMIUM_PURCHASED, paid: purchased, trial_expired: TRIAL_EXPIRED_HINT });
          UserPrefs.setCachedPremiumPurchased(PREMIUM_PURCHASED);
          UserPrefs.setCachedWirePurchased(WIRE_PURCHASED);
          _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, purchased);
          resolve({ PREMIUM_PURCHASED, WIRE_PURCHASED });
        });
      });
      return promise;
    } else {
      console.log(' === PREM: Fallback to cached premium 1');
      Rest.get().debug({ RNIap_fallback: true });
      let promise = new Promise(function (resolve, reject) {
        PREMIUM_PURCHASED = true;
        _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, null);
        resolve({ PREMIUM_PURCHASED, WIRE_PURCHASED });
      });
      return promise;
    }
  } catch (err) {
    console.warn(err.code, err.message);
    await checkPremiumPurchasedYooKassa(awaitConnection);
  }
}

export async function getProducts() {
  if (FAKE) {
    return;
  }

  const subs = RNIap.getSubscriptions(itemSkus);
  const prods = ios ? [] : RNIap.getProducts(itemSkus);
  const products = [...(await subs), ...(await prods)];
  return products;
}

export async function getItems() {
  const country = await UserPrefs.getUserLocationCountry();

  if (_setIAPItemsError) {
    _setIAPItemsError(false);
  }

  try {
    if (FAKE) {
      return;
    }

    console.log('RNIap: load items...');
    const subs = RNIap.getSubscriptions(itemSkus);
    const prods = ios ? [] : RNIap.getProducts(itemSkus);
    const products = [...(await subs), ...(await prods)];

    console.log('RNIap: items loaded: ' + products.length);
    MY_PRODUCTS = products;
    //console.log('Products: ', itemSkus, products);
    for (let i in products) {
      const product = products[i];
      const price = products[i].price;

      if (!price || !price === undefined) {
        if (_setIAPItemsError) {
          _setIAPItemsError(true);
        }

        Metrica.event('iap_error', { error: 'Price is undefined', country });
      }

      if (product.productId === MONTHLY_PREMIUM) {
        MONTHLY_PREMIUM_PRODUCT = product;
      }
      if (product.productId === MONTHLY_PREMIUM_WITH_DEMO) {
        MONTHLY_PREMIUM_WITH_DEMO_PRODUCT = product;
      }
      if (product.productId === YEARLY_PREMIUM_WITH_DEMO) {
        YEARLY_PREMIUM_WITH_DEMO_PRODUCT = product;
      }
      if (product.productId === THREEMONTHLY_PREMIUM_WITH_DEMO) {
        THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT = product;
      }
      if (product.productId === SIXMONTHLY_PREMIUM) {
        SIXMONTHLY_PREMIUM_PRODUCT = product;
      }
      if (product.productId === YEARLY_PREMIUM) {
        YEARLY_PREMIUM_PRODUCT = product;
      }
      if (product.productId === FOREVER_PREMIUM) {
        FOREVER_PREMIUM_PRODUCT = product;
      }
      if (product.productId === FOREVER_PREMIUM_DISCOUNT) {
        FOREVER_PREMIUM_DISCOUNT_PRODUCT = product;
      }
      if (product.productId === MONTHLY_LIVE_WIRE) {
        MONTHLY_LIVE_WIRE_PRODUCT = product;
      }
      if (product.productId === MIN_30_LIVE_WIRE) {
        MIN_30_LIVE_WIRE_PRODUCT = product;
      }
      if (product.productId === MIN_180_LIVE_WIRE) {
        MIN_180_LIVE_WIRE_PRODUCT = product;
      }
      if (product.productId === SUB_LIVE_WIRE_PROMO) {
        SUB_LIVE_WIRE_PROMO_PRODUCT = product;
      }
      if (product.productId === MONTHLY_AND_VOICE) {
        MONTHLY_AND_VOICE_PRODUCT = product;
      }
      //console.log('productttt', product.productId);
    }
    return products;
  } catch (err) {
    const { code = '', message } = err;

    if (country === 'Russia') {
      await checkPremiumPurchasedYooKassa();
    } else {
      if (_setIAPItemsError) {
        _setIAPItemsError(true);
      }
    }

    Metrica.event('iap_error', { error: err ? `${err.code} ${err.message}` : 'IAP error', country });
    console.warn(code, message);
  }
}

async function checkPremiumPurchasedYooKassa(awaitConnection) {
  const cached = await UserPrefs.getCachedPremiumPurchased();
  const wireCached = await UserPrefs.getCachedWirePurchased();

  if (_storeSubscriptionInfo) {
    let promise = new Promise(async function (resolve, reject) {
      _storeSubscriptionInfo([], [], !ios, async function (ps, packet) {
        let purchased = false;
        let wirePurchased = false;

        if (packet && packet.data && packet.data.validated) {
          if (_setSubscriptionInfoPacket) {
            _setSubscriptionInfoPacket(packet);
          }

          if (_setIsYooKassaSubscriptionExists) {
            const yooKassaSubscriptions = packet.data.yoo;

            if (yooKassaSubscriptions) {
              for (let i in yooKassaSubscriptions) {
                const isSubscription =
                  i === MONTHLY_AND_VOICE || i === MONTHLY_LIVE_WIRE || i === MONTHLY_PREMIUM_ANDROID;

                if (isSubscription && yooKassaSubscriptions[i]) {
                  _setIsYooKassaSubscriptionExists(true);
                  break;
                }
              }
            }
          }

          let validated = packet.data.validated;
          let success = [];
          let foreverPremiumValidated = false;
          let foreverPremiumPurchased = false;

          for (var i in validated) {
            let productId = i;
            let valid = validated[i];

            if (valid) {
              success.push(productId);
            }

            if (MONTHLY_PREMIUM === productId || MONTHLY_PREMIUM_ANDROID === productId) {
              purchased = purchased || valid;
            } else if (SIXMONTHLY_PREMIUM === productId) {
              purchased = purchased || valid;
            } else if (MONTHLY_AND_VOICE === productId) {
              PREMIUM_PURCHASED = true;
              wirePurchased = true;
              purchased = purchased || valid;
            } else if (YEARLY_PREMIUM === productId) {
              purchased = purchased || valid;
            } else if (MONTHLY_PREMIUM_WITH_DEMO === productId) {
              purchased = purchased || valid;
            } else if (YEARLY_PREMIUM_WITH_DEMO === productId) {
              purchased = purchased || valid;
            } else if (THREEMONTHLY_PREMIUM_WITH_DEMO === productId) {
              purchased = purchased || valid;
            } else if (FOREVER_PREMIUM === productId || FOREVER_PREMIUM_DISCOUNT === productId) {
              purchased = purchased || valid;
              foreverPremiumValidated = foreverPremiumValidated || valid;
            } else if (MONTHLY_LIVE_WIRE === productId) {
              wirePurchased = wirePurchased || valid;
            } else if (SUB_LIVE_WIRE_PROMO === productId) {
              wirePurchased = wirePurchased || valid;
            }

            console.log(
              ' === PREM: !!! subscription validated: ' +
                productId +
                ': (purchased=' +
                purchased +
                ', wirepurchased=' +
                wirePurchased +
                '), valid=' +
                valid,
              ' (forever: ' + foreverPremiumValidated + ')'
            );
          }

          UserPrefs.setForeverPremiumValidated(foreverPremiumValidated);
          const foreverPremiumConsumed = foreverPremiumPurchased && !foreverPremiumValidated;

          Rest.get().debug({
            PREM_validated: success,
            PREM_purchased: purchased,
            trial_expired: TRIAL_EXPIRED_HINT,
            forever: foreverPremiumValidated,
            WIRE_purchased: wirePurchased,
            forever_consumed: foreverPremiumConsumed,
          });
        } else {
          if (packet && packet.data && packet.data.error === 1) {
            purchased = awaitConnection || cached;
            wirePurchased = awaitConnection || wireCached;
          }

          Rest.get().debug({
            PREM_validation_failed: true,
            trial_expired: TRIAL_EXPIRED_HINT,
            packet: packet,
            PREM_purchased: purchased,
            trial_expired: TRIAL_EXPIRED_HINT,
            WIRE_purchased: wirePurchased,
          });
        }

        PREMIUM_PURCHASED = purchased || !TRIAL_EXPIRED_HINT;
        WIRE_PURCHASED = wirePurchased;
        console.log(
          ' === PREM: save premium purchased state to cache: ' +
            PREMIUM_PURCHASED +
            ', trial expired: ' +
            TRIAL_EXPIRED_HINT +
            ', WIRE: ' +
            PREMIUM_PURCHASED +
            ', reallyPaid: ' +
            purchased
        );

        Rest.get().debug({ PREM_cache: PREMIUM_PURCHASED, paid: purchased, trial_expired: TRIAL_EXPIRED_HINT });
        UserPrefs.setCachedPremiumPurchased(PREMIUM_PURCHASED);
        UserPrefs.setCachedWirePurchased(WIRE_PURCHASED);
        _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, purchased);
        resolve({ PREMIUM_PURCHASED, WIRE_PURCHASED });
      });
    });

    return promise;
  } else {
    console.log(' === PREM: Fallback to cached premium 2');
    Rest.get().debug({ RNIap_fallback: true });

    let promise = new Promise(function (resolve, reject) {
      PREMIUM_PURCHASED = true;
      _setPremiumValid({ PREMIUM_PURCHASED, WIRE_PURCHASED }, null);
      resolve({ PREMIUM_PURCHASED, WIRE_PURCHASED });
    });

    return promise;
  }
}

export async function buyPremium(context, kind) {
  if (FAKE) {
    return {
      purchase: 'purchased',
      cancelled: false,
    };
  }

  let product;
  let isSubscription = true;
  console.log(kind);
  switch (kind) {
    case 'month_trial':
      product = MONTHLY_PREMIUM_WITH_DEMO_PRODUCT;
      break;
    case 'year_trial':
      product = YEARLY_PREMIUM_WITH_DEMO_PRODUCT;
      break;
    case 'threemonth_trial':
      product = THREEMONTHLY_PREMIUM_WITH_DEMO_PRODUCT;
      break;
    case 'month':
      product = MONTHLY_PREMIUM_PRODUCT;
      break;
    case 'halfyear':
      product = SIXMONTHLY_PREMIUM_PRODUCT;
      break;
    case 'year':
      product = YEARLY_PREMIUM_PRODUCT;
      break;
    case 'forever':
      product = FOREVER_PREMIUM_PRODUCT;
      isSubscription = false;
      break;
    case 'forever_discount':
      product = FOREVER_PREMIUM_DISCOUNT_PRODUCT;
      isSubscription = false;
      break;
    case 'month_and_voice':
      isSubscription = true;
      product = MONTHLY_AND_VOICE_PRODUCT;
      break;
    //WIRE IN PREMIUM SINCE WE NOW SELLING IT ON PREMIUM PAGE
    case 'monthly_wire':
      isSubscription = true;
      product = MONTHLY_LIVE_WIRE_PRODUCT;
      break;
    default:
      console.error('Wrong premium kind: ' + kind);
      return {
        purchasedPremium: null,
        cancelled: true,
      };
  }

  Rest.get().debug({ RNIap_buy_kind: kind, RNIAP_buy_product: product, RNIap_context: 'premium' });
  if (!product) {
    console.warn('Product is not initialized, kind: ' + kind);
    Rest.get().debug({ RNIap_not_inited: kind });
    return {
      purchasedPremium: null,
      cancelled: true,
    };
  }
  try {
    // TODO: forever - buy as non-consumable
    const purchase = isSubscription
      ? await requestSubscription(product.productId)
      : await requestPurchase(product.productId);

    logPurchase(product, purchase);
    //console.log('returned purchase from request', purchase);
    await checkPremiumPurchased(context, true);
    return {
      purchase: purchase,
      cancelled: false,
    };
  } catch (err) {
    if (err.code == 'E_USER_CANCELLED') {
      return {
        purchasedPremium: null,
        cancelled: true,
      };
    } else {
      console.warn(err.code, err.message);
      Rest.get().debug({ RNIap_purchase_error: err });
      return {
        purchasedPremium: null,
        cancelled: true,
        error: err.code,
      };
    }
  }
}

export async function verifyPurchase(purchase) {
  if (!purchase) {
    return false;
  }
  return true;
}

export async function buyLiveWire(context, kind) {
  if (FAKE) {
    return {
      purchase: 'purchased',
      cancelled: false,
    };
  }

  let product;
  let isSubscription = false;
  switch (kind) {
    case 'monthly_wire':
      isSubscription = true;
      product = MONTHLY_LIVE_WIRE_PRODUCT;
      break;
    case 'month_and_voice':
      isSubscription = true;
      product = MONTHLY_AND_VOICE_PRODUCT;
      break;
    case 'min_30_wire':
      product = MIN_30_LIVE_WIRE_PRODUCT;
      break;
    case 'min_180_wire':
      product = MIN_180_LIVE_WIRE_PRODUCT;
      break;
    case 'sub_live_wire_promo':
      isSubscription = true;
      product = SUB_LIVE_WIRE_PROMO_PRODUCT;
      break;
    default:
      console.error('Wrong live wire kind: ' + kind);
      return {
        purchase: null,
        cancelled: true,
      };
  }

  Rest.get().debug({ RNIap_buy_kind: kind, RNIAP_buy_product: product, RNIap_context: 'live_wire' });
  if (!product) {
    console.warn('Product is not initialized, kind: ' + kind);
    Rest.get().debug({ RNIap_not_inited: kind });
    return {
      purchase: null,
      cancelled: true,
    };
  }

  try {
    await RNIap.clearTransactionIOS();
    const purchase = isSubscription
      ? await requestSubscription(product.productId)
      : await requestPurchase(product.productId);

    logPurchase(product, purchase);
    //console.log(purchase);

    if (isSubscription) {
      await checkPremiumPurchased(_context, true);
    } else if (purchase && ios) {
      /*console.log(
        ' >>>>>>>>>>>>>>>>>> ',
        'purchase',
        ios,
        product.productId,
        MIN_30_LIVE_WIRE_PRODUCT.productId,
        purchase
      );*/
      if (product.productId == MIN_30_LIVE_WIRE_PRODUCT.productId) {
        UserPrefs.setPurchase_30Minutes(JSON.stringify(purchase));
      } else if (product.productId == MIN_180_LIVE_WIRE_PRODUCT.productId) {
        UserPrefs.setPurchase_180Minutes(JSON.stringify(purchase));
      }
    }
    return {
      purchase: purchase,
      cancelled: false,
    };
  } catch (err) {
    if (err.code == 'E_USER_CANCELLED') {
      return {
        purchase: null,
        cancelled: true,
      };
    } else {
      console.warn(err.code, err.message);
      Rest.get().debug({ RNIap_purchase_error: err });
      return {
        purchase: null,
        cancelled: true,
        error: err.code,
      };
    }
  }
}

async function logPurchase(product, purchase) {
  if (!purchase || !product) {
    console.error(' >>> return');
    return;
  }

  try {
    const { productId, price, currency } = product;
    const floatPrice = parseFloat(price);
    const isDebug = __DEV__ ? true : false;
    const name = (isDebug ? 'debug_' : '') + productId.slice(productId.lastIndexOf('.') + 1);
    /*const items = [
      {
        item_name: (isDebug ? 'debug_' : '') + name,
        price: floatPrice,
        quantity: 1,
      }
    ];
    await analytics().logPurchase({
      items,
      currency,
      value: floatPrice,
    });*/
    await analytics().logEvent(name, {
      price: floatPrice,
      currency,
    });
    firebaseAnalitycsForBuyPurchases(product);
  } catch (e) {
    console.error('logPurchase', e);
  }

  /*const eventName = 'app__' + productId.slice(productId.lastIndexOf('.') + 1);
  const eventValues = {
    af_content_id: eventName,
    af_currency: currency,
    af_revenue: price,
  };

  try {
    appsFlyer.logEvent(
      eventName,
      eventValues,
      () => {},
      (data) => {
        console.warn(data);
        Rest.get().debug({ APPSFLYER: data });
      }
    );
  } catch (e) {
    console.warn(e);
  }*/
}
