import { L } from '../lang/Lang';
import { LinearGradient } from 'expo-linear-gradient';
import ShareAboutBlock from '../components/molecules/ShareAboutBlock';
import React from 'react';
import Const from '../Const';
import { Linking, View } from 'react-native';
import { shareApp } from '../Utils';
import { AppColorScheme, NewColorScheme } from './colorScheme';
import { bindActionCreators } from "redux";
import { popupActionCreators, popupSelectors } from "../reducers/popupRedux";
import { connect, useSelector, useDispatch } from 'react-redux';

const { PINK_COLOR_1, ORANGE_COLOR_1 } = NewColorScheme;

function onSupportPress({ objects, userId }) {
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
}

function onSharePress() {
  shareApp();
}

interface HeaderConfig {
  title: string;
  noBackground?: boolean;
  noGradient?: boolean;
  noBorderRadius?: boolean;
  isOldHeader?: boolean;
}

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;

  const { userId, userProps } = state.authReducer;

  return {
    objects,
    userProps,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export const getHeader: (conf: HeaderConfig) => any = (
  {
    title,
    noBackground,
    noGradient,
    noBorderRadius,
    isOldHeader = true,
  }) => {
  //let qwe = useSelector(popupSelectors.getPopupInviteFriendVisible);
  //console.log(qwe);
  const header = {
    title: title,

    headerRight: (
      <ShareAboutBlock
        style={{ marginRight: 10 }}
        size={32}
        color="white"
        onAboutPress={onSupportPress}
        isHeader={true} />
    ),
    headerStyle: {
      borderBottomLeftRadius: noBorderRadius ? 0 : 15,
      borderBottomRightRadius: noBorderRadius ? 0 : 15,
      borderColor: 'transparent',
      overflow: 'hidden',
      borderBottomWidth: 0,
    },
    headerTransparent: noBackground ?? false,
    headerTitleStyle: {
      fontWeight: '600',
      fontSize: 16,
    },
  };
  if (!noBackground) {
    const gradientBgComponent = (
      <LinearGradient
        style={{ flex: 1 }}
        colors={isOldHeader ? ['#ef4c77', '#fe6f5f', '#ff8048'] : [PINK_COLOR_1, ORANGE_COLOR_1]}
        start={[0, 0]}
        end={[1, 0]}
        locations={isOldHeader ? [0, 0.5, 1.0] : [0, 1.0]} />
    );
    const plainBgComponent = <View style={{ flex: 1, backgroundColor: AppColorScheme.accent }} />;
    header['headerBackground'] = noGradient ? plainBgComponent : gradientBgComponent;
  }

  return header;
};
