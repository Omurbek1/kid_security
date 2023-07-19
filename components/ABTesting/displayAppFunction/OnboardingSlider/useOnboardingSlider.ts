import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { slideTypes } from 'components/organisms/IntroPane/types';
import UserPrefs from 'UserPrefs';

import { firebaseAnalitycsLogEvent, TObjectTarget, TSildeDirection } from '@analytics';

import {
  FOR_ANALYTICS,
  FOR_ANALYTICS_MAP_SLIDERS,
  FOR_ANALYTICS_MAP_VIDEO,
  STEPS,
  STEPS_NEED_ANIMATION_INDEX,
} from '../const';

const useOnboardingSlider = (setContext, context) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimationVisible, setIsAnimationVisible] = useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [steps] = useState(STEPS);
  const [animations, setAnimations] = useState<[string, string, string] | []>([]);
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);

  const loadAnimations = async () => {
    try {
      const lang = UserPrefs.all.language as string;
      const resultFetch = await Promise.all([
        fetch(`https://svc.kidsecurity.tech/video-hints/static/demo_function_onboarding1/${lang}.json`),
        fetch(`https://svc.kidsecurity.tech/video-hints/static/demo_function_onboarding2/${lang}.json`),
        fetch(`https://svc.kidsecurity.tech/video-hints/static/demo_function_onboarding3/${lang}.json`),
      ]);

      setAnimations([await resultFetch[0].json(), await resultFetch[1].json(), await resultFetch[2].json()]);
      setIsAnimationLoaded(true);
    } catch {
      firebaseAnalitycsLogEvent('debug', {
        type: 'Ошибка в загрузке json анимаций для онобрдинга с демонстрациями функций',
      });
    }
  };

  //#region analytics
  useEffect(() => {
    firebaseAnalitycsLogEvent('screen_open', FOR_ANALYTICS);
    loadAnimations();
  }, []);

  useEffect(() => {
    firebaseAnalitycsLogEvent('open_slide', { ...FOR_ANALYTICS, slide_name: FOR_ANALYTICS_MAP_SLIDERS[activeIndex] });
  }, [activeIndex]);

  const firebaseEventAnimationStart = () => {
    firebaseAnalitycsLogEvent(
      'animation_start',
      {
        ...FOR_ANALYTICS,
        animation_name: FOR_ANALYTICS_MAP_VIDEO[currentAnimationIndex],
      },
      true
    );
  };

  const firebaseEventAnimationComplete = () => {
    firebaseAnalitycsLogEvent(
      'animation_complete',
      {
        ...FOR_ANALYTICS,
        animation_name: FOR_ANALYTICS_MAP_VIDEO[currentAnimationIndex],
      },
      true
    );
  };

  const firebaseEventTapScip = () => {
    firebaseAnalitycsLogEvent(
      'tap_skip',
      {
        ...FOR_ANALYTICS,
        slide_name: FOR_ANALYTICS_MAP_SLIDERS[activeIndex],
      },
      true
    );
  };
  const firebaseEventTap = (object: TObjectTarget) => {
    firebaseAnalitycsLogEvent(
      'tap',
      {
        ...FOR_ANALYTICS,
        object,
        slide_name: FOR_ANALYTICS_MAP_SLIDERS[activeIndex],
      },
      true
    );
  };
  const firebaseEventNext = () => {
    firebaseAnalitycsLogEvent(
      'next',
      {
        ...FOR_ANALYTICS,
        slide_name: FOR_ANALYTICS_MAP_SLIDERS[activeIndex],
      },
      true
    );
  };
  const firebaseOnSwipeEvent = (direction: TSildeDirection) => {
    firebaseAnalitycsLogEvent(
      'swipe',
      {
        ...FOR_ANALYTICS,
        slide_name: FOR_ANALYTICS_MAP_SLIDERS[activeIndex],
        swipeDirection: direction,
      },
      true
    );
  };
  const onVideoTap = () => {
    firebaseEventTap('video');
  };

  const onTextTap = () => {
    firebaseEventTap('text');
  };

  const onImageTap = () => {
    firebaseEventTap('image');
  };
  //#endregion

  const onSkipPress = () => {
    const country = UserPrefs.all.userLocationCountry;
    const isRusshianAndAndroid = country === 'Russia' && Platform.OS === 'android';
    firebaseEventTapScip();
    setContext((prev: any) => ({
      ...prev,
      type: context.hasPremium || isRusshianAndAndroid ? slideTypes.DONE : slideTypes.STORE,
    }));
  };

  const onAnimationFinish = () => {
    firebaseEventAnimationComplete();
    setIsAnimationVisible(false);
    setCurrentAnimationIndex((index) => index + 1);
  };

  const onNextPopup = () => {
    const country = UserPrefs.all.userLocationCountry;
    const isRusshianAndAndroid = country === 'Russia' && Platform.OS === 'android';
    firebaseEventNext();
    if (STEPS.length - 1 === activeIndex) {
      setContext((prev: any) => ({
        ...prev,
        type: context.hasPremium || isRusshianAndAndroid ? slideTypes.DONE : slideTypes.STORE,
      }));
    }
    if (STEPS_NEED_ANIMATION_INDEX.includes(activeIndex)) {
      if (isAnimationLoaded) {
        firebaseEventAnimationStart();
        setIsAnimationVisible(true);
      } else {
        setCurrentAnimationIndex((index) => index + 1);
      }
    }
    setActiveIndex((index) => index + 1);
  };

  return {
    steps,
    activeIndex,
    isAnimationVisible,
    animations,
    currentAnimationIndex,

    onAnimationFinish,
    onNextPopup,
    onSkipPress,

    onVideoTap,
    onImageTap,
    onTextTap,

    firebaseOnSwipeEvent,
  };
};

export default useOnboardingSlider;
