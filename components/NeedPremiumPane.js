import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';

import Const from '../Const';

const defaultProps = {
  visible: false,
  marginTop: 0,
};

export default class NeedPremiumPane extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={[styles.addPhonePaneContent, { marginTop: props.marginTop }]}>
          <Image source={require('../img/ic_need_premium.png')} style={styles.image} />
          <Text style={styles.text1}>{L('premium_account')}</Text>
          <Text style={styles.text3}>{L('need_premium')}</Text>
          <TouchableOpacity
            color="white"
            style={styles.button}
            onPress={() => {
              if (this.props.onPressSubscribe) {
                this.props.onPressSubscribe();
              };

              props.showHidePremiumModal();
            }}>
            <Text style={styles.button_text}>{L('dialog_subscribe')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel_button} onPress={this.props.onPressCancel}>
            <Text style={styles.cancel_button_text}>{L('ill_subscribe_it_later')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  addPhonePane: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '5%',
    paddingTop: 20 + Const.HEADER_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 120,
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  text2: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text3: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 45,
    backgroundColor: '#FF666F',
    borderRadius: 6,
  },
  button_text: {
    color: 'white',
  },
  cancel_button: {},
  cancel_button_text: { color: '#000' },
});
