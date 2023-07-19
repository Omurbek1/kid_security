import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { KsAlignTypes } from './types';

const getFlexDirection = (axis): 'row' | 'column' => {
  switch (axis) {
    case 'horizontal':
      return 'row';
    case 'vertical':
      return 'column';
    default:
      return 'column';
  }
};

const KsAlign: React.FC<KsAlignTypes.KsAlignProps> = (props) => {
  const {
    justifyContent,
    alignItems,
    children,
    elementsGap,
    axis,
    style,
  } = props;

  const flexDirection = getFlexDirection(axis);

  const styles = StyleSheet.create({
    horizontal: {
      flexDirection: flexDirection,
      justifyContent: justifyContent || null,
      alignItems: alignItems || null,
    },
    gap: {
      marginRight: axis === 'horizontal' ? elementsGap : 0,
      marginBottom: !axis || axis === 'vertical' ? elementsGap : 0,
    },
  });

  let elements = React.Children.toArray(children);

  if (elements.length > 0) {
    const lastElement = elements.pop();
    elements = elements.map((child: ReactElement) => {
      return React.cloneElement(child, {
        style: child.props.style ? [child.props.style, styles.gap] : styles.gap,
      });
    });
    elements.push(lastElement);
  }

  return <View style={[styles.horizontal, style]}>{elements}</View>;
};

export default KsAlign;
