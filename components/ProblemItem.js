import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';

const defaultProps = {
  text: '#000',
  visible: true,
};

export default class ProblemItem extends Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    return props.visible ? (
      <View style={styles.problem}>
        <Icon type="evilicon" name="close-o" color="red" size={20} />
        <Text style={styles.problem_text}>{props.text}</Text>
      </View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  problem: {
    backgroundColor: 'white',
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  problem_text: {
    fontSize: 13,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
