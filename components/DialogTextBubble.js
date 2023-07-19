import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';

const defaultProps = {
  text: '<no text>',
  ts: 'ts',
};

class DialogTextBubble extends React.Component {
  render() {
    const props = { ...defaultProps, ...this.props };
    return (
      <TouchableOpacity style={styles.bubble_outer} onPress={props.onPress}>
        <View style={styles.bubble_with_ts}>
          <View style={styles.bubble}>
            <Text style={styles.name}>{props.sender}</Text>
            <Text>{props.text}</Text>
            <Text style={styles.ts}>{props.ts}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default DialogTextBubble;

const styles = StyleSheet.create({
  bubble_outer: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  bubble_with_ts: {
    flex: 1,
    flexDirection: 'column',
  },
  bubble: {
    borderRadius: 6,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'column',
  },
  ts: {
    fontSize: 11,
    opacity: 0.5,
    width: '100%',
    textAlign: 'right',
  },
  name: {
    marginBottom: 5,
    color: '#FF666F',
  },
});
