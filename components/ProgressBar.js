import React from 'react';
import { StyleSheet, View } from 'react-native';

const defaultProps = {
  position: 25,
  max: 100,
  color: '#000',
  fill: 'red',
  width: 100,
  height: 5,
};

class ProgressBar extends React.Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    let progress = (props.width / props.max) * props.position;
    if (progress < 0) {
      progress = 0;
    } else if (progress > props.max) {
      progress = props.max;
    }

    return (
      <View style={[styles.container, { width: props.width, height: props.height }]}>
        <View style={[styles.bar, { width: props.width, height: props.height, backgroundColor: props.color }]}></View>
        <View
          style={[styles.progress, { backgroundColor: props.fill, width: progress, height: props.height + 1 }]}></View>
      </View>
    );
  }
}

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
  },
  progress: {
    position: 'absolute',
  },
});
