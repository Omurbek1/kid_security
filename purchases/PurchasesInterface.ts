import {
  getProducts,
  MONTHLY_PREMIUM,
  SIXMONTHLY_PREMIUM,
  YEARLY_PREMIUM,
  MONTHLY_PREMIUM_WITH_DEMO,
  FOREVER_PREMIUM,
  MONTHLY_LIVE_WIRE,
  MIN_30_LIVE_WIRE,
  MIN_180_LIVE_WIRE,
  YEARLY_PREMIUM_WITH_DEMO,
  THREEMONTHLY_PREMIUM_WITH_DEMO,
  SUB_LIVE_WIRE_PROMO,
  MONTHLY_AND_VOICE
} from './Purchases';

export interface ProductItem {
  currency: string;
  description: string;
  discounts: any[];
  introductoryPrice: string;
  introductoryPriceNumberOfPeriodsIOS: string;
  introductoryPricePaymentModeIOS: string;
  introductoryPriceSubscriptionPeriodIOS: string;
  localizedPrice: string;
  price: string;
  productId: string;
  subscriptionPeriodNumberIOS: string;
  subscriptionPeriodUnitIOS: string;
  title: string;
  type: string;
}

const productsIds = {
  MONTHLY_PREMIUM,
  SIXMONTHLY_PREMIUM,
  YEARLY_PREMIUM,
  MONTHLY_PREMIUM_WITH_DEMO,
  FOREVER_PREMIUM,
  MONTHLY_LIVE_WIRE,
  MIN_30_LIVE_WIRE,
  MIN_180_LIVE_WIRE,
  YEARLY_PREMIUM_WITH_DEMO,
  THREEMONTHLY_PREMIUM_WITH_DEMO,
  SUB_LIVE_WIRE_PROMO,
  MONTHLY_AND_VOICE
};

type ProductIds = keyof typeof productsIds;

export const GetProductInfo = (product: ProductIds, products: ProductItem[]): ProductItem => {
  const productId = productsIds[product];
  //console.log(productsIds)
  if (products) {
    return products?.filter((product: ProductItem) => product.productId === productId).pop();
  } else {
    return null;
  }
};
