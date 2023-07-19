import React from 'react';
import { AppState, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RootStack from './navigation/RootStack';
import NavigationService from './navigation/NavigationService';
import { ActionCreators as wsActionCreators } from './wire/WsMiddleware';
import * as Metrica from './analytics/Analytics';
import DropdownAlert from 'react-native-dropdownalert';
import Toast from './Toast';
import * as Utils from './Utils';
import appsFlyer from 'react-native-appsflyer';
import { CustomAlert } from './components';

var onAppOpenAttributionCanceller = appsFlyer.onAppOpenAttribution((res) => {
  console.log(res);
});

var onDeepLinkCanceller = appsFlyer.onDeepLink((res) => {
  console.log('onDeepLinking: ' + JSON.stringify(res));
});
// todo: send handled data details to backend
var onInstallConversionDataCanceller = appsFlyer.onInstallConversionData((res) => {
  //console.log('APPSFLYER ---> ', res);
});

class MyApp extends React.Component {
  appState = '';

  _disconnect = null;
  _timer = null;

  _handleAppStateChange = (nextAppState) => {
    const { loggedOut, onlineListeningStatus } = this.props;

    if (('inactive' === this.appState || 'background' === this.appState) && nextAppState === 'active') {
      console.log('App RESTORE');
      if (!loggedOut) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
          this._reconnect();
        }, 1000);
      }
    } else if ('active' === this.appState && ('inactive' === nextAppState || 'background' === nextAppState)) {
      if (!onlineListeningStatus) {
        console.log('App BACKGROUND');
        /*console.log('_____');
        console.log(this.props);
        console.log('_____');*/
        Utils.updateAppStopTs();
        if (this._timer) {
          clearTimeout(this._timer);
          this._timer = null;
        }
        this._disconnect(false);
      } else {
        console.log('App LISTENING');
      }
    }
    this.appState = nextAppState;
  };

  constructor(props) {
    super(props);
    //console.log(' ======================= \n\r', this.appType);
    //this.appType = props.hasOwnProperty("");
    //this.appType = props.hasOwnProperty('test');
    //this.appType = Object.prototype.hasOwnProperty.call(props, 'test');
    //console.log(' ======================= \n\r', this.appType);
    //console.log(' ======================= \n\r', this.props);
  }

  async UNSAFE_componentWillMount() {
    this.appState = AppState.currentState;
    try {
      Metrica.init();
    } catch (e) {
      console.warn(e);
    }

    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  async componentDidMount() {
    appsFlyer.initSdk(
      {
        devKey: 'iCLCknmaUdv4KzirDsgNph',
        isDebug: __DEV__ ? true : false,
        appId: '1450358983',
        onInstallConversionDataListener: true, //Optional
        onDeepLinkListener: true, //Optional
      },
      (result) => {
        console.log('appsflyer result', result);
      },
      (error) => {
        console.error('appsflyer error', error);
      }
    );

    const { disconnect, reconnect } = this.props;
    this._reconnect = reconnect;
    this._disconnect = disconnect;

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    // Optionaly remove listeners for deep link data if you no longer need them after componentWillUnmount
    if (onInstallConversionDataCanceller) {
      onInstallConversionDataCanceller();
      console.log('unregister onInstallConversionDataCanceller');
      onInstallConversionDataCanceller = null;
    }
    if (onAppOpenAttributionCanceller) {
      onAppOpenAttributionCanceller();
      console.log('unregister onAppOpenAttributionCanceller');
      onAppOpenAttributionCanceller = null;
    }
    if (onDeepLinkCanceller) {
      onDeepLinkCanceller();
      console.log('unregister onDeepLinkCanceller');
      onDeepLinkCanceller = null;
    }
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  onTap(data) {
    if (data && data.payload && data.payload.onTap) {
      data.payload.onTap(data);
    }
  }

  render() {
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <RootStack
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
        <DropdownAlert
          ref={(ref) => Toast.setRef(ref)}
          closeInterval={5000}
          translucent={true}
          inactiveStatusBarStyle="dark-content"
          onTap={this.onTap}
        />
        {this.props.alertObj.isVisible && <CustomAlert />}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { authReducer, popupReducer } = state;
  const { loggedOut } = authReducer;
  const { alertObj } = popupReducer;

  return {
    loggedOut,
    onlineListeningStatus: state.controlReducer.onlineListeningStatus,
    alertObj,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    disconnect: bindActionCreators(wsActionCreators.disconnect, dispatch),
    reconnect: bindActionCreators(wsActionCreators.reconnect, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyApp);
