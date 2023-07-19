type FirebaseInitState = {
  source_screen?: string;
  source_tapped_element?: string | null;
  source_paywal_name?: string | null;
  source_paywal_main_text?: string | null;
  source_paywal_tapped_button_type?: 'try_for_free' | 'subscribe' | 'get' | null;
  source_paywal_tapped_button_label_localized?: string | null;
  source_paywal_time_left?: string;
  banner_on_map?: 'first_24_hours' | 'first_7_days' | 'after_7days' | null;
  debug?: string | null;
};
const initialState: FirebaseInitState = {
  source_screen: 'Map',
};

const SET_SCREEN = 'SET_SCREEN';
const SET_SCREEN_TAPPED_ELEMENT = 'SET_SCREEN_TAPPED_ELEMENT';
const SET_PAYWAL_NAME = 'SET_PAYWAL_NAME';
const SET_PAYWAL_MAIN_TEXT = 'SET_PAYWAL_MAIN_TEXT';
const SET_PAYWAL_TAPPED_BUTTON_TYPE = 'SET_PAYWAL_TAPPED_BUTTON_TYPE';
const SET_PAYWAL_TAPPED_BUTTON_LABEL_LOCALIZED = 'SET_PAYWAL_TAPPED_BUTTON_LABEL_LOCALIZED';
const SET_PAYWAL_TIME_LEFT = 'SET_PAYWAL_TIME_LEFT';

export const firebaseReduser = (state = initialState, action): FirebaseInitState => {
  switch (action.type) {
    case SET_SCREEN:
      return {
        ...state,
        source_screen: action.payload,
      };
    case SET_SCREEN_TAPPED_ELEMENT:
      return {
        ...state,
        source_tapped_element: action.payload,
      };
    case SET_PAYWAL_NAME:
      return {
        ...state,
        source_paywal_name: action.payload,
      };
    case SET_PAYWAL_MAIN_TEXT:
      return {
        ...state,
        source_paywal_main_text: action.payload,
      };
    case SET_PAYWAL_TAPPED_BUTTON_TYPE:
      return {
        ...state,
        source_paywal_tapped_button_type: action.payload,
      };
    case SET_PAYWAL_TAPPED_BUTTON_LABEL_LOCALIZED:
      return {
        ...state,
        source_paywal_tapped_button_label_localized: action.payload,
      };
    case SET_PAYWAL_TIME_LEFT:
      return {
        ...state,
        source_paywal_time_left: action.payload,
      };
    default:
      break;
  }
  return state;
};

export function setSourceScreen(screenName) {
  return {
    type: SET_SCREEN,
    payload: screenName,
  };
}

export function setPaywallName(paywallName) {
  return {
    type: SET_PAYWAL_NAME,
    payload: paywallName,
  };
}
