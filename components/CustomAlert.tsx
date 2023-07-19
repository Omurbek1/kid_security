import React from 'react';
import { Modal, View, TouchableOpacity, Text, Image, StyleSheet, BackHandler, Dimensions, Linking } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LinearGradient } from 'expo-linear-gradient';
import { popupActionCreators } from '../reducers/popupRedux';
import { L } from '@lang';

import Const from '../Const';
import { NewColorScheme } from '../shared/colorScheme';
import GradientButton from './GradientButton';

const { width, height } = Dimensions.get('window');
const { PINK_COLOR_1, ORANGE_COLOR_1, BLACK_COLOR, GREY_COLOR_1, GREY_COLOR_2 } = NewColorScheme;

interface CustomAlertProps {
  alertObj: {};
  objects: {};
  userId: number;
}

class CustomAlert extends React.Component<CustomAlertProps> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { alertObj } = this.props;

    if (alertObj.isVisible) {
      this.onHideAlert();
      return true;
    }

    return false;
  };

  onChatWithTechSupport = async () => {
    const { objects, userId } = this.props;

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
      .catch((err) => console.warn('Error opening chat with tech support', err));
    this.onHideAlert();
  };

  onHideAlert = () => {
    this.props.showAlert(false, '', '');
  };

  render() {
    const { alertObj } = this.props;
    const { isVisible, title, subtitle, isSupportVisible, supportText, actionTitle, actions } = alertObj;
    const {
      container,
      innerContainer,
      topWrapper,
      bottomWrapper,
      gradient,
      titleStyle,
      subtitleStyle,
      closeIcon,
      closeBtn,
      supportBtn,
      actionsWrapper,
      cancel,
      topActionBtn,
    } = styles;

    return (
      <Modal visible={isVisible} transparent={true} onRequestClose={this.onBackButtonPress}>
        <View style={container}>
          <View style={innerContainer}>
            <View style={topWrapper}>
              <LinearGradient
                colors={actionTitle ? [PINK_COLOR_1, PINK_COLOR_1] : [PINK_COLOR_1, ORANGE_COLOR_1]}
                start={[0, 0]}
                end={[1, 0]}
                locations={[0, 1.0]}
                style={gradient}>
                <Text style={titleStyle}>{title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    actions && actions[1] && actions[1]();
                    this.onHideAlert();
                  }}
                  style={closeBtn}>
                  <Image source={require('../img/close_white.png')} style={closeIcon} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
            <View style={bottomWrapper}>
              <Text style={subtitleStyle}>{subtitle}</Text>
              {isSupportVisible && (
                <Text onPress={this.onChatWithTechSupport} style={supportBtn}>
                  {supportText ? supportText : L('contact_support_via_chat').replace(/(\r\n|\n|\r)/gm, ' ')}
                </Text>
              )}
              {actions && (
                <View style={actionsWrapper}>
                  <GradientButton title={actionTitle} onPress={actions[0]} gradientStyle={topActionBtn} />
                  <Text
                    style={cancel}
                    onPress={() => {
                      actions[1] && actions[1]();
                      this.onHideAlert();
                    }}>
                    {L('cancel')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  topWrapper: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  bottomWrapper: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: width / 13,
    paddingVertical: width / 17,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: width / 24,
  },
  titleStyle: {
    fontSize: width / 16,
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitleStyle: {
    fontSize: width / 23,
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  closeBtn: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: width / 20,
  },
  supportBtn: {
    fontSize: width / 29.5,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: GREY_COLOR_1,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  actionsWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    fontSize: width / 26,
    fontWeight: '400',
    fontFamily: 'Roboto-Regular',
    color: GREY_COLOR_2,
  },
  topActionBtn: {
    width: '100%',
    marginTop: width / 21,
    marginBottom: width / 34.5,
  },
});

const mapStateToProps = (state) => {
  const { controlReducer, authReducer, popupReducer } = state;
  const { objects } = controlReducer;
  const { userId } = authReducer;
  const { alertObj } = popupReducer;

  return {
    objects,
    userId,
    alertObj,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showAlert: bindActionCreators(popupActionCreators.showAlert, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomAlert);
