import React, { Component } from 'react';
import { StyleSheet, Dimensions, Animated } from 'react-native';

import { TouchableOpacity, View } from 'react-native';

export default class SideMenuOverlay extends Component {
  render() {
    return this.props.visible ? (
      <Animated.View style={[styles.overlay, { opacity: this.props.opacity }]}>
        <TouchableOpacity
          onPress={() => {
            this.props.onToggleMenu();
          }}
          style={styles.overlay2}>
          <View></View>
        </TouchableOpacity>
      </Animated.View>
    ) : null;
  }
}

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgb(52, 52, 52)',
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
  },
  overlay2: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
  },
});
