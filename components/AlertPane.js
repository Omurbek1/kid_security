import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, TouchableOpacity } from 'react-native';

const defaultProps = {
  visible: false,
};

export default class AlertPane extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };

    return props.visible ? (
      <View pointerEvents="auto" style={styles.addPhonePane}>
        <View style={styles.addPhonePaneContent}>
          {!this.props.titleText ? null : <Text style={styles.text2}>{this.props.titleText}</Text>}
          <View style={styles.buttons}>
            {this.props.onPressCancel && this.props.cancelButtonText && (
              <TouchableOpacity style={styles.cancel_button} onPress={this.props.onPressCancel}>
                <Text style={styles.cancel_button_text}>{this.props.cancelButtonText}</Text>
              </TouchableOpacity>
            )}

            {this.props.onPressAction && this.props.actionButtonText && (
              <TouchableOpacity
                color="white"
                style={styles.button}
                onPress={() => {
                  if (this.props.onPressAction) {
                    this.props.onPressAction();
                  }
                }}>
                <Text style={styles.button_text}>{this.props.actionButtonText}</Text>
              </TouchableOpacity>
            )}
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
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 5,
  },
  image: {
    width: 120,
    height: 120,
  },
  text1: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  text2: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  text3: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 10,
    color: '#000',
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
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ef4c77',
  },
  button_text: {
    fontSize: 16,
    color: 'white',
    fontWeight: '800',
  },
  cancel_button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: '#ef4c77',
    borderWidth: 1,
  },
  cancel_button_text: {
    fontSize: 16,
    color: '#000',
    fontWeight: '800',
  },
});
