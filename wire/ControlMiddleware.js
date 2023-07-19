import appsFlyer from 'react-native-appsflyer';
import { Platform } from 'react-native';

import { ActionTypes as controlActionTypes, controlActionCreators } from '../reducers/controlRedux';
import Const from '../Const';
import { ActionTypes } from '../wire/ControlActionTypes';
import UserPrefs from '../UserPrefs';
import { RestAPIService } from '../RestApi';

import {
  ActionTypes as WireActionTypes,
  ActionCreators as WireActionCreators,
  makeResponsivePacket,
} from './WireMiddleware';

// Helper functions to dispatch actions, optionally with payloads
export const ActionCreators = {
  setUserLanguage: (language, callback) => {
    const data = {
      language: language,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.set_user_language, data), callback);
  },
  setUserProperty: (property, value, callback) => {
    const data = {
      property,
      value,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.set_user_property, data), callback);
  },
  setUserAdId: ({ adid, os }, callback) => {
    console.log('appsFlyerUID');
    const data = {
      adid,
      os,
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.set_user_adid, data), callback);
  },
  getObjectMap: (callback) => {
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.get_object_map), callback);
  },
  subscribeForObjects: (ids, callback) => {
    const data = {
      list: ids.map((id) => ({ oid: id, mask: 1023 })),
    };
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.subscribe_for_objects, data), callback);
  },
  getGeozoneList: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.get_geozone_list, data), callback);
  },
  clearEventBadgeCounter: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.clear_event_badge_counter, data), callback);
  },
  clearMessageBadgeCounter: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.clear_message_badge_counter, data), callback);
  },
  clearPhotoBadgeCounter: (callback) => {
    const data = {};
    return WireActionCreators.sendPacket(makeResponsivePacket(ActionTypes.clear_photo_badge_counter, data), callback);
  },
  toRedux: (command, data, dispatch) => {
    return { type: command, payload: { data, dispatch } };
  },
};

export default function createControlMiddleware() {
  return (store) => {
    return (next) => (action) => {
      switch (action.type) {
        case controlActionTypes.SET_PUSH_TOKEN: {
          const { token } = action.payload;
          const { authorized } = store.getState().authReducer;
          if (authorized) {
            let oldPush = UserPrefs.all.pushToken;
            if (oldPush === token) {
              oldPush = null;
            }
            store.dispatch(
              controlActionCreators.enablePushNotifications(
                {
                  debug: !!__DEV__,
                  provider: Const.getPushProvider(),
                  instance: token,
                  oldInstance: oldPush,
                },
                () => {
                  UserPrefs.all.pushToken = token;
                  UserPrefs.setPushToken(token);
                }
              )
            );
          }
          break;
        }
        case WireActionTypes.WIRE_AUTHORIZED: {
          const { pushToken } = store.getState().controlReducer;
          if (pushToken) {
            let oldPush = UserPrefs.all.pushToken;
            if (oldPush === pushToken) {
              oldPush = null;
            }
            store.dispatch(
              controlActionCreators.enablePushNotifications(
                {
                  debug: !!__DEV__,
                  provider: Const.getPushProvider(),
                  instance: pushToken,
                  oldInstance: oldPush,
                },
                () => {
                  UserPrefs.all.pushToken = pushToken;
                  UserPrefs.setPushToken(pushToken);
                }
              )
            );
          }

          const { payload } = action;
          //console.log('data:', payload.data);
          const reply = payload.data.data;
          const { photoBadgeCounter, imageBadgeCounter, messageBadgeCounter } = reply;
          store.dispatch(
            controlActionCreators.initBadges({ photoBadgeCounter, imageBadgeCounter, messageBadgeCounter })
          );
          store.dispatch(ActionCreators.setUserLanguage(UserPrefs.all.language));
          store.dispatch(ActionCreators.clearEventBadgeCounter());
          //store.dispatch(ActionCreators.clearMessageBadgeCounter());
          store.dispatch(ActionCreators.clearPhotoBadgeCounter());
          store.dispatch(ActionCreators.getGeozoneList());

          RestAPIService.getObjectMap()
            .then((data) => {
              const objects = {};
              data.objects.map((obj) => {
                objects[obj.oid + ''] = obj;
              });

              store.dispatch(controlActionCreators.getObjectMap(objects, store.dispatch));
              setTimeout(() => {
                if (!store.getState().authReducer.firstMapShow || !UserPrefs.all.introShown) {
                  return;
                }
              }, 0);
            })
            .catch((err) => console.log('Error getting object on map', err));

          appsFlyer.getAppsFlyerUID(async (error, appsFlyerUID) => {
            store.dispatch(
              ActionCreators.setUserAdId(
                {
                  adid: appsFlyerUID,
                  os: Platform.OS == 'ios' ? 1 : 0,
                },
                (a, b) => {
                  //console.log(a, b);
                }
              )
            );
          });
          break;
        }
        case WireActionTypes.WIRE_MESSAGE: {
          const { packet } = action.payload;
          switch (packet.cmd) {
            case ActionTypes.get_object_map: {
              if (packet.data.result === 0) {
                const objects = packet.data.objects;
                const ids = objects.map((obj) => obj.oid);
                store.dispatch(ActionCreators.subscribeForObjects(ids));
              }
              break;
            }
          }
          //console.log('to redux: ' + packet.cmd)
          store.dispatch(ActionCreators.toRedux(packet.cmd, packet.data, store.dispatch));
          break;
        }
      }
      return next(action);
    };
  };
}
