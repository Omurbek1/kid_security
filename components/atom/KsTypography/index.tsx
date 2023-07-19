import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { KsTypographyTypes } from './type';

const getFontStyles = (type: string) => {
  const initialStyles = {
    text: {
      fontWeight: '600',
      fontSize: 14,
      textAlign: 'auto',
    },
  };
  switch (type) {
    case 'h3':
      initialStyles.text.fontWeight = '600';
      initialStyles.text.fontSize = 16;
      break;
  }

  const styles = StyleSheet.create<any>(initialStyles);
  return styles;
};

const Typography: React.FC<KsTypographyTypes.KsTypographyProps> = (props) => {
  const { type, style, fontWeight, fontSize, textAlign } = props;
  let styles = StyleSheet.create({
    text: {
      fontWeight: fontWeight || 'normal',
      fontSize: fontSize || 14,
      textAlign: textAlign,
    },
  });
  if (type) {
    styles = getFontStyles(type);
  }
  return <Text style={[styles.text, style]}>{props.children}</Text>;
};

export default Typography;
