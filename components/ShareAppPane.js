import React, { Component } from 'react';
import { View, Text, Image, Linking } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '../lang/Lang';
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

          <Image source={require('../img/ic_share_friends.png')} style={styles.image} />
          <Text style={styles.text1}>{L('share_app_with_friends')}</Text>
          <TouchableOpacity
            color="white"
            style={styles.button}
            onPress={async () => {
              const shared = await shareApp();
              if (shared && this.props.onPressCancel) {
                this.props.onPressCancel();
              }
            }}>
            <Text style={styles.button_text}>{L('share')}</Text>
          </TouchableOpacity>

          <Text style={styles.text1}>{L('or_take_the_test')}</Text>
          <TouchableOpacity
            color="white"
            style={styles.button}
            onPress={() => {
              Linking.openURL(Const.TAKE_TEST_URL);
              if (this.props.onPressCancel) {
                this.props.onPressCancel();
              }
            }}>
            <Text style={styles.button_text}>{L('take_the_test')}</Text>
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
    zIndex: 3,
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
    paddingTop: 0,
    paddingBottom: 15,
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 5,
  },
  text1: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
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
    backgroundColor: '#FF666F',
    borderRadius: 6,
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
