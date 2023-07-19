import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Switch from '../../../atom/Switch';

const SwitchItem = ({ children, onChange, defaultValue }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{children}</Text>
      </View>
      <Switch value={defaultValue} handleOnPress={onChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 14,
    textAlignVertical: 'center',
    height: '100%',
    color: '#7D7D7D',
  },
});

export default SwitchItem;
