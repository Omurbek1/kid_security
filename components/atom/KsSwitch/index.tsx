import React from 'react';
import { View, TouchableWithoutFeedback, Text, Animated } from 'react-native';

export interface KsSwitchProps {
  switchHeight?: number;
  switchWidth?: number;
  timing?: number;
  onSwitch?: (value: boolean) => void;
  value?: boolean;
  toggleBorderWidth?: number;
  borderRadius?: number;
}

const KsSwitch: React.FC<KsSwitchProps> = ({
  switchHeight,
  switchWidth,
  timing,
  value,
  onSwitch,
  toggleBorderWidth,
  borderRadius,
}) => {
  const _height = switchHeight ?? 20;
  const _width = switchWidth ?? 40;
  const _timing = timing ?? 200;
  const _borderWidth = toggleBorderWidth ?? 2;
  const _borderRadius = borderRadius ?? 5;
  const initPosition = value ? _width / 2 : 0;

  const [position] = React.useState(new Animated.ValueXY({ x: initPosition, y: 0 }));
  const [active, setActive] = React.useState(value ?? false);

  const opacityValue = position.x.interpolate({
    inputRange: [0, _width / 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const toggleToEnd = () => {
    Animated.timing(position.x, {
      toValue: _width / 2,
      duration: _timing,
      useNativeDriver: true,
    }).start();
  };
  const toggleToStart = () => {
    Animated.timing(position.x, {
      toValue: 0,
      duration: _timing,
      useNativeDriver: true,
    }).start();
  };

  const onSwitchPress = () => {
    if (active) toggleToStart();
    if (!active) toggleToEnd();
    setActive((value) => {
      const newValue = !value;
      onSwitch && onSwitch(newValue);
      return newValue;
    });
  };

  return (
    <TouchableWithoutFeedback onPress={onSwitchPress}>
      <View
        style={{
          height: _height,
          width: _width,
          borderRadius: _borderRadius,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#e7eced',
        }}>
        <Animated.View
          style={{
            opacity: opacityValue,
            backgroundColor: 'rgb(97, 184, 114)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}></Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              height: _height,
              borderRadius: _borderRadius,
              borderWidth: _borderWidth,
              borderColor: '#e7eced',
              width: _width / 2,
              backgroundColor: 'white',
            },
            {
              transform: [
                {
                  translateX: position.x,
                },
              ],
            },
          ]}>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View style={{ width: _borderWidth, height: '35%', borderRadius: 10, backgroundColor: '#e7eced' }}></View>
            <View
              style={{
                width: _borderWidth,
                height: '35%',
                borderRadius: 10,
                backgroundColor: '#e7eced',
                marginHorizontal: 2,
              }}></View>
            <View style={{ width: _borderWidth, height: '35%', borderRadius: 10, backgroundColor: '#e7eced' }}></View>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KsSwitch;
