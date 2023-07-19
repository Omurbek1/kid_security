import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from 'react-native-elements';
import { AppColorScheme, MapColorScheme } from '../../../shared/colorScheme';
import { L } from '../../../lang/Lang';

export interface SpinnedButtonProps {
  style?: ViewStyle | ViewStyle[];
  onValueChange?: (value: number) => void;
  value?: number;
}

const RADIUS_LIST = [100, 125, 150, 175, 200, 225, 250, 375, 500, 750, 1000];
const RADIUS_INDEX = 1;

const getIndexOfRadiusList = (value: number) => {
  const index = RADIUS_LIST.findIndex((number) => number === value);
  if (index === -1) {
    return RADIUS_INDEX;
  }
  return index;
};

const GeoZoneRadius: React.FC<SpinnedButtonProps> = (props) => {
  const { onValueChange, style, value } = props;

  const [radiusIndex, setRadiusIndex] = useState(getIndexOfRadiusList(value));

  let radius = RADIUS_LIST[radiusIndex];

  const decrimentRadius = () => {
    if (radiusIndex > 0) {
      setRadiusIndex((value) => {
        const newIndex = value - 1;
        onValueChange && onValueChange(RADIUS_LIST[newIndex]);
        return newIndex;
      });
    }
  };
  const incrementRadius = () => {
    if (radiusIndex < RADIUS_LIST.length - 1) {
      setRadiusIndex((value) => {
        const newIndex = value + 1;
        onValueChange && onValueChange(RADIUS_LIST[newIndex]);
        return newIndex;
      });
    }
  };

  return (
    <View style={[styles.button, style]}>
      <View style={[styles.touchable, { borderRightWidth: 1, borderRightColor: AppColorScheme.passiveAccent }]}>
        <Icon
          name="minus"
          type="material-community"
          underlayColor="rgba(255,255,255,0.5)"
          containerStyle={[styles.rounded, { backgroundColor: AppColorScheme.passive }]}
          color="white"
          onPress={() => {
            decrimentRadius();
          }}></Icon>
      </View>

      <View style={styles.valueDisplay}>
        <Text style={styles.text}>
          {radius} <Text style={{ fontSize: 10 }}>{L('m')}</Text>
        </Text>
      </View>
      <View style={[styles.touchable, { borderLeftWidth: 1, borderLeftColor: AppColorScheme.passiveAccent }]}>
        <Icon
          name="plus"
          type="material-community"
          underlayColor="rgba(255,255,255,0.5)"
          color="white"
          containerStyle={[styles.rounded, { backgroundColor: AppColorScheme.active }]}
          onPress={() => {
            incrementRadius();
          }}></Icon>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: AppColorScheme.passiveAccent,
    alignItems: 'center',
    borderRadius: 100,
    padding: 10,
  },
  rounded: {
    borderRadius: 200,
    width: 30,
    height: 30,
    backgroundColor: AppColorScheme.accent,
  },
  touchable: { flex: 3, alignItems: 'center' },
  valueDisplay: { flex: 5, alignItems: 'center' },
  text: { color: 'black', fontSize: 18, fontWeight: '700' },
});

export default GeoZoneRadius;
