import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, ViewStyle, TextStyle } from 'react-native';
import KsAlign from '../KsAlign';
import { Icon, IconObject } from 'react-native-elements';
import { AppColorScheme, UnderlayColors } from '../../../shared/colorScheme';
import KsSwitch from '../KsSwitch/index';
import { KsSwitchProps } from '../KsSwitch/index';

interface KsListItemProps {
  withSwitch?: boolean;
  index: number;
  title: string;
  switchOptions?: KsSwitchProps;
  containerStyle?: ViewStyle[] | ViewStyle;
  onPress?: () => void;
  inactive?: boolean;
  icon?: IconObject;
  titleStyle?: TextStyle[] | TextStyle;
  justifyContent?: 'space-between' | 'center';
  gap?: number;
  rightText?: string;
  rightStyle?: TextStyle;
  showArrow?: boolean;
  withSeparator?: boolean;
};

const KsListItem: React.FC<KsListItemProps> = ({
  withSwitch,
  switchOptions,
  title,
  index,
  icon,
  titleStyle,
  containerStyle,
  onPress,
  inactive,
  justifyContent,
  gap,
  rightText,
  rightStyle,
  showArrow = true,
  withSeparator = true,
}) => {
  const [pressed, setPressed] = React.useState(false);

  const getSwitch = () => {
    return (
      <KsSwitch
        switchHeight={switchOptions?.switchHeight}
        onSwitch={switchOptions?.onSwitch}
        switchWidth={switchOptions?.switchWidth}
        value={switchOptions?.value}
        timing={switchOptions?.timing}></KsSwitch>
    );
  };

  const getIcon = () => {
    const name = icon?.name ?? 'arrow-right';
    const type = icon?.type ?? 'material-community';
    const color = icon?.color ?? 'black';
    return <Icon name={name} type={type} color={pressed ? AppColorScheme.active : color}></Icon>;
  };

  const getText = (text: String) => {
    return <Text style={rightStyle}>{text}</Text>;
  };

  const getTailElement = () => {
    return withSwitch ? getSwitch() : getIcon();
  };

  return (
    <TouchableHighlight
      underlayColor={!inactive ? UnderlayColors.active : 'transparent'}
      onHideUnderlay={() => {
        setPressed(false);
      }}
      onShowUnderlay={() => {
        setPressed(true);
      }}
      onPress={() => onPress && onPress()}
      style={[
        {
          padding: 15,
          borderBottomColor: AppColorScheme.passiveAccent,
          borderBottomWidth: !withSeparator ? 0 : 1,
        },
        containerStyle,
      ]}>
      <KsAlign
        axis="horizontal"
        elementsGap={gap ?? 0}
        style={{ alignItems: 'center', justifyContent: justifyContent ?? 'space-between' }}>
        <View style={{ flexDirection: 'row', flex: 10 }}>
          {index ? (
            <View style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: pressed && !inactive ? 'bold' : 'normal', color: '#000' }}>
                {index}.
              </Text>
            </View>
          ) : null}
          <View>
            <Text
              style={[
                { fontSize: 16, marginRight: 40, color: '#000', fontWeight: pressed && !inactive ? 'bold' : 'normal' },
                titleStyle,
              ]}>
              {title}
            </Text>
          </View>
        </View>
        {rightText ? getText(rightText) :
          (showArrow && <View style={{ flex: 1, alignItems: 'center' }}>{getTailElement()}</View>)}
      </KsAlign>
    </TouchableHighlight>
  );
};

export default KsListItem;

const styles = StyleSheet.create({});
