import React, { Component } from 'react';
import { StyleSheet, TextInput, View, PixelRatio } from 'react-native';
import { Icon } from 'react-native-elements';

const defaultProps = {
  icon: 'user',
  font: 'font-awesome',
  secured: false,
  hint: '',
  keyboardType: 'default',
  editable: true,
  value: '',
  palceholderTextColor: 'rgba(255,255,255,0.7)',
  selectionColor: '#fff',
  iconColor: '#fff',
  textColor: '#fff',
};

export default class AuthInput extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    return (
      <View style={[styles.view, this.props.style]}>
        {props.icon ? (
          <Icon iconStyle={[styles.icon, { color: props.iconColor }]} name={props.icon} type={props.font} size={20} />
        ) : null}
        <TextInput
          style={[styles.input, { color: props.textColor }]}
          editable={props.editable}
          placeholder={props.hint}
          value={props.value}
          autoCapitalize="none"
          placeholderTextColor={props.palceholderTextColor}
          underlineColorAndroid="transparent"
          selectionColor={props.selectionColor}
          keyboardType={props.keyboardType}
          secureTextEntry={props.secured}
          onChangeText={props.onChangeText}
        />
      </View>
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
    color: '#fff',
    height: 50,
    paddingLeft: 15,
    fontSize: 14 / PixelRatio.getFontScale(),
  },
  icon: {
    color: '#fff',
    paddingLeft: 20,
    paddingTop: 13,
  },
});
