import React, { Fragment } from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements';
import KsAlign from '../../atom/KsAlign/index';
import { popupActionCreators } from '../../../reducers/popupRedux';

interface ShareAboutBlockProps {
  color?: string;
  size?: number;
  onAboutPress?: ({ }) => void;
  style?: ViewStyle;
  userId: number;
  objects: {};
  popupInviteFriendShowHide: () => void;
  isHeader?: boolean;
  onSettingsPress?: () => void;
};

const ShareAboutBlock: React.FC<ShareAboutBlockProps> = (props) => {
  const {
    userId,
    objects,
    popupInviteFriendShowHide,
    isHeader = false,
    onSettingsPress,
    color,
    size,
    onAboutPress,
    style,
  } = props;
  const {
    container,
    btn,
    shareIconIOS,
    settingsIcon,
    shareIconAndroid,
  } = styles;
  const isIOS = Platform.OS === 'ios';

  return (
    isHeader
      ? <Fragment>
        <KsAlign
          axis="horizontal"
          alignItems="center"
          elementsGap={10}
          style={style}>
          <TouchableOpacity onPress={popupInviteFriendShowHide}>
            {isIOS
              ? <Icon
                name="share-apple"
                type="evilicon"
                color={color || '#000000'}
                size={size || 32} />
              : <Icon
                name="share-google"
                type="evilicon"
                color={color || '#000000'}
                size={size || 32} />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAboutPress({ userId, objects })}
            style={{ marginBottom: 0 }} >
            <Icon
              name="question"
              type="evilicon"
              color={color || '#000000'}
              size={size || 32} />
          </TouchableOpacity>
        </KsAlign>
      </Fragment>
      : <View style={[container, style, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity
          onPress={popupInviteFriendShowHide}
          style={btn}>
          <Image
            source={isIOS
              ? require('../../../img/map_share_ios.png')
              : require('../../../img/map_share_android.png')}
            style={isIOS ? shareIconIOS : shareIconAndroid} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSettingsPress}
          style={[btn, { marginLeft: 15 }]}>
          <Image
            source={require('../../../img/map_settings.png')}
            style={settingsIcon} />
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  container: {
    flexDirection: 'row',
  },
  shareIconAndroid: {
    width: 21,
    height: 25,
  },
  settingsIcon: {
    width: 27,
    height: 27,
  },
  shareIconIOS: {
    width: 19,
    height: 19,
  },
});

const mapStateToProps = (state) => {
  const { objects } = state.controlReducer;
  const { userId } = state.authReducer;

  return {
    objects,
    userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    popupInviteFriendShowHide: bindActionCreators(popupActionCreators.popupInviteFriendShowHide, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareAboutBlock);
