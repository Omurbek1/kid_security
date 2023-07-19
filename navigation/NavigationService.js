import { NavigationActions, StackActions } from 'react-navigation';
import * as Metrica from '../analytics/Analytics';
import { firebaseAnalyticsForNavigation } from '../analytics/firebase/firebase';

let _navigator;
let _drawer;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function setDrawer(navigatorRef) {
  _drawer = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
  Metrica.event('open_page', { name: routeName });
  firebaseAnalyticsForNavigation(routeName);
}

function back() {
  _navigator.dispatch(NavigationActions.back());
}

function replace(routeName, params) {
  navigate(routeName, params);
  firebaseAnalyticsForNavigation(routeName);
  /*_navigator.dispatch(
        StackActions.replace({
            routeName,
            params,
        })
    );*/
}

function forceReplace(routeName, params) {
  /*_navigator.dispatch(
    StackActions.replace({
      index: 0,
      routeName,
      params,
    })
  );*/
  _navigator.dispatch(
    StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName,
          params,
        }),
      ],
    })
  );
  Metrica.event('open_page', { name: routeName });
  firebaseAnalyticsForNavigation(routeName);
}

function forceReplaceAndClearStack(routeName, params) {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName, params })],
  });

  _navigator.dispatch(resetAction);
  /*_navigator.dispatch(
        StackActions.replace({
            routeName,
            params,
        })
    );*/
  Metrica.event('open_page', { name: routeName });
  firebaseAnalyticsForNavigation(routeName);
}

function navigateDrawer(routeName, params) {
  _drawer.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
  firebaseAnalyticsForNavigation(routeName);
}

function openDrawer(routeName, params) {
  _drawer.dispatch(DrawerActions.openDrawer());
  firebaseAnalyticsForNavigation(routeName);
}

function currentPageName() {
  const { routes } = _navigator.state.nav;
  if (0 === routes.length) {
    return null;
  }
  return routes[routes.length - 1].routeName;
}

// add other navigation functions that you need and export them

export default {
  navigate,
  replace,
  forceReplace,
  setTopLevelNavigator,
  setDrawer,
  navigateDrawer,
  openDrawer,
  back,
  currentPageName,
  forceReplaceAndClearStack,
};
