import { ImageSourcePropType } from 'react-native';

import { HasScreenName, onboarding_slide_name, onboarding_video_type } from '@analytics';
import { L } from '@lang';

type TSteps = {
  id: number;
  stepImg: ImageSourcePropType;
  stepTitle: () => string;
  buttonText: () => string;
};

export const STEPS: TSteps[] = [
  {
    id: 0,
    stepImg: require('./assets/img/onboarding_1.png'),
    stepTitle: () => L('hi_start_ed'),
    buttonText: () => L('start'),
  },
  {
    id: 1,
    stepImg: require('./assets/img/onboarding_2.png'),
    stepTitle: () => L('start_ed2'),
    buttonText: () => L('continue'),
  },
  {
    id: 2,
    stepImg: require('./assets/img/onboarding_3.png'),
    stepTitle: () => L('start_ed3'),
    buttonText: () => L('continue'),
  },
  {
    id: 3,
    stepImg: require('./assets/img/onboarding_4.png'),
    stepTitle: () => L('start_ed4'),
    buttonText: () => L('srart_button_ed'),
  },
  {
    id: 4,
    stepImg: require('./assets/img/onboarding_5.png'),
    stepTitle: () => L('start_ed5'),
    buttonText: () => L('continue'),
  },
];

export const FOR_ANALYTICS: HasScreenName = {
  screen_name: 'onboardingFunctionsPresentation',
};

export const FOR_ANALYTICS_MAP_SLIDERS: onboarding_slide_name[] = [
  'hello_we_are_kind_parents',
  'allways_know_childs_location',
  'child_plays_too_much',
  'it_possible_to_listen_soundaround',
  'child_is_ok',
];

export const FOR_ANALYTICS_MAP_VIDEO: onboarding_video_type[] = [
  'child_movements_video',
  'apps_stats_video',
  'add_place_video',
];

export const STEPS_NEED_ANIMATION_INDEX = [1, 2, 3];
