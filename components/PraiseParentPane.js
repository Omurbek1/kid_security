import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';

import CoolProgress from './CoolProgress';
import Const from '../Const';

const defaultProps = {
  visible: false,
};

export default class PraiseParentPane extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={styles.addPhonePaneContent}>
          <Image source={require('../img/ic_firework.png')} style={styles.firework} />
          <CoolProgress maxWidth={150} />
          <Text style={styles.text1}>{L('congrats')}</Text>
          <Text style={styles.text2}>{L('you_are_caring_parent')}</Text>
          <Text style={styles.text3}>{L('lets_connect_the_child')}</Text>
          <TouchableOpacity color="white" style={styles.button} onPress={this.props.onPress}>
            <Text style={styles.button_text}>{L('connect_child')}</Text>
          </TouchableOpacity>
          <CoolProgress title={L('completed_for')} showPercent={true} height={20} style={styles.big_progress} />
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
  firework: {
    width: 150,
    height: 150,
  },
  text1: {
    textAlign: 'center',
    fontSize: 32,
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
    fontSize: 18,
    marginTop: 10,
  },
  button: {
    marginTop: 50,
    marginBottom: 50,
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
  big_progress: {},
});
