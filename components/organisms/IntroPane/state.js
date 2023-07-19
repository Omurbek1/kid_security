import { slideTypes } from './types';
import { Dimensions, PixelRatio } from 'react-native';
import remoteConfig from '@react-native-firebase/remote-config';

import UserPrefs from 'UserPrefs';

const { width, height } = Dimensions.get('window');
export const state = () => {
  const lang = UserPrefs.all.language ;
  const hasAnimation = ['it', 'en', 'pl', 'de', 'tr', 'ru', 'uk'].includes(lang);
  
  const baseRoot =
    remoteConfig().getValue('onboarding_demo_new_functions').asString() === 'new_functions' && hasAnimation
      ? slideTypes.ONBOARDING
      : slideTypes.WELCOME;

  return {
    type: baseRoot,
    purchase: '',
    redraw: true,
    name: '',
    discountIsShown: false,
    skip: false,
    storeShow: false,
    welcomeShow: true,
    loading: false,
    complete: false,
    activeSlide: 0,
    animation: false,
    width,
    height,
    pRatio: PixelRatio.get(),
    hasPremium: false,
    initUrl: false,
    initPremium: false,
  };
};
