import React, { FunctionComponent, useEffect } from 'react';
import { Linking, Text, StyleSheet, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BottomTabNavigationEventMap, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  EventListenerCallback,
  NavigationContainer,
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { controlActionCreators } from '../reducers/controlRedux';
import { ActionCreators as controlMiddlewareActionCreators } from '../wire/ControlMiddleware';
import { L } from '../lang/Lang';
import DemoMapPage from './DemoMapPage';
import ChatPage from './ChatPage';
import MenuPage from './MenuPage';
import MapPage from './MapPage';
import { TabBar } from '../components';
import ShareAboutBlock from '../components/molecules/ShareAboutBlock';
import Const from '../Const';
import {
  firebaseAnalitycsLogEvent,
  firebaseAnalyticsForNavigation,
  mappingRouteAndScreenName,
} from '../analytics/firebase/firebase';
import { handleTabBarBackButton } from '../Utils';

const Tab = createBottomTabNavigator();

interface MainPageProps {
  navigation: {};
  activeOid: number;
  messageBadgeCounter: number;
  setCurrentChatOid: (oid: number) => void;
  getObjectVoiceMails: ({}) => void;
  setChatForObject: (oid: number, data: []) => void;
  clearMessageBadgeCounter: () => void;
  resetMessageBadge: () => void;
  markObjectMessagesReaded: (oid: number) => void;
  tabBarHistory: [];
  setTabBarHistory: (tabBarHistory: []) => void;
}

const MainPage: FunctionComponent<MainPageProps> = (props) => {
  const navigationRef = React.useRef<NavigationContainerRef<ParamListBase>>(null);
  const {
    activeOid,
    navigation,
    messageBadgeCounter,
    setTabBarHistory,
    tabBarHistory,
    setCurrentChatOid,
    getObjectVoiceMails,
    setChatForObject,
    clearMessageBadgeCounter,
    resetMessageBadge,
    markObjectMessagesReaded,
  } = props;

  const onBackButtonPress = () => {
    handleTabBarBackButton(navigationRef.current, navigation, tabBarHistory, setTabBarHistory);

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackButtonPress);
    };
  }, [onBackButtonPress]);

  const onSupportPress = ({ objects, userId }) => {
    const url = Const.compileSupportUrl(userId, objects);
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          const instructionsUrl = L('instructions_url');
          Linking.openURL(instructionsUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.warn('An error occurred', err));
  };

  const loadChats = () => {
    setCurrentChatOid(activeOid);
    getObjectVoiceMails(
      {
        oid: activeOid,
        withText: true,
        withHidden: false,
        limit: Const.CHAT_PRELOAD_LIMIT,
      },
      (pr, packet) => {
        const { data } = packet;

        if (data.result === 0) {
          setChatForObject(activeOid, data.list);
          clearMessageBadgeCounter();
          resetMessageBadge();
          markObjectMessagesReaded(activeOid);
        }
      }
    );
  };

  const analitycsForNavigation: EventListenerCallback<BottomTabNavigationEventMap, 'state'> = ({ data }) => {
    firebaseAnalyticsForNavigation(data?.state?.routes[data?.state?.index].params.analitycScreenName);
  };

  const isAfterDeletion = navigation.getParam !== undefined ? navigation.getParam('isAfterDeletion') : false;
  const { header } = styles;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        firebaseAnalitycsLogEvent(
          'screen_open',
          {
            screen_name: mappingRouteAndScreenName[isAfterDeletion ? 'DemoMap' : activeOid ? 'Map' : 'DemoMap'],
          },
          true
        );
      }}>
      <Tab.Navigator
        screenListeners={{
          tabPress: (tabProps) => {
            let screen_name;
            switch (tabProps.target.split('-')[0]) {
              case L('map'):
                screen_name = mappingRouteAndScreenName[isAfterDeletion ? 'DemoMap' : activeOid ? 'Map' : 'DemoMap'];
                break;
              case L('chat_menu'):
                screen_name = mappingRouteAndScreenName.Chat;
                break;
              case L('menu'):
                screen_name = mappingRouteAndScreenName.Menu;
                break;
            }
            firebaseAnalitycsLogEvent(
              'screen_open',
              {
                screen_name,
              },
              true
            );
          },
        }}
        tabBar={(props) => {
          return (
            <TabBar
              {...props}
              messageBadgeCounter={messageBadgeCounter}
              isExample={isAfterDeletion || !activeOid ? true : false}
              loadChats={loadChats}
              tabBarHistory={tabBarHistory}
              setTabBarHistory={setTabBarHistory}
            />
          );
        }}
        backBehavior="none">
        <Tab.Screen
          initialParams={{
            analitycScreenName: isAfterDeletion ? 'MapDemo' : activeOid ? 'Map' : 'MapDemo',
          }}
          name={L('map')}
          component={isAfterDeletion ? DemoMapPage : activeOid ? MapPage : DemoMapPage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          initialParams={{
            navigationRef,
          }}
          name={L('chat_menu')}
          component={ChatPage}
          options={{
            headerBackground: () => {
              return (
                <LinearGradient
                  style={{ flex: 1 }}
                  colors={['#ef4c77', '#fe6f5f', '#ff8048']}
                  start={[0, 0]}
                  end={[1, 0]}
                  locations={[0, 0.5, 1.0]}
                />
              );
            },
            headerRight: () => {
              return (
                <ShareAboutBlock
                  style={{ marginRight: 10 }}
                  size={32}
                  color="#FFFFFF"
                  onAboutPress={onSupportPress}
                  isHeader={true}
                />
              );
            },
            headerTitle: () => {
              return <Text style={header}>{L('menu_chat_with_kid')}</Text>;
            },
            headerTitleAlign: 'center',
          }}
        />
        <Tab.Screen
          initialParams={{
            analitycScreenName: 'Menu',
            navigationRef,
          }}
          name={L('menu')}
          component={MenuPage}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

const mapStateToProps = (state) => {
  const { activeOid, messageBadgeCounter, tabBarHistory } = state.controlReducer;

  return {
    activeOid,
    messageBadgeCounter,
    tabBarHistory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getObjectVoiceMails: bindActionCreators(controlActionCreators.getObjectVoiceMails, dispatch),
    setChatForObject: bindActionCreators(controlActionCreators.setChatForObject, dispatch),
    resetMessageBadge: bindActionCreators(controlActionCreators.resetMessageBadge, dispatch),
    clearMessageBadgeCounter: bindActionCreators(controlMiddlewareActionCreators.clearMessageBadgeCounter, dispatch),
    markObjectMessagesReaded: bindActionCreators(controlActionCreators.markObjectMessagesReaded, dispatch),
    setCurrentChatOid: bindActionCreators(controlActionCreators.setCurrentChatOid, dispatch),
    setTabBarHistory: bindActionCreators(controlActionCreators.setTabBarHistory, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
