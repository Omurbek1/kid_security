import React, { Component } from 'react';
import { View, Animated, Easing, Text } from 'react-native';
import { StyleSheet, Dimensions } from 'react-native';

import MenuOverlay from './SideMenuOverlay';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
let hiddenX = -width * 0.8;

export default class SideMenu extends Component {
  state = {
    visible: false,
    x: new Animated.Value(hiddenX),
    alpha: new Animated.Value(0.0),
  };

  show() {
    this.setState({ visible: true }, () => {
      Animated.parallel([
        Animated.timing(this.state.x, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(this.state.alpha, {
          toValue: 0.85,
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    });
  }

  hide() {
    Animated.parallel([
      Animated.timing(this.state.x, {
        toValue: hiddenX,
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(this.state.alpha, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(() => {
      this.setState({ visible: false });
    });
  }

  toggle() {
    this.state.visible ? this.hide() : this.show();
  }

  closeMenu() {
    if (this.state.visible) {
      this.hide();
      return true;
    } else {
      return false;
    }
  }

  render() {
    let { navigation, onToggleMenu, content } = this.props;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <MenuOverlay
          visible={this.state.visible}
          opacity={this.state.alpha}
          onToggleMenu={onToggleMenu}
          navigation={navigation}
        />
        <Animated.View
          style={[
            styles.menu,
            {
              transform: [
                {
                  translateX: this.state.x,
                },
              ],
            },
          ]}>
          {content}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: height,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  menu: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'absolute',
    left: 0,
    top: 0,
    width: width * 0.8,
    height: height,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  menuItem: {
    paddingTop: 10,
  },
});
