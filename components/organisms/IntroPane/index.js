import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Linking, StatusBar, Platform } from 'react-native';
import { slideTypes } from './types';
import { state as initialState } from './state';
import { bindActionCreators } from 'redux';
import { controlActionCreators } from '../../../reducers/controlRedux';
import PurchasePage from './PurchasePage';
import SkipPage from './SkipPage';
import WelcomeSlider from './WelcomeSlider';
import LoadingPage from './LoadingPage';
import CompletePage from './CompletePage';
import DonePage from './DonePage';
import { ActionCreators as controlMiddlewareActionCreators } from '../../../wire/ControlMiddleware';
import firebase from '@react-native-firebase/app';
import { getUrlParams } from '../../../Utils';
import * as URI from 'uri-js';
import NavigationService from '../../../navigation/NavigationService';
import { setUrlActivation } from '../../../UserPrefs';
import { APIService } from '../../../Api';
import remoteConfig from '@react-native-firebase/remote-config';
import { APP_VERSION } from '../../../shared/constants';
import OnboardingSlider from 'components/ABTesting/displayAppFunction/OnboardingSlider';

export const borders = 0;

function IntroPane(props) {
  if ('ios' !== Platform.OS) {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
  }

  let { objects, activatePremium, linkInviteToken } = props;
  let { activateProviderPremium } = props;
  let { authorizationInProgress, authorized } = props;
  let [state, setState] = useState({ ...initialState(), objects: objects });

  const loadUrlHandler = async () => {
    await setUrlActivation(false);
    firebase
      .dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link) {
          const url = link.url;
          console.log(' !!!! DEEP_LINKING: ' + url);
          const { action, initiator, token } = getUrlParams(URI.parse(url).query);
          //console.log(' :: DEEP_LINKING:' + action + ', ' + initiator + ', ' + token);
          if ('invite' === action) {
            linkInviteToken({ initiator, token }, function (pr, packet) {
              //console.log(' :: linkInviteToken: ', packet);
            });
          }
        }
      });
    Linking.addEventListener('url', (deeplink) => {
      console.log(' !!!! URL_DEEP_LINKING: ' + deeplink.url);
      processDeepLinking(deeplink.url);
    });

    const deeplink = await Linking.getInitialURL();
    if (deeplink) {
      console.log(' !!!! URL_DEEP_LINKING: INITIAL: ' + deeplink);
      processDeepLinking(deeplink);
    }
    setState((prev) => ({ ...prev, initUrl: true }));
  };
  const checkPremiumHandler = async () => {
    const { premiumReallyPaid } = props;
    return premiumReallyPaid;
  };

  function processDeepLinking(link) {
    if (!link) {
      return;
    }
    const arr = link.split('://');
    if (arr.length < 2) {
      return;
    }

    const url = new URL('http://z.zzz/' + arr[1]);
    switch (url.pathname) {
      case '/activate': {
        tryActivatePremium(url);
        break;
      }
    }
  }
  function tryActivatePremium(url) {
    const code = url.searchParams.get('q');
    if (!code) {
      return; // alert('no code!');
    }
    activatePremium(code, (pr, packet) => {
      if (packet && packet.data && 0 == packet.data.result) {
        setState((prev) => ({ ...prev, hasPremium: true }));
        activateProviderPremium(true);
        setUrlActivation(true).then(() => {
          NavigationService.navigate('ActivationSuccess');
        });
      } else {
        const errorCode = packet && packet.data ? packet.data.error : -1;
        NavigationService.navigate('ActivationFail', { secret: code, errorCode });
      }
    });
  }

  useEffect(() => {
    if (state.initUrl) {
      checkPremiumHandler().then((res) => {
        setState((prev) => ({ ...prev, hasPremium: res }));
        activateProviderPremium(res);
        setState((prev) => ({ ...prev, initPremium: true }));
      });
    }
  }, [state.initUrl]);
  useEffect(() => {
    if (!authorizationInProgress && authorized) {
      loadUrlHandler().finally(() => {
        setState((prev) => ({ ...prev, initUrl: true }));
      });
    }
  }, [authorizationInProgress, authorized]);
  useEffect(() => {
    APIService.initialize();
  }, []);

  const loadRemote = remoteConfig().getValue('additional_options').asString();
  let isShowPaywall = false;

  if (loadRemote) {
    let OS_FIREBASE_PAYWALL_VERSION =
      Platform.OS === 'ios'
        ? 'apple_required_version_for_the_first_paywall'
        : 'android_required_version_for_the_first_paywall';
    try {
      isShowPaywall = +APP_VERSION <= +JSON.parse(loadRemote)[OS_FIREBASE_PAYWALL_VERSION];
    } catch {}
  }

  const { iapItemsError } = props;

  switch (state.type) {
    case slideTypes.ONBOARDING:
      return <OnboardingSlider context={state} setContext={setState} />;
    case slideTypes.STORE:
      return iapItemsError || !isShowPaywall ? (
        <DonePage context={state} setContext={setState} />
      ) : (
        <PurchasePage context={state} setContext={setState} />
      );
    case slideTypes.DISCOUNT:
      return <SkipPage context={state} setContext={setState} />;
    case slideTypes.LOADING:
      return <LoadingPage context={state} setContext={setState} />;
    case slideTypes.COMPLETE:
      return <CompletePage context={state} setContext={setState} />;
    case slideTypes.DONE:
      return <DonePage context={state} setContext={setState} />;
    case slideTypes.WELCOME:
    default:
      return <WelcomeSlider context={state} setContext={setState} />;
  }
}

const mapStateToProps = (state) => {
  let { monthlyPrice, yearlyPrice, halfYearlyPrice, foreverPrice, products, iapItemsError } = state.controlReducer;
  const { objects, premiumValid, wireValid, premiumReallyPaid, providerPremium } = state.controlReducer;
  const { premium, demo, username, userId, premiumUser, authorizationInProgress, authorized } = state.authReducer;
  return {
    premiumUser,
    authorizationInProgress,
    authorized,
    providerPremium,
    premium,
    premiumReallyPaid,
    store: state.introReducer,
    products,
    prices: { monthlyPrice, yearlyPrice, halfYearlyPrice, foreverPrice },
    iapItemsError,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    linkInviteToken: bindActionCreators(controlActionCreators.linkInviteToken, dispatch),
    setUserAdId: bindActionCreators(controlMiddlewareActionCreators.setUserAdId, dispatch),
    activatePremium: bindActionCreators(controlActionCreators.activatePremium, dispatch),
    setPremiumValid: bindActionCreators(controlActionCreators.setPremiumValid, dispatch),
    setPrices: bindActionCreators(controlActionCreators.setPrices, dispatch),
    setPremiumThanksVisible: bindActionCreators(controlActionCreators.setPremiumThanksVisible, dispatch),
    activateProviderPremium: bindActionCreators(controlActionCreators.activateProviderPremium, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroPane);
