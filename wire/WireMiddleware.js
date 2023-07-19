import { ActionTypes as WsActionTypes } from './WsMiddleware';
import { ActionCreators as WsActionCreators } from './WsMiddleware';
import * as Localization from 'expo-localization';
// @ts-ignore
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
// @ts-ignore
import { L } from '../lang/Lang';

export const ActionTypes = {
  // consumed by middleware
  WIRE_SEND_PACKET: 'WIRE_SEND_PACKET',
  // produced by middleware
  WIRE_MESSAGE: 'WIRE_MESSAGE',
  WIRE_AUTHORIZE: 'WIRE_AUTHORIZE',
  WIRE_AUTHORIZED: 'WIRE_AUTHORIZED',
  WIRE_AUTH_FAILED: 'WIRE_AUTH_FAILED',
};

export const ActionCreators = {
  // @ts-ignore
  sendPacket: (packet, callback) => {
    return { type: ActionTypes.WIRE_SEND_PACKET, payload: { packet, callback } };
  },
  // @ts-ignore
  message: (packet, dispatch) => {
    return { type: ActionTypes.WIRE_MESSAGE, payload: { packet, dispatch } };
  },
  // @ts-ignore
  authorize: (username, password) => {
    return { type: ActionTypes.WIRE_AUTHORIZE, payload: { username, password } };
  },
  // @ts-ignore
  authorized: (data) => {
    return { type: ActionTypes.WIRE_AUTHORIZED, payload: { data } };
  },
  // @ts-ignore
  authFailed: (data) => {
    return { type: ActionTypes.WIRE_AUTH_FAILED, payload: { data } };
  },
};

// @ts-ignore
export function makePacket(command, data, uid) {
  return {
    cmd: command,
    uid: uid.toString(),
    data: data,
  };
}

// @ts-ignore
export function makeResponsivePacket(command, data) {
  return makePacket(command, data, genUid());
}

let uid = 1;
function genUid() {
  return uid++;
}

export default function createWireMiddleware() {
  // @ts-ignore
  return (store) => {
    const PING_PACKET = {};
    let pendingRequests = {};
    let lastSendTs = new Date();
    let connected = false;
    // @ts-ignore
    let pingTimer = null;

    function killPendingRequests() {
      for (let i in pendingRequests) {
        // @ts-ignore
        let pr = pendingRequests[i];
        pr.callback(pr, { invalid: true, data: { result: 1, error: 1 } });
      }
    }

    function initPingTimer() {
      return setInterval(function () {
        if (!connected) {
          return;
        }

        // @ts-ignore
        let diff = (new Date().getTime() - lastSendTs) / 1000;
        if (diff > 30) {
          console.log('send ping');
          sendPacket(PING_PACKET);
        }
      }, 15000);
    }

    // @ts-ignore
    function sendPacket(packet, callback, counter) {
      if (connected || counter > 15) {
        return sendPacketInternal(packet, callback);
      }

      if (!counter) {
        counter = 0;
      }

      setTimeout(() => {
        sendPacket(packet, callback, counter++);
      }, 1000);
    }

    // @ts-ignore
    function sendPacketInternal(packet, callback) {
      if (!packet) {
        console.error('sendPacket: packet is undefined');
        return;
      }
      //console.log('send wire packet');
      //console.log(packet);

      lastSendTs = new Date();
      if (!connected) {
        if (callback) {
          let pr = {
            packet: packet,
            callback: callback,
            created: new Date(),
          };
          callback(pr, { invalid: true, data: { result: 1, error: 1 } });
        }
        return;
      }

      if (callback) {
        let pr = {
          packet: packet,
          callback: callback,
          created: new Date(),
        };
        if (!packet.uid) {
          console.error('sendPacket: uid is not provided');
          packet.uid = 1;
        }
        // @ts-ignore
        pendingRequests[packet.uid] = pr;
      }
      store.dispatch(WsActionCreators.send(JSON.stringify(packet)));
    }

    // @ts-ignore
    function makeAuthPacket(username, password) {
      const data = {
        username: username,
        password: password,
        web: false,
        timezone: Localization.timezone,
        altreg: true,
        os: Platform.OS,
        // @ts-ignore
        os_ver: Platform.constants.Release,
        app_ver: Constants.manifest.version,
      };
      return makePacket('auth', data, genUid());
    }

    // @ts-ignore
    function sendAuthPacket(username, password) {
      // @ts-ignore
      sendPacket(makeAuthPacket(username, password), (pr, data) => {
        if (data.data.result === 0) {
          store.dispatch(WsActionCreators.setAllowReconnect(true));
          store.dispatch(ActionCreators.authorized(data));
        } else {
          // ws close code || server reply error
          if (data && data.data && (data.data.code === 4003 || data.data.error === 9002)) {
            store.dispatch(ActionCreators.authFailed(data));
          }
        }
      });
    }

    // @ts-ignore
    function processPacket(data) {
      // ignore pong
      if (data.data === '{}') {
        console.log('pong rcvd');
        return;
      }

      //console.log('incoming wire message:');
      //console.log(data.data);

      // parse packet
      let packet = data.data ? SafeJSON(data.data) : null;
      if (!packet) {
        return;
      }
      if (packet.cmd === 'disconnect') {
        store.dispatch(WsActionCreators.disconnect());
        return;
      }

      if (packet.uid) {
        // @ts-ignore
        let pr = pendingRequests[packet.uid];
        // @ts-ignore
        delete pendingRequests[packet.uid];
        if (pr && pr.callback) {
          pr.callback(pr, packet);
          //return; -- commented to keep dispatching even callback is specified
        }
      }
      console.log('dispatch: ' + packet.cmd);
      store.dispatch(ActionCreators.message(packet, store.dispatch));
    }

    // @ts-ignore
    return (next) => (action) => {
      switch (action.type) {
        case ActionTypes.WIRE_AUTH_FAILED: {
          store.dispatch(WsActionCreators.disconnect(false));
          setTimeout(() => store.dispatch(WsActionCreators.reconnect()), 100);
          break;
        }
        case ActionTypes.WIRE_AUTHORIZE: {
          break;
        }
        case ActionTypes.WIRE_AUTHORIZED: {
          pingTimer = initPingTimer();
          break;
        }
        case WsActionTypes.WS_CONNECTED: {
          lastSendTs = new Date();
          connected = true;
          const { username, password, demo } = store.getState().authReducer;
          setTimeout(() => {
            console.log(' === DEMO AUTH test: ' + demo);
            store.dispatch(ActionCreators.authorize(username, password));
            if (demo) {
              console.log(' === DEMO AUTH');
              sendAuthPacket('demo', 'demo');
            } else {
              sendAuthPacket(username, password);
            }
          }, 0);
          break;
        }
        case WsActionTypes.WS_DISCONNECTED: {
          connected = false;
          // @ts-ignore
          clearInterval(pingTimer);
          pingTimer = null;
          killPendingRequests();
          break;
        }
        case WsActionTypes.WS_ERROR: {
          connected = false;
          break;
        }
        case WsActionTypes.WS_MESSAGE: {
          processPacket(action.payload.data);
          break;
        }
        case ActionTypes.WIRE_SEND_PACKET: {
          sendPacket(action.payload.packet, action.payload.callback);
          break;
        }
      }
      return next(action);
    };
  };
}

/**
 * @param {string} str
 */
function SafeJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {}
}
