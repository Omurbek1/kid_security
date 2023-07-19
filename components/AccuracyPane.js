import React, { Component } from 'react';
import { View, Text, Image, Modal } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';

import { CheckBox } from 'react-native-elements';
import Const from '../Const';
import * as Metrica from '../analytics/Analytics';
import UserPrefs from 'UserPrefs';

const defaultProps = {
  visible: false,
};

export default class AccuracyPane extends Component {
  state = {
    checked: false,
  };

  onUnderstandClick() {
    const { onPressCancel } = this.props;
    UserPrefs.setGpsDialogTs(new Date().getTime());
    UserPrefs.setDontShowGpsDialog(this.state.checked);
    if (onPressCancel) {
      Metrica.event('funnel_gps_accuracy_pane', { dontShow: this.state.checked });
      onPressCancel();
    }
  }

  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <Modal visible={props.visible} transparent={true}>
        <View pointerEvents="auto" style={styles.addPhonePane}>
          <View style={styles.addPhonePaneContent}>
            <Image source={require('../img/ic_big_satellite.png')} style={styles.image} />
            <Text style={styles.text1}>{L('gps_error_possible')}</Text>
            <View style={styles.explain}>
              <Text style={styles.text2}>{L('gps_outdoor_accuracy')}</Text>
              <Text style={styles.text2}>{L('gps_indoor_accuracy')}</Text>
            </View>
            <TouchableOpacity color="white" style={styles.button} onPress={this.onUnderstandClick.bind(this)}>
              <Text style={styles.button_text}>{L('understand')}</Text>
            </TouchableOpacity>
            <View style={styles.checkbox_outer}>
              <CheckBox
                containerStyle={styles.checkbox}
                iconType="ionicon"
                checkedIcon="ios-checkbox"
                uncheckedIcon="ios-square-outline"
                checkedColor="#FF666F"
                size={32}
                checked={this.state.checked}
                onPress={() => this.setState({ checked: !this.state.checked })}></CheckBox>
              <View style={styles.checkbox_text_outer}>
                <Text style={styles.checkbox_text}>{L('dont_show_again')}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#000',
  },
  text2: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#000',
  },
  explain: {
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 20,
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
  cancel_button_text: {},
  checkbox_outer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    maxWidth: 45,
    padding: 0,
    margin: 0,
  },
  checkbox_text_outer: {},
  checkbox_text: { color: '#000' },
});
