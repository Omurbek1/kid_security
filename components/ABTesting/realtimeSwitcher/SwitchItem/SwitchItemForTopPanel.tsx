import React from 'react';
import { StyleSheet, View } from 'react-native';
import { L } from '../../../../lang/Lang';
import SwitchItem from './SwitchItem';
const SwitchItemForTopPanel = ({ defaultValue, onChangeRealtimeSwitcher, isHasTopItem = false }) => {
  return (
    <View style={[styles.wrap, isHasTopItem ? { marginTop: 12 } : {}]}>
      <View style={styles.container}>
        <SwitchItem defaultValue={defaultValue} onChange={onChangeRealtimeSwitcher}>
          {L('map_position_in_real_time')}
        </SwitchItem>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    maxWidth: '68%',
    paddingLeft: 25,
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default SwitchItemForTopPanel;
