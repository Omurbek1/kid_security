import React, { Component } from 'react';
import { View, Text, Image, Linking } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';

import Const from '../Const';
import { shareApp } from '../Utils';
import { Icon } from 'react-native-elements';

const defaultProps = {
  visible: false,
};

export default class ShareAppPane extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={styles.addPhonePaneContent}>
          <TouchableOpacity style={styles.cancel_button} onPress={this.props.onPressCancel}>
            <Icon iconColor="black" name="ios-close-circle-outline" type="ionicon" size={32} />
          </TouchableOpacity>

          <Image source={require('../img/virus.png')} style={styles.image} />
          <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: 16, marginBottom: 20, color: '#000' }}>
            {L('corona_virus_pane_title')}
          </Text>
          <Text style={{ textAlign: 'center', fontWeight: 'normal', fontSize: 14, marginBottom: 20, color: '#000' }}>
            {L('corona_virus_pane_text')}
          </Text>
          <TouchableOpacity
            color="white"
            style={[styles.button, styles.shadow]}
            onPress={async () => {
              const shared = await shareApp(Const.CORONA_SHARE_URL, L('corona_share_text'));
              if (shared && this.props.onPressCancel) {
                this.props.onPressCancel(shared);
              }
            }}>
            <Text style={{ fontWeight: '900', fontSize: 18, color: 'white' }}>{L('share')}</Text>
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
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '5%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',

    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  text1: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text2: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text3: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 45,
    backgroundColor: '#62d152',
    borderRadius: 6,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button_text: {
    color: 'white',
  },
  cancel_button: {
    position: 'absolute',
    right: 10,
    marginTop: 10,
    marginRight: 0,
  },
});
