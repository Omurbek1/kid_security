import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { ActionTypes as WireActionTypes } from '../wire/WireMiddleware';
import { ActionTypes as WsActionTypes } from '../wire/WsMiddleware';
import { extractPhone } from '../Utils';
import * as Metrica from '../analytics/Analytics';
import Rest from '../Rest';
import UserPrefs from '../UserPrefs';
import * as RemoteConfig from '../analytics/RemoteConfig';

// The types of actions that you can dispatch to modify the state of the store
export const types = {
  SET_DEMO: 'SET_DEMO',
  SET_USERNAME: 'SET_USERNAME',
  SET_PASSWORD: 'SET_PASSWORD',
  SET_REST_API_TOKEN_DATA: 'SET_REST_API_TOKEN_DATA',
  SET_USERNAME_DEV: 'SET_USERNAME_DEV',
  SET_PASSWORD_DEV: 'SET_PASSWORD_DEV',
  SET_REST_API_TOKEN_DATA_DEV: 'SET_REST_API_TOKEN_DATA_DEV',
  SET_REGISTER_USERNAME: 'SET_REGISTER_USERNAME',
  SET_REGISTRATION_IN_PROGRESS: 'SET_REGISTRATION_IN_PROGRESS',
  SET_RECOVER_USERNAME: 'SET_RECOVER_USERNAME',
  SET_RECOVERING_IN_PROGRESS: 'SET_RECOVERING_IN_PROGRESS',
  SET_LOGGED_OUT: 'SET_LOGGED_OUT',
  CLEAR_FIRST_MAP_SHOW: 'CLEAR_FIRST_MAP_SHOW',
  MODIFY_ONLINE_SOUND_BALANCE: 'MODIFY_ONLINE_SOUND_BALANCE',
  SET_ONLINE_SOUND_BALANCE: 'SET_ONLINE_SOUND_BALANCE',
  CLEAR_FRIEND_TELL_BONUS: 'CLEAR_FRIEND_TELL_BONUS',
  CLEAR_SURVEY_BONUS: 'CLEAR_SURVEY_BONUS',
  MODIFY_USER_PROPERTY: 'MODIFY_USER_PROPERTY',
  SET_FRIEND_COUNT: 'SET_FRIEND_COUNT',
  SET_USER_ID: 'SET_USER_ID',
};

// Helper functions to dispatch actions, optionally with payloads
export const authActionCreators = {
  modifyUserProperty: (name, value) => {
    return { type: types.MODIFY_USER_PROPERTY, payload: { name, value } };
  },
  modifyOnlineSoundBalance: (modifier) => {
    return { type: types.MODIFY_ONLINE_SOUND_BALANCE, payload: { modifier } };
  },
  setOnlineSoundBalance: (modifier) => {
    return { type: types.SET_ONLINE_SOUND_BALANCE, payload: { modifier } };
  },
  clearFriendTellBonus: () => {
    return { type: types.CLEAR_FRIEND_TELL_BONUS };
  },
  clearQuestionaryBonus: () => {
    return { type: types.CLEAR_QUESTIONARY_BONUS };
  },
  clearSurveyBonus: () => {
    return { type: types.CLEAR_SURVEY_BONUS };
  },
  setDemo: (enabled) => {
    return { type: types.SET_DEMO, payload: { enabled } };
  },
  setUsername: (username) => {
    return { type: types.SET_USERNAME, payload: username };
  },
  setPassword: (password) => {
    return { type: types.SET_PASSWORD, payload: password };
  },
  setRestApiTokenData: (tokenData) => {
    return { type: types.SET_REST_API_TOKEN_DATA, payload: tokenData };
  },
  setUsernameDev: (usernameDev) => {
    return { type: types.SET_USERNAME_DEV, payload: usernameDev };
  },
  setPasswordDev: (passwordDev) => {
    return { type: types.SET_PASSWORD_DEV, payload: passwordDev };
  },
  setRestApiTokenDataDev: (tokenDataDev) => {
    return { type: types.SET_REST_API_TOKEN_DATA_DEV, payload: tokenDataDev };
  },
  setRegisterUsername: (username) => {
    return { type: types.SET_REGISTER_USERNAME, payload: username };
  },
  setRegistrationInProgress: (inProgress) => {
    return { type: types.SET_REGISTRATION_IN_PROGRESS, payload: inProgress };
  },
  setRecoverUsername: (username) => {
    return { type: types.SET_RECOVER_USERNAME, payload: username };
  },
  setRecoveringInProgress: (inProgress) => {
    return { type: types.SET_RECOVERING_IN_PROGRESS, payload: inProgress };
  },
  setLoggedOut: (loggedOut) => {
    return { type: types.SET_LOGGED_OUT, payload: { loggedOut } };
  },
  setFriendCount: (friendCount) => {
    return { type: types.SET_FRIEND_COUNT, payload: { friendCount } };
  },
  clearFirstMapShow: () => {
    return { type: types.CLEAR_FIRST_MAP_SHOW };
  },
  setUserId: (userId) => {
    return { type: types.SET_USER_ID, payload: userId };
  },
};

// Initial state of the store
const initialState = {
  firstMapShow: true,
  username: null,
  password: null,
  restApiTokenData: null,
  restApiTokenDataDev: null,
  connectingInProgress: false,
  authorizationInProgress: false,
  connectingAndAuthorizingInProgress: false,
  connected: false,
  authorized: false,
  registerUsername: '+',
  registrationInProgress: false,
  recoverUsername: '+',
  recoveringInProgress: false,
  loggedOut: true,
  demo: false,
  onlineSoundBalance: 0,
  friendTellBonus: 0,
  questionaryBonusUsed: true,
  userProps: {},
  premium: {
    supported: false,
    trialExpirationDate: new Date(0),
    limits: {
      maxPlaces: 1,
      movementHistory: true,
      buzzer: true,
    },
  },
  userId: null,
};

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
export const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.CLEAR_FIRST_MAP_SHOW: {
      return {
        ...state,
        firstMapShow: false,
      };
    }
    case types.SET_REGISTER_USERNAME: {
      const extracted = extractPhone(payload);
      const username = extracted;
      return {
        ...state,
        registerUsername: username,
      };
    }
    case types.SET_REGISTRATION_IN_PROGRESS: {
      return {
        ...state,
        registrationInProgress: payload,
      };
    }
    case types.SET_RECOVER_USERNAME: {
      const recoverUsername = extractPhone(payload);
      return {
        ...state,
        recoverUsername,
      };
    }
    case types.SET_RECOVERING_IN_PROGRESS: {
      return {
        ...state,
        recoveringInProgress: payload,
      };
    }
    case types.SET_LOGGED_OUT: {
      const { loggedOut } = payload;
      if (loggedOut) {
        return {
          ...initialState,
          username: state.username,
          password: state.password,
          loggedOut: true,
          demo: false,
        };
      } else {
        return {
          ...initialState,
          loggedOut: false,
        };
      }
    }
    case types.MODIFY_USER_PROPERTY: {
      const { name, value } = payload;
      let userProps = { ...state.userProps };
      userProps[name] = value;
      return { ...state, userProps };
    }
    case types.MODIFY_ONLINE_SOUND_BALANCE: {
      const { modifier } = payload;
      let onlineSoundBalance = state.onlineSoundBalance;
      if (!onlineSoundBalance) {
        onlineSoundBalance = 0;
      }
      onlineSoundBalance += modifier;
      if (onlineSoundBalance < 0) {
        onlineSoundBalance = 0;
      }
      return {
        ...state,
        onlineSoundBalance,
      };
    }
    case types.SET_ONLINE_SOUND_BALANCE: {
      const { modifier } = payload;
      let onlineSoundBalance = state.onlineSoundBalance;
      if (!onlineSoundBalance) {
        onlineSoundBalance = 0;
      }
      onlineSoundBalance = modifier;
      if (onlineSoundBalance < 0) {
        onlineSoundBalance = 0;
      }
      return {
        ...state,
        onlineSoundBalance,
      };
    }
    case types.CLEAR_FRIEND_TELL_BONUS: {
      return {
        ...state,
        friendTellBonus: 0,
      };
    }
    case types.CLEAR_SURVEY_BONUS: {
      return {
        ...state,
        questionaryBonusUsed: true,
      };
    }
    case types.SET_DEMO: {
      const { enabled } = payload;
      return {
        ...state,
        demo: enabled,
      };
    }
    case types.SET_USERNAME: {
      const username = payload;
      UserPrefs.setUsername(username);
      return {
        ...state,
        username,
        registerUsername: username,
        recoverUsername: username,
      };
    }
    case types.SET_PASSWORD: {
      UserPrefs.setPassword(payload);
      return {
        ...state,
        password: payload,
      };
    }
    case types.SET_REST_API_TOKEN_DATA: {
      UserPrefs.setRestApiTokenData(payload);
      return {
        ...state,
        restApiTokenData: payload,
      };
    }
    case types.SET_USERNAME_DEV: {
      const username = payload;
      UserPrefs.setUsernameDev(username);
      return {
        ...state,
        username,
      };
    }
    case types.SET_PASSWORD_DEV: {
      UserPrefs.setPasswordDev(payload);
      return {
        ...state,
        password: payload,
      };
    }
    case types.SET_REST_API_TOKEN_DATA_DEV: {
      UserPrefs.setRestApiTokenDataDev(payload);
      return {
        ...state,
        restApiTokenDataDev: payload,
      };
    }
    case types.SET_FRIEND_COUNT: {
      const { friendCount } = payload;
      if (friendCount) {
        return {
          ...state,
          userProps: { ...state.userProps, usersInvited: friendCount },
        };
      }
      return { ...state };
    }
    case types.SET_USER_ID: {
      UserPrefs.setUserId(payload);
      Metrica.setUserId(payload);
      Rest.get().init(null, null, payload);

      return {
        ...state,
        userId: payload,
      };
    }
    case WsActionTypes.WS_CONNECT: {
      return {
        ...state,
        connectingInProgress: true,
        authorizationInProgress: false,
        connectingAndAuthorizingInProgress: true,
        connected: false,
        authorized: false,
      };
    }
    case WsActionTypes.WS_DISCONNECTED:
    case WsActionTypes.WS_ERROR: {
      return {
        ...state,
        connectingInProgress: false,
        authorizationInProgress: false,
        connectingAndAuthorizingInProgress: false,
        connected: false,
        authorized: false,
      };
    }
    case WsActionTypes.WS_CONNECTED: {
      console.log('connected');
      return {
        ...state,
        connectingInProgress: false,
        authorizationInProgress: false,
        connectingAndAuthorizingInProgress: true,
        connected: true,
        authorized: false,
      };
    }
    case WireActionTypes.WIRE_AUTHORIZE: {
      console.log('authorize');
      return {
        ...state,
        authorizationInProgress: true,
        connectingAndAuthorizingInProgress: true,
      };
    }

    case WireActionTypes.WIRE_AUTHORIZED: {
      console.log('authorized');
      if (state.loggedOut) {
        setTimeout(() => {
          Rest.get().debug({ authorized: Constants.manifest.version, os: Platform.OS });
        }, 0);
      }

      const reply = payload.data.data;
      //console.log(reply);
      let premium = null;
      if (reply.premium) {
        premium = reply.premium;
        if (reply.premiumForever === true) {
          premium.overriden = true;
        }
        premium.trialExpirationDate = new Date(premium.trialExpirationDate);
      } else {
        premium = {
          ...state.premium,
        };
      }

      Metrica.setUserId(reply.id);
      if (__DEV__) {
        console.log(' ===== userid: ' + reply.id);
      }
      Rest.get().init(null, null, reply.id);
      RemoteConfig.init();
      try {
        const badge = state.messageBadgeCounter ? state.messageBadgeCounter : 0;
        if (Platform.OS === 'ios') {
          Notifications.setBadgeCountAsync(badge);
        } else {
          const BadgeAndroid = require('react-native-android-badge');
          BadgeAndroid.setBadge(badge);
        }
      } catch (e) {
        console.warn(e);
      }

      const username = reply.username ? reply.username : state.username;
      const password = reply.password ? reply.password : state.password;

      return {
        ...state,
        authorizationInProgress: false,
        connectingAndAuthorizingInProgress: false,
        authorized: true,
        loggedOut: false,
        eventBadgeCounter: reply.eventBadgeCounter,
        messageBadgeCounter: reply.messageBadgeCounter,
        imageBadgeCounter: reply.imageBadgeCounter,
        onlineSoundBalance: reply.onlineSoundBalance,
        friendTellBonus: reply.friendTellBonus,
        questionaryBonusUsed: reply.questionaryBonusUsed,
        premium: premium,
        premiumUser: reply?.premiumUser,
        userProps: reply.props,
        username,
        password,
        userId: reply.id,
      };
    }
    case WireActionTypes.WIRE_AUTH_FAILED: {
      return {
        ...state,
        username: null,
        password: null,
      };
    }
  }

  return state;
};
