import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Image, Text, Dimensions, Linking, BackHandler } from 'react-native';
import Const from '../Const';
import { L } from '@lang';

import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from './';

const { width } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface PinCodeNotReceivedModalProps {
  isVisible: boolean;
  onHide: () => void;
  objects: {};
  userId: number;
}

class PinCodeNotReceivedModal extends React.Component<PinCodeNotReceivedModalProps> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPress);
  }

  onBackButtonPress = () => {
    const { isVisible, onHide } = this.props;

    if (isVisible) {
      onHide();
      return true;
    }

    return false;
  };

  onChatWithSupport = () => {
    const { objects, userId, onHide } = this.props;

    const url = Const.compileSupportUrl(userId, objects);

    Linking.canOpenURL(url)
      .then((supported) => {
        if (onHide) onHide();

        if (!supported) {
          const instructionsUrl = L('instructions_url');
          Linking.openURL(instructionsUrl);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.warn('Error opening chat with support', err));
  };

  render() {
    const { isVisible, onHide } = this.props;
    const { container, closeBtn, closeImg, innerContainer, title, subtitle, button, textWrapper } = styles;

    return (
      <Modal visible={isVisible} transparent={true} onRequestClose={this.onBackButtonPress}>
        <View style={container}>
          <View style={innerContainer}>
            <TouchableOpacity onPress={onHide} style={closeBtn}>
              <Image source={require('../img/close_black.png')} style={closeImg} />
            </TouchableOpacity>
            <View style={textWrapper}>
              <Text style={title}>{L('contact_support_via_chat')}</Text>
              <Text style={subtitle}>
                {L('proverte')} <Text style={{ fontWeight: '700' }}>{L('ukazanogo')}</Text> {L('esliverno')}
              </Text>
            </View>
            <GradientButton title={L('pereiti')} gradientStyle={button} onPress={this.onChatWithSupport} />
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
  closeBtn: {
    alignSelf: 'flex-end',
    paddingTop: 25,
    paddingBottom: 15,
    paddingHorizontal: 23,
    width: '50%',
  },
  closeImg: {
    width: 16,
    height: 16,
    alignSelf: 'flex-end',
  },
  innerContainer: {
    width: width / 1.2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: BLACK_COLOR,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
    marginTop: 31,
  },
  button: {
    width: 154,
    marginTop: 41,
    marginBottom: 44,
  },
  textWrapper: {
    paddingHorizontal: width / 10,
  },
});

export default PinCodeNotReceivedModal;
