import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import KsButtonTypes from './types';
import KsAlign from '../KsAlign/index';
import { Icon } from 'react-native-elements';
import { AppColorScheme } from '../../../shared/colorScheme';

const KsButton: React.FC<KsButtonTypes.KsButtonProps> = ({
  outlined,
  title,
  hidden,
  style,
  titleStyle,
  onPress,
  disabled,
  color,
  loading,
  icon,
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
      minWidth: 110,
      minHeight: 35,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      borderWidth: 2,
      borderColor: borderColor,
    },
    title: {
      color: textColor,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.button, style]}>
        {loading ? (
          <ActivityIndicator color={spinnerColor} animating={true} style={{ paddingRight: 10 }}></ActivityIndicator>
        ) : null}
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {icon && (
          <Icon
            name={icon.name}
            type={icon.type}
            size={icon.size}
            color={icon.color}
            containerStyle={{ position: 'absolute', right: '15%' }}></Icon>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default KsButton;
