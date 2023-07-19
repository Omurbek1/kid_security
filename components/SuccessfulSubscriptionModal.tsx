import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { L } from '../lang/Lang';
import { NewColorScheme } from '../shared/colorScheme';
import { GradientButton } from '../components';
import { shareApp } from '../Utils';

const { width, height } = Dimensions.get('window');
const { BLACK_COLOR } = NewColorScheme;

interface SuccessfulSubscriptionModalProps {
  onCloseModal: () => void;
  isVisible: boolean;
  thanksText: string;
}

const SuccessfulSubscriptionModal: FunctionComponent<SuccessfulSubscriptionModalProps> = (props) => {
  const { onCloseModal, isVisible, thanksText } = props;
  const { gradient, container, wrapper, closeBtn, closeImg, mediumWrapper, image, shareText, activatedText } = styles;

  const onShareApp = async () => {
    await shareApp()
      .then((res) => {
        if (res) onCloseModal();
      })
      .catch((error) => console.log('error sharing app', error));
  };

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={container}>
        <View style={wrapper}>
          <TouchableOpacity onPress={onCloseModal} style={closeBtn}>
            <Image source={require('../img/close_black.png')} style={closeImg} />
          </TouchableOpacity>
          <View style={mediumWrapper}>
            <Image source={require('../img/success_subscription.png')} style={image} />
            <Text style={activatedText}>{thanksText}</Text>
            <Text style={shareText}>{L('share_this_app')}</Text>
            <GradientButton title={L('share')} onPress={onShareApp} gradientStyle={gradient} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: 181,
    marginVertical: 53,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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
  mediumWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width / 3,
    height: height / 6,
    marginBottom: 27,
  },
  shareText: {
    fontSize: width / 29.5,
    fontWeight: '400',
    color: BLACK_COLOR,
    textAlign: 'center',
    width: '70%',
  },
  activatedText: {
    fontSize: width / 23,
    fontWeight: '700',
    color: BLACK_COLOR,
    marginBottom: 12,
  },
});

export default SuccessfulSubscriptionModal;
