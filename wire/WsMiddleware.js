import UserPrefs from '../UserPrefs';
import * as Utils from '../Utils';

export const ActionTypes = {
  // consumed by middleware
  WS_CONNECT: 'WS_CONNECT',
  WS_RECONNECT: 'WS_RECONNECT',
  WS_DISCONNECT: 'WS_DISCONNECT',
  WS_SEND: 'WS_SEND',
  WS_SET_ALLOW_RECONNECT: 'WS_SET_ALLOW_RECONNECT',
  // produced by middleware
  WS_CONNECTED: 'WS_CONNECTED',
  WS_DISCONNECTED: 'WS_DISCONNECTED',
  WS_ERROR: 'WS_ERROR',
  WS_MESSAGE: 'WS_MESSAGE',
};

// Helper functions to dispatch actions, optionally with payloads
export const ActionCreators = {
  connect: (url, onFail) => {
    return { type: ActionTypes.WS_CONNECT, payload: { url, onFail } };
  },
  disconnect: (allowReconnect) => {
    return { type: ActionTypes.WS_DISCONNECT, payload: { allowReconnect } };
  },
  reconnect: () => {
    return { type: ActionTypes.WS_RECONNECT };
  },
  send: (data) => {
    return { type: ActionTypes.WS_SEND, payload: { data } };
  },
  connected: (ws) => {
    return { type: ActionTypes.WS_CONNECTED, payload: { ws } };
  },
  disconnected: (ws, data) => {
    return { type: ActionTypes.WS_DISCONNECTED, payload: { ws, data } };
  },
  error: (ws, data) => {
    return { type: ActionTypes.WS_ERROR, payload: { ws, data } };
  },
  message: (ws, data) => {
    return { type: ActionTypes.WS_MESSAGE, payload: { ws, data } };
  },
  setAllowReconnect: (enabled) => {
    return { type: ActionTypes.WS_SET_ALLOW_RECONNECT, payload: { enabled } };
  },
};

export default function createWsMiddleware() {
  return (store) => {
    let wsInstance = null;
    let allowReconnect = false;
    let url;
    let onFail;
    let connectTries = 0;

    return (next) => async (action) => {
      switch (action.type) {
        case ActionTypes.WS_CONNECT: {
          if (wsInstance) {
            return;
          }
          url = action.payload.url;
          onFail = action.payload.onFail;
          connectTries = 1;
          wsInstance = setupSocket(store, url, onFail);
          break;
        }
        case ActionTypes.WS_RECONNECT: {
          if (wsInstance || !url) {
            return;
          }
          connectTries = 1;
          wsInstance = setupSocket(store, url, onFail);
          break;
        }
        case ActionTypes.WS_ERROR: {
          //console.log(' ===== PROXY: unable to connect to ' + Utils.getServerUrl());
          let usingAltBackend = await UserPrefs.switchUsingAltBackend();
          console.log(
            ' ===== PROXY: switching to ' +
              (usingAltBackend ? 'ALT backend' : 'DEFAULT backend') +
              ', tries: ' +
              connectTries
          );
          if (connectTries > 0) {
            connectTries--;
            url = Utils.getServerUrl();
            console.log(' ===== PROXY: trying to reconnect: ' + url + ', ' + UserPrefs.all.usingAltBackend);
            wsInstance = setupSocket(store, url, onFail);
          }
          break;
        }
        case ActionTypes.WS_DISCONNECT: {
          const allowed = action.payload.allowReconnect;
          if ('undefined' !== typeof allowed && null != allowed) {
            allowReconnect = allowed;
          }
          console.log('action disconnect called, allowReconnect: ' + allowReconnect);
          if (wsInstance) {
            console.log('disconnected');
            wsInstance.close();
            wsInstance = null;
          }
          break;
        }
        case ActionTypes.WS_DISCONNECTED: {
          console.log('wsmiddleware: ws_disconnected, allowReconnect=' + allowReconnect);
          wsInstance = null;
          if (allowReconnect) {
            setTimeout(() => {
              if (null == wsInstance) {
                store.dispatch(ActionCreators.connect(url));
              }
            }, 5000);
          }
          break;
        }
        case ActionTypes.WS_SEND: {
          if (wsInstance) {
            try {
              //console.log(action.payload.data);
              wsInstance.send(action.payload.data);
            } catch (e) {
              try {
                wsInstance.close();
              } catch (ee) {}
              wsInstance = null;
            }
          }
          break;
        }
        case ActionTypes.WS_SET_ALLOW_RECONNECT: {
          allowReconnect = action.payload.enabled;
          break;
        }
      }
      return next(action);
    };

    function setupSocket(store, url, onFail) {
      let ws = new WebSocket(url);
      ws.wasConnected = false;
      ws.wasError = false;
      console.log(' == setup socket: ' + url);
      ws.onmessage = (data) => {
        store.dispatch(ActionCreators.message(ws, data));
      };
      ws.onopen = () => {
        console.log('onopen');
        ws.wasConnected = true;
        store.dispatch(ActionCreators.connected(ws));
      };
      ws.onclose = (data) => {
        const code = data.code;
        console.log('onclose, code: ' + code);
        store.dispatch(ActionCreators.disconnected(ws, { code }));
        if (!ws.wasConnected && onFail && !ws.wasError) {
          onFail();
        }
        ws.wasConnected = false;
      };
      ws.onerror = async (data) => {
        ws.wasError = connectTries > 0;
        console.log('onerror: failed to connect to: ' + url);
        store.dispatch(ActionCreators.error(ws, data));
      };
      return ws;
    }
  };
}
