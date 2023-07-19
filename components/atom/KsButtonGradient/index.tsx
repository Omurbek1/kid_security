import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import KsButtonTypes from './types';

import { AppColorScheme } from '../../../shared/colorScheme';
import { LinearGradient } from 'expo-linear-gradient';

const KsButtonGradient: React.FC<KsButtonTypes.KsButtonProps> = ({
  outlined,
  title,
  hidden,

  titleStyle,
  onPress,
  disabled,
  color,
}) => {
  let backgroundColor = color || '#E04881';
  let borderColor = color || '#E04881';
  let textColor = '#fff';
  let spinnerColor = color || '#fff';
  if (disabled) {
    backgroundColor = 'transparent';
    textColor = AppColorScheme.passive;
    borderColor = AppColorScheme.passive;
  } else if (outlined) {
    backgroundColor = '#fff';
    textColor = color || '#E04881';
    spinnerColor = color || '#E04881';
  }

  const styles = StyleSheet.create({
    button: {
      opacity: hidden ? 0 : 10,
      backgroundColor: backgroundColor,
      borderRadius: 100,
      minWidth: 270,
      minHeight: 45,
      paddingHorizontal: 20,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      marginTop: 60,
    },
    title: {
      color: textColor,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#F36989', '#FF9B72', '#FF9B72']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default KsButtonGradient;
