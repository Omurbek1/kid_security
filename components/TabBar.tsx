import React, { FunctionComponent } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';

const { width, height } = Dimensions.get('window');
const { PINK_COLOR_1, GREY_COLOR_2 } = NewColorScheme;

interface TabBarProps {
  state: {};
  descriptors: {};
  navigation: {};
  messageBadgeCounter: number;
  isExample: boolean;
  loadChats: () => void;
  tabBarHistory: [];
  setTabBarHistory: (tabBarHistory: []) => void;
};

const TabBar: FunctionComponent<TabBarProps> = props => {
  const {
    state,
    descriptors,
    navigation,
    messageBadgeCounter,
    isExample,
    loadChats,
    tabBarHistory,
    setTabBarHistory,
  } = props;
  const {
    mapIcon,
    chatIcon,
    menuIcon,
    menuLabel,
    tabBarContainer,
    tabBarBtn,
    badgeIcon,
  } = styles;
  let tabHistory = tabBarHistory;
  const historyLength = tabBarHistory.length;

  return (
    <View style={tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const { tabBarAccessibilityLabel, tabBarTestID } = options;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          EventRegister.emit('clickOutsideDeleteBtn');

          const name = route.name;

          switch (name) {
            case L('map'): {
              if (tabBarHistory[historyLength - 1] !== L('map')) {
                tabHistory.push(L('map'));
              };

              StatusBar.setBarStyle('dark-content');
              break;
            }
            case L('chat_menu'): {
              if (tabBarHistory[historyLength - 1] !== L('chat_menu')) {
                tabHistory.push(L('chat_menu'));
              };

              loadChats();
              StatusBar.setBarStyle('light-content');
              break;
            }
            case L('menu'): {
              if (tabBarHistory[historyLength - 1] !== L('menu')) {
                tabHistory.push(L('menu'));
              };

              StatusBar.setBarStyle('dark-content');
              break;
            };
          };

          setTabBarHistory(tabHistory);

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name, merge: true });
          }
        };

        const iconColor = isFocused ? PINK_COLOR_1 : GREY_COLOR_2;

        let icon;
        let iconStyle;
        let screen = route.name;

        if (screen === L('map')) {
          icon = isFocused ? require('../img/map_focused.png') : require('../img/map_unfocused.png');
          iconStyle = mapIcon;
        } else if (screen === L('chat_menu')) {
          icon = isFocused ? require('../img/chat_focused.png') : require('../img/chat_unfocused.png');
          iconStyle = chatIcon;
        } else {
          icon = isFocused ? require('../img/menu_focused.png') : require('../img/menu_unfocused.png');
          iconStyle = menuIcon;
        }

        return (
          <TouchableWithoutFeedback
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={tabBarAccessibilityLabel}
            testID={tabBarTestID}
            onPress={onPress}>
            <View style={[tabBarBtn, label === L('menu') && { marginTop: height / 45 }]}>
              <View>
                {label === L('chat_menu') && messageBadgeCounter !== 0 && !isExample && <View style={badgeIcon} />}
                <Image source={icon} style={iconStyle} resizeMode="contain" />
              </View>
              <Text style={[menuLabel, { color: iconColor }]}>{label}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mapIcon: {
    width: width / 19,
    height: height / 30,
  },
  chatIcon: {
    width: width / 14,
    height: height / 30,
  },
  menuIcon: {
    width: width / 14,
    height: height / 41,
  },
  menuLabel: {
    fontSize: width / 34.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    marginTop: 6,
  },
  tabBarContainer: {
    height: height / 10,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  tabBarBtn: {
    flex: 1,
    alignItems: 'center',
    marginTop: height / 64,
  },
  badgeIcon: {
    width: width / 20.7,
    height: width / 20.7,
    borderRadius: 100,
    position: 'absolute',
    bottom: '50%',
    right: '14%',
    backgroundColor: PINK_COLOR_1,
    zIndex: 1,
  },
});

export default TabBar;
