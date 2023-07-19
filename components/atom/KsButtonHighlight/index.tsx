import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TouchableHighlight } from 'react-native';
import KsButtonTypes from '../KsButton/types';
import { Icon } from 'expo';
import { AppColorScheme } from '../../../shared/colorScheme';

interface KsButtonHighlightProps extends KsButtonTypes.KsButtonProps {
  underlayBackground: string;
  underlayTitleColor: string;
}

const KsButtonHighlight: React.FC<KsButtonHighlightProps> = ({
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
  underlayBackground,
  underlayTitleColor,
}) => {
  let _underlayBackground = underlayBackground ?? AppColorScheme.active;
  let _underlayTitleColor = underlayTitleColor ?? 'white';
  //console.log('color: ', titleStyle?.color, _underlayTitleColor);
  let backgroundColor = color || '#E04881';
  let textColor = titleStyle?.color ?? '#fff';
  let spinnerColor = color || '#fff';
  if (disabled) {
    backgroundColor = 'grey';
    textColor = 'black';
  } else if (outlined) {
    backgroundColor = '#fff';
    textColor = color || '#E04881';
    spinnerColor = color || '#E04881';
  }

  const [pressed, setPressed] = React.useState(false);
  const styles = StyleSheet.create({
    button: {
      opacity: hidden ? 0 : 10,
      backgroundColor: pressed ? _underlayBackground : backgroundColor,
      borderRadius: 100,
      minWidth: 110,
      minHeight: 35,
      paddingHorizontal: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      borderWidth: 2,
      borderColor: pressed ? _underlayBackground : color || '#E04881',
    },
    title: {
      color: textColor,
      fontSize: 14,
      fontWeight: '500',
    },
  });

  return (
    <TouchableHighlight
      underlayColor="transparent"
      onHideUnderlay={() => {
        setPressed(false);
      }}
      onShowUnderlay={() => {
        setPressed(true);
      }}
      onPress={onPress}>
      <View style={[styles.button, style]}>
        {loading ? (
          <ActivityIndicator color={spinnerColor} animating={true} style={{ paddingRight: 10 }}></ActivityIndicator>
        ) : null}
        <Text style={[styles.title, titleStyle, { color: pressed ? _underlayTitleColor : textColor }]}>{title}</Text>
        {icon && (
          <Icon
            name={icon.name}
            type={icon.type}
            size={icon.size}
            color={icon.color}
            containerStyle={{ position: 'absolute', right: '15%' }}></Icon>
        )}
      </View>
    </TouchableHighlight>
  );
};

export default KsButtonHighlight;

const styles = StyleSheet.create({});
