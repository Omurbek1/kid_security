import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import KsAlign from '../../atom/KsAlign';
import MapZoomButton from '../../MapZoomButton';
import { ColorScheme } from '../../../shared/colorScheme';

export interface IconProps {
  icon?: string;
  type?: string;
  outlined?: boolean;
}

interface MapOptionItemProps extends IconProps {
  title: string;
  number?: number;
  gap?: number;
  value?: number;
  onPress?: (map: number) => void;
  inactive?: boolean;
  active?: boolean;
}

export const MapOptionItem: React.FC<MapOptionItemProps> = ({
  inactive,
  title,
  value,
  number,
  icon,
  gap,
  onPress,
  active,
}) => {
  return (
    <TouchableHighlight
      underlayColor={inactive ? 'transparent' : 'rgba(255,102,112, 0.2)'}
      onPress={() => onPress && onPress(value)}>
      <View
        style={[
          style.container,
          { borderBottomColor: ColorScheme.white },
          { backgroundColor: active ? 'rgba(255,102,112, 0.2)' : 'transparent' },
        ]}>
        <KsAlign elementsGap={gap || 10} axis="horizontal" style={{ alignItems: 'center' }}>
          {icon && <MapZoomButton icon="layers" type="material-community" outlined />}
          {number && <Text>{number}.</Text>}
          <Text>{title}</Text>
        </KsAlign>
      </View>
    </TouchableHighlight>
  );
};

const style = StyleSheet.create({
  container: {
    paddingLeft: 60,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
});
