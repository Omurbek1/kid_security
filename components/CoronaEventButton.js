import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { L } from '@lang';


const CoronaEventButton = ({ onPress, visible }) => {
  return (
    visible ?
    <TouchableOpacity onPress={onPress}>
      <View style={styles.sharePane}>
        <Text style={styles.title}>{L('event')}</Text>
        <Text style={styles.title}>{L('anti_corona')}</Text>
      </View>
    </TouchableOpacity>
    : null
  );
};

const styles = StyleSheet.create({
  sharePane: {
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#00FF00',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '900',
    fontSize: 12,
  },
});

export default CoronaEventButton;
