import React, { Component } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { StyleSheet, Animated, Easing } from 'react-native';

const defaultProps = {
  title: 'Unnamed',
  titleStyle: {},
  onPress: null,
  isProgress: false,
  image: null,
  backgroundColor: 'red',
  animate: false,
};

export default class AnimatedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.animation = Animated.timing(this.state.animated, {
      duration: 1000,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
      isInteraction: false,
    });
    this.animationLoop = Animated.loop(this.animation);
  }

  componentDidUpdate(prevProps) {
    if (this.props.animate !== prevProps.animate) {
      if (this.props.animate) {
        this.animationLoop.start();
      } else {
        if (this.animationLoop) {
          this.animationLoop.stop();
          this.state.animated.setValue(0);
        }
      }
    }
  }

  render() {
    const props = { ...defaultProps, ...this.props };
    return (
      <View style={styles.button_outer}>
        <View style={styles.composite_button}>
          <Animated.View
            style={[
              styles.button,
              styles.substrate,
              {
                opacity: this.state.animated.interpolate({ inputRange: [0, 1], outputRange: [1.0, 0.0] }),
                transform: [
                  { scale: this.state.animated.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] }) },
                  { perspective: 1000 },
                ],
                backgroundColor: props.backgroundColor,
              },
            ]}
          />
          <TouchableOpacity
            disabled={props.isProgress}
            style={[styles.button, { backgroundColor: props.backgroundColor }]}
            onPress={props.onPress}>
            <Image style={styles.button_image} source={props.image} />
          </TouchableOpacity>
        </View>
        {props.title ? <Text style={[styles.button_text, props.titleStyle]}>{props.title}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button_outer: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    width: 150,
  },
  button_image: {
    resizeMode: 'contain',
    flex: 1,
  },
  button_text: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  button: {
    padding: 0,
    margin: 0,
    borderRadius: 30,
    width: 80,
    height: 80,
    alignContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  substrate: {
    position: 'absolute',
    flex: 1,
  },
  composite_button: {},
});
