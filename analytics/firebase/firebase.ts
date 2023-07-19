import analytics from '@react-native-firebase/analytics';
import { setPaywallName, setSourceScreen } from '../../reducers/firebaseRedux';
import { store } from '../../Store';

export const mappingRouteAndScreenName: {
  [key: string]: screen_name_map | null;
} = {
  Intro: null,
  PurchasePage: 'paywallAfterOnboarding',
  WelcomeSlider: 'onboardingGamification',
  Auth: null,
  Register: null,
  Recover: null,
  Map: 'mapScreen',
  DemoMap: 'mapScreenDemo',
  Settings: 'settingsScreen',
  About: 'settingsAboutScreen',
  AddPhone: 'connectChildCodeScreen',
  ObjectName: 'settingsKidAvatarScreen',
  LocationRate: 'settingsUpdateFreqScreen',
  Buzzer: 'loudSignalScreen',
  Dummy: 'splashScreen',
  TrackHistory: 'historyMoveScreen',
  Events: null,
  Places: 'placesMapScreen',
  PremiumFeatures: 'featuresSlides',
  AchievementFeatures: 'kidsAchievementsSlides',
  BuyPremium: null,
  TryPremium: null,
  Chat: 'сhatWithKidsScreen',
  Stats: 'appsStats',
  Parents: null,
  AddParent: null,
  DeleteParent: null,
  Wiretapping: 'soundAroundScreen',
  SetupBalance: null,
  SupportChat: null,
  SupportAgentChatList: null,
  SupportAgentChat: null,
  Language: 'settingsLanguageScreen',
  AddHomePlace: null,
  OnlineSoundInitial: 'liveSoundAroundScreen',
  OnlineSoundProgress: null,
  KidPhoneProblems: null,
  KidPhoneConfigure: null,
  FreeMinutes: null,
  ChildAchievements: 'kidsAchivementScreen',
  ChildTasksHistory: 'taskDoneHistoryScreen',
  ChildDreams: 'kidsDreamsScreen',
  ChildParentTasks: 'taskForKidsScreen',
  ActivationSuccess: null,
  ActivationFail: null,
  Dev: null,
  ChildChats: 'сhatsControlScreen',
  MessengerChat: null,
  PaymentMethod: null,
  AddPhoneNumber: null,
  PhoneNumberConfirmation: null,
  YooKassaPayment: null,
  PayWithBankCard: null,
  Menu: 'featureMenu',
  Main: null,
};

export type screen_name_map =
  | 'splashScreen'
  | 'onboardingGamification'
  | 'onboardingFunctionsPresentation'
  | 'сhatWithKidsScreen'
  | 'paywallAfterOnboarding'
  | 'registrationDialog'
  | 'connectChildCodeScreen'
  | 'featuresSlides'
  | 'mapScreen'
  | 'mapScreenDemo'
  | 'mapTypeScreen'
  | 'featureMenu'
  | menu_screen_name
  | setting_screen_name;

export type menu_screen_name =
  | 'soundAroundScreen'
  | 'liveSoundAroundScreen'
  | 'сhatsControlScreen'
  | 'placesMapScreen'
  | 'historyMoveScreen'
  | 'appsStats'
  | 'kidsAchievementsSlides'
  | 'kidsAchivementScreen'
  | 'kidsDreamsScreen'
  | 'taskDoneHistoryScreen'
  | 'taskForKidsScreen'
  | 'loudSignalScreen';

export type setting_screen_name =
  | 'settingsScreen'
  | 'settingsAboutScreen'
  | 'settingsLanguageScreen'
  | 'settingsKidAvatarScreen'
  | 'settingsUpdateFreqScreen';

export type onboarding_slide_name =
  | 'onboardingUserName'
  | 'onboardingWhatFeatures'
  | 'onboardingHowManyChildren'
  | 'onboardingGreetings'
  | 'onboardingProgressBar'
  | 'onboardingEverythingReady'
  | 'hello_we_are_kind_parents'
  | 'allways_know_childs_location'
  | 'child_plays_too_much'
  | 'it_possible_to_listen_soundaround'
  | 'child_is_ok';
export type onboarding_video_type = 'child_movements_video' | 'apps_stats_video' | 'add_place_video';

export type HasScreenName = { screen_name: screen_name_map };
export type MapBannersTypeEvent =
  | 'try_for_free_map_show'
  | 'test_version_activated_map_show'
  | 'buy_subscription_map_show';

export type TObjectTarget = 'image' | 'text' | 'video';
export type TSildeDirection = 'up' | 'down' | 'left' | 'right';
export type base_params_map = {
  screen_open: HasScreenName;
  first_open: {
    reinstall: boolean;
  };
  modal_open: HasScreenName & {
    modal_name: string;
    [key: string]: unknown;
  };
  purchase: purchase | any;
  refresh: HasScreenName;
  add_child_map_pin: HasScreenName;
  pin_map: HasScreenName & { child_id: string };
  try_for_free_map_show: HasScreenName;
  test_version_activated_map_show: HasScreenName;
  buy_subscription_map_show: HasScreenName;
  tap: HasScreenName & { object: TObjectTarget } & Partial<{ [key: string]: string }>;
  menu_icon: {
    function: menu_screen_name;
  };
  open_slide: HasScreenName & {
    slide_name: onboarding_slide_name;
  };
  tap_skip: HasScreenName & {
    slide_name: onboarding_slide_name;
  };
  begin_checkout: HasScreenName & {
    shortSKU: string;
  };
  animation_start: HasScreenName & {
    animation_name: onboarding_video_type;
    slide_name?: onboarding_video_type;
  };
  animation_complete: HasScreenName & {
    animation_name: onboarding_video_type;
    slide_name?: onboarding_video_type;
  };
  next: HasScreenName & { slide_name: onboarding_slide_name };
  swipe: HasScreenName & { slide_name: onboarding_slide_name } & {
    swipeDirection: TSildeDirection;
  };
  debug: any;
};

type SendAnalytics = <T extends keyof base_params_map = keyof base_params_map>(
  eventName: T,
  params: base_params_map[T],
  devLog?: boolean
) => Promise<void>;

type UseFirebaseAnalytics = () => {
  sendFirebaseAnalytics: SendAnalytics;
};

export const useFirebaseAnalytics: UseFirebaseAnalytics = () => {
  const sendFirebaseAnalytics: SendAnalytics = async (eventName, params, devLog = false) => {
    await analytics().logEvent(eventName, params);
    if (__DEV__ && devLog) {
      console.log('FIREBASE_LOG:', eventName, params);
    }
  };

  return {
    sendFirebaseAnalytics,
  };
};

export const firebaseAnalyticsForNavigation = (screen: string) => {
  const analyticsScreenName = mappingRouteAndScreenName[screen];
  if (!analyticsScreenName) {
    return;
  }

  firebaseAnalitycsLogEvent('screen_open', { screen_name: analyticsScreenName }, true);
  store.dispatch(setSourceScreen(analyticsScreenName));
};

export const firebaseAnalitycsLogEvent: SendAnalytics = async (eventName, params, devLog = false) => {
  await analytics().logEvent(eventName, params);

  if (__DEV__ && devLog) {
    console.log('FIREBASE_LOG:', eventName, params);
  }
};
type FirebaseAnalitycsForOpenModal = (
  modalName: string,
  isPaywall?: boolean,
  additionalProps?: {
    [key: string]: string;
  }
) => void;
export const firebaseAnalitycsForOpenModal: FirebaseAnalitycsForOpenModal = (
  modalName,
  isPaywall = false,
  additionalProps = {}
) => {
  const { firebaseReduser: firebaseStore } = store.getState();
  firebaseAnalitycsLogEvent(
    'modal_open',
    {
      modal_name: modalName,
      screen_name: firebaseStore.source_screen,
      ...additionalProps,
    },
    true
  );

  if (isPaywall) {
    store.dispatch(setPaywallName(modalName));
  }
};

export type purchase = {
  transaction_id: string;
  store: 'appstore' | 'playmarket' | 'undefined';
  free_trial: 'true' | 'false';
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_variant: 'subscription' | 'purchase' | 'undefined';
    price: number;
    quantity: number;
  }>;
  source_screen?: string | null;
  source_tapped_element?: string | null;
  source_paywal_name?: string | null;
  source_paywal_main_text?: string | null;
  source_paywal_tapped_button_type?: 'try_for_free' | 'subscribe' | 'get' | null;
  source_paywal_tapped_button_label_localized?: string | null;
  source_paywal_time_left: string;
  banner_on_map?: 'first_24_hours' | 'first_7_days' | 'after_7days' | null;
  debug?: string | null;
};

export const firebaseAnalitycsForBuyPurchases = (product: { productId: string; price: string; currency: string }) => {
  const { firebaseReduser: firebaseStore } = store.getState();
  const { productId, price, currency } = product;
  const name = productId.slice(productId.lastIndexOf('.') + 1)?.toString();

  let purchase: purchase = {
    transaction_id: '',
    store: '',
    free_trial: 'false',
    value: Number.parseFloat(price),
    currency: currency || '',
    items: [
      {
        item_id: '',
        item_name: name || '',
        item_variant: '',
        price: Number.parseFloat(price),
        quantity: 1,
      },
    ],
    ...firebaseStore,
  };

  firebaseAnalitycsLogEvent('purchase', purchase);
};

export const firebaseAnalyticsForBeginCheckout = (shortSKU: string) => {
  const { firebaseReduser: firebaseStore } = store.getState();
  let beginCheckout = {
    shortSKU,
    ...firebaseStore,
  };
  firebaseAnalitycsLogEvent('begin_checkout', beginCheckout, true);
};

export const MapScreenFirebaseAnalytics = {
  refresh: () => {
    const { firebaseReduser: firebaseStore } = store.getState();
    firebaseAnalitycsLogEvent(
      'refresh',
      {
        screen_name: firebaseStore?.source_screen,
      },
      true
    );
  },
  addChildMapPin: () => {
    const { firebaseReduser: firebaseStore } = store.getState();
    firebaseAnalitycsLogEvent(
      'add_child_map_pin',
      {
        screen_name: firebaseStore?.source_screen,
      },
      true
    );
  },
  pinMap: (childId: string) => {
    const { firebaseReduser: firebaseStore } = store.getState();
    firebaseAnalitycsLogEvent(
      'pin_map',
      {
        screen_name: firebaseStore?.source_screen,
        child_id: childId?.toString(),
      },
      true
    );
  },
  tapInMapBanner: (eventName: MapBannersTypeEvent) => {
    //#TODO: сломанная логика навигации. Нижнего меню
    //Должны получать значения со стора. А не сами его прокидывать

    //const { firebaseReduser: firebaseStore } = store.getState();
    firebaseAnalitycsLogEvent(
      eventName,
      {
        screen_name: 'mapScreen', // firebaseStore?.source_screen,
      },
      true
    );
    store.dispatch(setSourceScreen('mapScreen'));
  },
  realtimeSwitch: (turnStatus: boolean) => {
    const { firebaseReduser: firebaseStore } = store.getState();
    firebaseAnalitycsLogEvent(
      'tap',
      {
        screen_name: firebaseStore?.source_screen,
        object: 'RealTimeSwitcher',
        turn_on: turnStatus?.toString(),
      },
      true
    );
  },
};
