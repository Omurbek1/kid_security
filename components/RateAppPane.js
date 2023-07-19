import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '../lang/Lang';

const defaultProps = {
  visible: false,
};

export default class RateAppPa extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={styles.addPhonePaneContent}>
          <Text style={styles.text3}>{L('rate_app_and_get_free_minutes')}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel_button} onPress={this.props.onPressCancel}>
              <Text style={styles.cancel_button_text}>{L('later')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              color="white"
              style={styles.button}
              onPress={() => {
                if (this.props.onPressRate) {
                  this.props.onPressRate();
                }
                //NavigationService.navigate('BuyPremium');
              }}>
              <Text style={styles.button_text}>{L('rate')}</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    padding: '5%',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addPhonePaneContent: {
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderColor: '#FF666F',
    borderWidth: 0,
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 5,
    maxWidth: 280,
  },
  image: {
    width: 120,
    height: 120,
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
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
    color: '#000',
  },
  button_text: {
    color: 'white',
  },
  buttons: {
    paddingTop: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#FF666F',
    borderRadius: 6,
    width: 100,
  },
  cancel_button: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 6,
    borderColor: '#FF666F',
    borderWidth: 1,
  },
  cancel_button_text: { color: '#000' },
});
