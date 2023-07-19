import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const Switch = ({ handleOnPress, value }) => {
  const [switchState, setSwitchState] = useState(value);
  const switchTranslate = useRef(new Animated.Value(0)).current;
  const switchBackground = useRef(new Animated.Value(0)).current;
  const switchBackgroundResult = switchBackground.interpolate({
    inputRange: [0, 1],
    outputRange: ['#7D7D7D', '#35D287'],
  });
  useEffect(() => {
    setSwitchState(value);
  }, [value]);

  useEffect(() => {
    if (switchState) {
      Animated.timing(switchTranslate, {
        toValue: 25,
        duration: 150,
        useNativeDriver: true,
      }).start();
      Animated.timing(switchBackground, {
        toValue: 1,
        duration: 0,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(switchTranslate, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
      Animated.timing(switchBackground, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    }
  }, [switchState]);

  const onPress = () => {
    handleOnPress(!switchState);
    setSwitchState((switchState) => !switchState);
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.switchContainer, { backgroundColor: switchBackgroundResult }]}>
        <Animated.View
          style={[
            styles.switchCircle,
            {
              transform: [
                {
                  translateX: switchTranslate,
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    padding: 1,
    width: 52,
    backgroundColor: '#7D7D7D',
    borderRadius: 14,
    marginLeft: 4,
  },
  switchCircle: {
    width: 25,
    height: 25,
    minHeight: 25,
    minWidth: 25,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
});

export default Switch;
