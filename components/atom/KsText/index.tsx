import React from 'react';
import { StyleSheet, Text, View, TextStyle, FontVariant } from 'react-native';

interface KsTextProps {
  size?: number;
  weight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  color?: string;
  style?: TextStyle;
}

const KsText: React.FC<KsTextProps> = ({ size, weight, color, children, style }) => {
  const _size = size ?? 14;
  const _weight = weight ?? '500';
  const _color = color ?? 'white';

  return <Text style={[{ fontSize: _size, fontWeight: _weight, color: _color }, style]}>{children}</Text>;
};

export default KsText;

const styles = StyleSheet.create({});
