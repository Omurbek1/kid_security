import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import * as Metrica from '../analytics/Analytics';

const defaultProps = {
  icon: 'plus',
  type: 'octicon',
  font: 'font-awesome',
  secured: false,
  hint: '',
  keyboardType: 'default',
  editable: true,
  value: '',
  onPress: null,
};

export default class MenuItem extends Component {
  onPress(callback, name) {
    Metrica.event('side_menu_click', { name: name });
    if (callback) {
      callback();
    }
  }

  render() {
    const props = { ...defaultProps, ...this.props };
    return (
      <Button
        onPress={() => this.onPress(props.onPress, props.name)}
        large
        buttonStyle={styles.button}
        title={props.title}
        transparent={true}
        color="#000"
        icon={{ name: props.icon, type: props.type, color: '#000' }}
      />
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    maxHeight: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#fff',
  },
  input: {
    flex: 1,
    textAlign: 'left',
    color: '#000',
    height: 50,
    paddingLeft: 15,
  },
  icon: {
    color: '#fff',
    paddingLeft: 20,
    paddingTop: 13,
  },
});
