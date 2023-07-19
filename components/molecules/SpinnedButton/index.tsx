import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KsSpinnedButtonTypes } from './type';

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E04881',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    borderRadius: 100,
  },
  touchable: { flex: 3, alignItems: 'center' },
  valueDisplay: { flex: 5, alignItems: 'center' },
  text: { color: '#fff', fontSize: 16, fontWeight: '500' },
});

const emitHandler = (value: number, handler: (value: number) => void): void => {
  if (handler) handler(value);
};

const SpinnedButton: React.FC<KsSpinnedButtonTypes.SpinnedButtonProps> = (props) => {
  const { value, onValueChange, style, min, max, step } = props;
  const [points, setPoints] = useState(value || 0);

  const minValue = min ? min : 1;
  const maxValue = max ? max : 1000;
  const stepValue = step || 1;
  return (
    <View style={[styles.button, style]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={(): void => {
          setPoints((value) => {
            const newValue = value - stepValue;
            if (newValue < minValue) return value;
            emitHandler(newValue, onValueChange);
            return newValue;
          });
        }}>
        <Text style={styles.text}>-</Text>
      </TouchableOpacity>
      <View style={styles.valueDisplay}>
        <Text style={styles.text}>{points}</Text>
      </View>
      <TouchableOpacity
        style={styles.touchable}
        onPress={(): void => {
          setPoints((value) => {
            const newValue = value + stepValue;
            if (newValue > maxValue) return value;
            emitHandler(newValue, onValueChange);
            return newValue;
          });
        }}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpinnedButton;
