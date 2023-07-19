import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KsPaneTypes } from './types';

const Pane: React.FC<KsPaneTypes.PaneProps> = (props) => {
  const { padding, style } = props;

  let paddingVerticalValue: number;
  let paddingHorizontalValue: number;
  if (padding) {
    if (typeof padding === 'number') {
      paddingHorizontalValue = padding;
      paddingVerticalValue = padding;
    } else {
      const { vertical, horizontal } = padding;
      paddingVerticalValue = vertical ? vertical : 0;
      paddingHorizontalValue = horizontal ? horizontal : 0;
    }
  }

  const styles = StyleSheet.create({
    pane: {
      backgroundColor: '#fff',
      borderRadius: 10,
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    paddingVertical: {
      paddingVertical: paddingVerticalValue,
    },
    paddingHorizontal: {
      paddingHorizontal: paddingHorizontalValue,
    },
  });

  return (
    <View style={[styles.pane, styles.shadow, styles.paddingHorizontal, styles.paddingVertical, style]}>
      {props.children}
    </View>
  );
};

export default Pane;
